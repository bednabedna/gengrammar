let counter = 0

function newVar(name) {
    return name + (++counter)
}

class Predicate {
    writeJs(_) {
        throw "Abstract method cannot be called!"
    }
}

class GroupPredicate extends Predicate {
    constructor(children) {
        super()
        if (!Array.isArray(children))
            throw "Children is not an array"
        if (!children.length)
            throw "Empty children"
        if (!children.every(c => c instanceof Predicate))
            throw "Children should be an array of predicates"
        this.children = children
    }
}

class AndPredicate extends GroupPredicate {
    writeJs(buffer) {
        const prevPos = newVar('prevPos')
        const prevChildLen = newVar("prevChildLen")
        buffer.push('let ', prevPos, ' = pos\n')
        buffer.push('let ', prevChildLen, ' = children.length\n')
        this.children[0].writeJs(buffer)
        buffer.push('\n')
        for (let i = 1; i < this.children.length; ++i) {
            buffer.push('if(a) {\n')
            this.children[i].writeJs(buffer)
        }
        for (let i = 1; i < this.children.length; ++i) {
            buffer.push('\n}\n')
        }
        buffer.push(`if(!a) {
            pos = ${prevPos}   
            children.length = ${prevChildLen}   
        }`)
    }
}

class OrPredicate extends GroupPredicate {
    writeJs(buffer) {
        this.children[0].writeJs(buffer)
        buffer.push('\n')
        for (let i = 1; i < this.children.length; ++i) {
            buffer.push('if(!a) {\n')
            this.children[i].writeJs(buffer)
            buffer.push('\n}\n')
        }
    }
}

class LoopPredicate extends Predicate {
    constructor(predicate, min, max) {
        super()
        if (!(predicate instanceof Predicate))
            throw "predicate should be a predicate"
        if (!Number.isInteger(min))
            throw "min should be an integer"
        if (!Number.isInteger(max) && max !== Infinity)
            throw "max should be an integer of infinity"
        if (min > max)
            throw "min should be less or equal to max"
        this.predicate = predicate
        this.min = min
        this.max = max
    }
    writeJs(buffer) {
        if (this.min === 0 && this.max === 1) {
            this.predicate.writeJs(buffer)
            buffer.push('\na = true\n')
            return
        }
        const c = newVar("c")
        const prevPos = newVar("prevPos")
        const prevChildLen = newVar("prevChildLen")
        buffer.push('\nlet ', c, ' = 0\n')
        if (this.min !== 0) {
            buffer.push('let ', prevPos, ' = 0\n')
            buffer.push('let ', prevChildLen, ' = 0\n')
        }
        buffer.push('do {\n')
        this.predicate.writeJs(buffer)
        if (this.max !== Infinity) {
            buffer.push('} while (a && ++', c, ' < ', this.max, ');\n')
        } else {
            buffer.push('} while (a && ++', c, ');\n')
        }
        if (this.min === 0) {
            buffer.push('\na = true\n')
        } else {
            buffer.push(`
                a = ${c} >= ${this.min}
                if (!a) {
                    pos = ${prevPos}
                    children.length = ${prevChildLen}
                }
            `)
        }

    }
}

class StringPredicate extends Predicate {
    constructor(string) {
        super()
        if (typeof string !== 'string')
            throw "expected string"
        this.string = string
    }

    writeJs(buffer) {
        buffer.push(
            'if (a = /* string */ text.startsWith(', JSON.stringify(this.string), ', pos)) {\n',
            'pos += ', this.string.length, '\n',
            '}\n'
        )
    }
}

class RuleCallPredicate extends Predicate {
    constructor(ruleName) {
        super()
        if (typeof ruleName !== 'string')
            throw "expected string"
        if (!/^[a-zA-Z_$][a-zA-Z0-9_$]*/.test(ruleName))
            throw "invalid rule name " + JSON.stringify(ruleName)
        this.ruleName = ruleName
    }

    writeJs(buffer) {
        const match = newVar("match")
        buffer.push(
            'let ', match, ' = ', this.ruleName, '(text, pos)\n',
            'if (a = (', match, ' !== null)) {\n',
            'pos += ', match, '.end - ', match, '.start\n',
            'children.push(', match, ')\n',
            '}\n'
        )
    }
}

class CharPredicate extends Predicate {
    constructor(jsPredicate) {
        if (typeof jsPredicate !== 'string')
            throw "expected string"
        super()
        this.jsPredicate = jsPredicate
    }

    writeJs(buffer) {
        buffer.push(
            'if (a = /* char predicate */ (', this.jsPredicate, ')) {\n',
            'pos += 1\n',
            '}\n'
        )
    }
}

// -------------------------------[EXPORTS]--------------------------------------

exports.compileRules = function (rules) {
    const buffer = []
    for (let ruleName in rules) {
        const predicate = rules[ruleName]
        if (!(predicate instanceof Predicate))
            throw "Rule should contain a predicate"
        buffer.push(`exports.${ruleName} = ${ruleName}
            function ${ruleName}(text, pos=0) {
                let start = pos
                let a = true
                let children = []
            `)
        predicate.writeJs(buffer)
        buffer.push(`
                if (a) {
                    return ({
                        name: "${ruleName}",
                        start,
                        end: pos,
                        children
                    })
                }
                return null
            }
        `)
    }
    return buffer.join('')
}


function isChar(string) {
    if (string.length !== 1)
        throw "expected char"
    return new CharPredicate(`/* char ${JSON.stringify(string)} */ text.charCodeAt(pos) === ${string.charCodeAt(0)}`)
}
exports.isChar = isChar

function isInRange(from, to) {
    if (from.length !== 1)
        throw "'from' expected to be char"
    if (to.length !== 1)
        throw "'to' expected to be char"
    const f = from.charCodeAt(0)
    const t = to.charCodeAt(0)
    if (f > t)
        throw `invalid range (${f}, ${t})`
    return new CharPredicate(`/* range from ${JSON.stringify(from)} to ${JSON.stringify(to)} */ text.charCodeAt(pos) >= ${f} && text.charCodeAt(pos) <= ${t}`)
}
exports.isInRange = isInRange

function isInSetList(predicates, negative) {
    if (!Array.isArray(predicates) || !predicates.length || !predicates.every(r => r instanceof CharPredicate))
        throw "Invalid predicates for set"
    const n = negative ? '/* nset */ pos < text.length && !' : '/* set */ '
    const buffer = [`${n}(`]
    buffer.push(predicates[0].jsPredicate)
    for (let i = 1; i < predicates.length; ++i) {
        buffer.push(' || ')
        buffer.push(predicates[i].jsPredicate)
    }
    buffer.push(')')
    return new CharPredicate(buffer.join(''))
}
exports.isInSetList = isInSetList

function isInSet() {
    return isInSetList([...arguments])
}
exports.isInSet = isInSet

function isNotInSetList(rules) {
    return isInSetList(rules, true)
}
exports.isNotInSetList = isNotInSetList

function isNotInSet() {
    return isNotInSetList([...arguments])
}
exports.isNotInSet = isNotInSet

const ESCAPES = {
    d: isInRange("0", "9"),
    D: isNotInSet(isInRange("0", "9")),
    w: isInSet(isInRange("a", "z"), isInRange("A", "Z"), isInRange("0", "9"), isChar("_")),
    W: isNotInSet(isInRange("a", "z"), isInRange("A", "Z"), isInRange("0", "9"), isChar("_")),
    s: isInSet(isChar(" "), isChar("\t"), isChar("\n")),
    S: isNotInSet(isChar(" "), isChar("\t"), isChar("\n")),
    n: isChar("\n"),
    t: isChar("\t"),
}

exports.isAnyChar = function () {
    return new CharPredicate(`/* any char */ pos < text.length`)
}

exports.isEscape = function (char) {
    if (char.length !== 1)
        throw "Invalid escape length " + char.length
    return ESCAPES[char] || isChar(char)
}

exports.isString = function (string) {
    return new StringPredicate(string)
}

exports.isRule = function (ruleName) {
    return new RuleCallPredicate(ruleName)
}

function andList(predicates) {
    if (predicates.length === 1) {
        if (!(predicates[0] instanceof Predicate))
            throw "expected predicate"
        return predicates[0]
    }
    return new AndPredicate(predicates)
}
exports.andList = andList

exports.and = function () {
    return andList([...arguments])
}

function orList(predicates) {
    if (predicates.length === 1) {
        if (!(predicates[0] instanceof Predicate))
            throw "expected predicate"
        return predicates[0]
    }
    return new OrPredicate(predicates)
}
exports.orList = orList

exports.or = function () {
    return orList([...arguments])
}

exports.zeroOrOne = function (predicate) {
    return new LoopPredicate(predicate, 0, 1)
}

exports.zeroOrMore = function (predicate) {
    return new LoopPredicate(predicate, 0, Infinity)
}

exports.oneOrMore = function (predicate) {
    return new LoopPredicate(predicate, 1, Infinity)
}

exports.minMax = function (predicate, min, max) {
    return new LoopPredicate(predicate, min, max)
}


