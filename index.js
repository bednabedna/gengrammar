function jsExport(name) {
    return `exports.${name} = ${name}\n`
}

function jsFunction(name, body) {
    if (!/^[a-zA-Z_$][a-zA-Z0-9_$]*/.test(name))
        throw "ERROR: Invalid js function name " + JSON.stringify(name)

    return `function ${name}(text, parent, pos=0) {
        var start = pos
        var accept = true
        var children = parent ? [] : null
        ${body}
        if (accept && pos !== start) {
            var end = pos
            if(parent)
                parent.push({
                    name: "${name}",
                    text: text.substring(start, end),
                    children
                })
            return end
        }
        return -1
    }
    `
}

function callFunc(name) {
    return {
        matches: name,
        advanceBy: null
    }
}

function isString(string) {
    return {
        matches: `text.startsWith(${JSON.stringify(string)}, pos)`,
        advanceBy: String(string.length)
    }
}

function isChar(string) {
    if (string.length !== 1)
        throw "expected char"
    return {
        matches: `text.charCodeAt(pos) === ${string.charCodeAt(0)} /*${JSON.stringify(string)}*/`,
        advanceBy: "1"
    }
}

function isInRange(from, to) {
    if (from.length !== 1)
        throw "'from' expected to be char"
    if (to.length !== 1)
        throw "'to' expected to be char"
    const f = from.charCodeAt(0)
    const t = to.charCodeAt(0)
    if (f > t)
        throw `invalid range (${f}, ${t})`
    return {
        matches: `text.charCodeAt(pos) >= ${f} && text.charCodeAt(pos) <= ${t}`,
        advanceBy: "1"
    }
}

function isAny() {
    return {
        matches: "pos < text.length",
        advanceBy: "1"
    }
}

const ESCAPES = {
    d: isInRange("0", "9"),
    D: isNotInSet([isInRange("0", "9")]),
    w: isInSet([isInRange("a", "z"), isInRange("A", "Z"), isInRange("0", "9"), isChar("_")]),
    W: isNotInSet([isInRange("a", "z"), isInRange("A", "Z"), isInRange("0", "9"), isChar("_")]),
    s: isInSet([isChar(" "), isChar("\t"), isChar("\n")]),
    S: isNotInSet([isChar(" "), isChar("\t"), isChar("\n")]),
    n: isChar("\n"),
    t: isChar("\t"),
}

function isEscape(char) {
    if (char.length !== 1)
        throw "Invalid escape length " + char.length
    return ESCAPES[char] || isChar(char)
}

function isInSet(rules, negative) {
    if (!rules.length || rules.some(r => r.advanceBy !== '1'))
        throw "Invalid set"
    const n = negative ? 'pos < text.length && !' : ''
    return {
        matches: `${n}(${rules.map(r => r.matches).join(' || ')})`,
        advanceBy: "1"
    }
}

function isNotInSet(rules) {
    return isInSet(rules, true)
}

function concat(rules) {
    if (!rules.length)
        throw "Empty rules in concat"
    const last = rules[rules.length - 1]
    let result = Array.isArray(last) ?
        or(last, "") :
        cardinality(last.rule, last.min, last.max)
    for (let i = rules.length - 2; i >= 0; --i) {
        const rule = rules[i]
        result = Array.isArray(rule) ?
            or(rule, result) :
            cardinality(rule.rule, rule.min, rule.max, result)
    }
    return result
}

function or(rules, next) {
    if (!rules.length)
        throw "No rules"
    const last = rules[rules.length - 1]
    let result = Array.isArray(last) ?
        concat(last) :
        cardinality(last.rule, last.min, last.max)
    for (let i = rules.length - 2; i >= 0; --i) {
        const rule = rules[i]
        result =
            `var prev = pos
            ${Array.isArray(rule) ? concat(rule) : cardinality(rule.rule, rule.min, rule.max)}
            if (!accept) {
                pos = prev
                ${result}
            }
            `
    }
    return result + next
}

function cardinality(rule, min, max, next = "") {
    if (min === 1 && max === 1)
        return oneCard(rule, next)
    if (min === 0 && max === 1)
        return zeroOrOneCard(rule, next)
    if (min === 0 && max === Infinity)
        return zeroOrMoreCard(rule, next)
    if (min === 1 && max === Infinity)
        return oneCard(rule, zeroOrMoreCard(rule, next))
    if (min >= 0 && max !== Infinity)
        return minMaxCard(rule, next, min, max)
    throw "Invalid cardinality " + JSON.stringify([min, max])
}

function oneCard(rule, next) {
    if (Array.isArray(rule)) {
        if (next)
            return `${concat(rule)}
            if(accept) {
                ${next}
            }
            `
        return concat(rule)
    }
    if (rule.rule) {
        return cardinality(rule.rule, rule.min, rule.max, next)
    }
    if (!rule.advanceBy)
        return `var newPos = ${rule.matches}(text, children, pos) /*1*/
        accept = newPos !== -1
        if(accept) {
            pos = newPos
            ${next}
        }
        `
    return `accept = ${rule.matches}
        if(accept) {
            pos += ${rule.advanceBy}
            ${next}
        }
        `
}

function zeroOrOneCard(rule, next) {
    if (Array.isArray(rule))
        return `var prev = pos
        ${concat(rule)}
        if(!accept) {
            accept = true
            pos = prev
        }
        ${next}
        `
    if (!rule.advanceBy)
        return `var newPos = ${rule.matches}(text, children, pos) /*2*/
        accept = newPos !== -1
        if(accept) {
            pos = newPos
        } else {
            accept = true
        }
        ${next}
        `
    return `accept = ${rule.matches}
        if(accept) {
            pos += ${rule.advanceBy}
        } else {
            accept = true
        }
        ${next}
        `
}

function zeroOrMoreCard(rule, next) {
    if (Array.isArray(rule))
        return `var prev = pos
        ${concat(rule)}
        while(accept) {
            prev = pos
            ${concat(rule)}
            if (pos === prev) break
        }
        pos = prev
        accept = true
        ${next}
        `
    if (rule.rule) {
        return cardinality(rule.rule, rule.min, rule.max, next)
    }
    if (!rule.advanceBy)
        return `var newPos = ${rule.matches}(text, children, pos) /*3*/
        accept = newPos !== -1
        while(accept) {
            pos = newPos
            newPos = ${rule.matches}
            accept = newPos !== -1
        }
        accept = true
        ${next}
        `
    return `accept = ${rule.matches}
        while(accept) {
            pos += ${rule.advanceBy}
            accept = ${rule.matches}
        }
        accept = true
        ${next}
        `
}

function minMaxCard(rule, next, min, max) {
    if (Array.isArray(rule))
        return `for (let i = 0; i < ${min}; ++i) {
            var lastPos = pos
            ${concat(rule)}
            if(!accept) {
                pos = lastPos
                break
            } 
        }
        if(accept) {
            for (let i = 0; i < ${max - min}; ++i) {
                var lastPos = pos
                ${concat(rule)}
                if (!accept) {
                    pos = lastPos
                    break
                }
            }
            ${next}
        }
        `

    if (!rule.advanceBy) {
        if (min === 1)
            return `var newPos = ${rule.matches}(text, children, pos)
            accept = newPos !== -1
            if(accept) {
                pos = newPos
                for (let i = 0; i < ${max - min}; ++i) {
                    newPos = ${rule.matches}(text, children, newPos) /*4*/
                    if (newPos === -1) break
                    pos = newPos
                }
                ${next}
            }
            `
        return `for (let i = 0; i < ${min}; ++i) {
            var newPos = ${rule.matches}(text, children, pos) /*5*/
            accept = newPos !== -1
            if(!accept) break
            pos = newPos
        }
        if(accept) {
                pos = newPos
                for (let i = 0; i < ${max - min}; ++i) {
                    newPos = ${rule.matches}(text, children, newPos) /*6*/
                    if (newPos === -1) break
                }
                ${next}
            }
        `
    }
    if (min === 1)
        return `accept = ${rule.matches}
        if(accept) {
            pos += ${rule.advanceBy}
            for (let i = 0; i < ${max - min}; ++i) {
                if (!(${rule.matches})) break
                pos += ${rule.advanceBy}
            }
            ${next}
        }
        `
    return `for (let i = 0; i < ${min}; ++i) {
            accept = ${rule.matches}
            if(!accept) break
            pos += ${rule.advanceBy}
        }
        if(accept) {
            for (let i = 0; i < ${max - min}; ++i) {
                if (!(${rule.matches})) break
                pos += ${rule.advanceBy}
            }
            ${next}
        }
        `
}

function createRules(rules) {
    const buff = []
    for (let key in rules) {
        buff.push(jsExport(key))
    }
    for (let key in rules) {
        buff.push(jsFunction(key, rules[key]))
    }
    return buff.join('\n')
}

const one = rule => mergeCardinalities(rule, 1, 1)
const zeroOrOne = rule => mergeCardinalities(rule, 0, 1)
const zeroOrMore = rule => mergeCardinalities(rule, 0, Infinity)
const oneOrMore = rule => mergeCardinalities(rule, 1, Infinity)

function mergeCardinalities(rule, min, max) {
    if (!rule.rule) {
        return ({ rule, min, max })
    }
    return ({
        rule: rule.rule,
        min: rule.min * min,
        max: rule.max * max
    })
}

//---------------------------
const fs = require("fs")
const assert = require("assert")


function rulesParser() {
    const spaces = zeroOrMore(isEscape("s"))
    return createRules({
        // "\\." 
        "escape": concat([one(isChar("\\")), one(isAny())]),
        // [a-zA-Z_$][a-zA-Z0-9_$]*
        "ident": concat([
            one(isInSet([isInRange("a", "z"), isInRange("A", "Z"), isChar("_"), isChar("$")])),
            zeroOrMore(isInSet([isInRange("a", "z"), isInRange("A", "Z"), isInRange("0", "9"), isChar("_"), isChar("$")]))
        ]),
        // '"(\\"|[^"])*"'
        "str": concat([
            one(isChar('"')),
            zeroOrMore([
                [ //OR 
                    [one(isChar("\\")), one(isChar('"'))],
                    one(isNotInSet([isChar('"')]))
                ]
            ]),
            one(isChar('"')),
        ]),
        // "[^" ( escape | [^\]] )+ ]     TODO: ranges
        "nset": concat([
            one(isString('[^')),
            oneOrMore([
                [ //OR 
                    one(callFunc("escape")),
                    one(isNotInSet([isChar(']')]))
                ]
            ]),
            one(isChar(']')),
        ]),
        // "[" ( escape | [^\]] )+ ]     TODO: ranges
        "set": concat([
            one(isChar('[')),
            oneOrMore([
                [ //OR 
                    one(callFunc("escape")),
                    one(isNotInSet([isChar(']')]))
                ]
            ]),
            one(isChar(']')),
        ]),
        // "[?*+]"
        "card": concat([one(isInSet([isChar("?"), isChar("*"), isChar("+")]))]),
        // ((par|escape|str|ident)\s*card?\s*)+
        "and": cardinality([
            [ //OR 
                one(callFunc("par")),
                one(callFunc("escape")),
                one(callFunc("str")),
                one(callFunc("nset")),
                one(callFunc("set")),
                one(callFunc("ident")),
            ],
            spaces,
            zeroOrOne(callFunc("card")),
            spaces
        ], 1, Infinity),
        // (par|and)(\s*"|"\s*(par|and))+
        "or": concat([
            [ //OR 
                one(callFunc("par")),
                one(callFunc("and")),
            ],
            oneOrMore([
                spaces,
                one(isChar("|")),
                spaces,
                [ //OR 
                    one(callFunc("par")),
                    one(callFunc("and")),
                ],
            ])
        ]),
        // "("\s*(or|and)\s*")"card?
        "par": concat([
            one(isChar("(")),
            spaces,
            [ //OR
                one(callFunc("or")),
                one(callFunc("and")),
            ],
            spaces,
            one(isChar(")")),
            spaces,
            zeroOrOne(callFunc("card"))
        ]),
        // ident\s*"="\s*(par(\s*card)?|or|and)
        "rule": concat([
            one(callFunc("ident")),
            spaces,
            one(isChar("=")),
            spaces,
            [ //OR 
                one(callFunc("or")),
                one(callFunc("and")),
                [one(callFunc("par")), zeroOrOne([spaces, one(callFunc("card"))])],
            ]
        ]),
        // (\s*rule\s*;)+\s*
        "rules": concat([oneOrMore([spaces, one(callFunc("rule")), spaces, one(isChar(";"))]), spaces])
    },)
}

function compileRule(rule) {
    switch (rule.name) {
        case "par":
            const children = rule.children
            assert(children.length)
            const firstChild = children[0]
            const lastChild = children[children.length - 1]
            if (lastChild.name === "card") {
                assert(children.length === 2)
                const compiled = compileRule(firstChild)
                switch (lastChild.text) {
                    case "?":
                        return zeroOrOne(compiled)
                    case "*":
                        return zeroOrMore(compiled)
                    case "+":
                        return oneOrMore(compiled)
                    default:
                        throw "Unexpected cardinality " + JSON.stringify(lastChild.text)
                }
            } else {
                assert(rule.children.length === 1)
                return compileRule(firstChild)
            }
        case "and":
            if (rule.children === 1)
                return compileRule(rule.children[0])
            return compileAnd(rule.children)
        case "or":
            if (rule.children === 1)
                return compileRule(rule.children[0])
            return [[compileAnd(rule.children)]]
        case "str":
            const str = JSON.parse(rule.text)
            if (str.length === 1)
                return one(isChar(str))
            else
                return one(isString(str))
        case "ident":
            return one(callFunc(rule.text))
        case "escape":
            return one(isEscape(rule.text[1]))
        case "nset":
            // TODO: ranges are not yet handled here...
            const inNSetChars = rule.text.substring(2, rule.text.length - 1).split('').map(isChar)
            return one(isNotInSet(inNSetChars))
        case "set":
            // TODO: ranges are not yet handled here...
            const inSetChars = rule.text.substring(1, rule.text.length - 1).split('').map(isChar)
            return one(isInSet(inSetChars))
        case "card":
            return rule
        default:
            throw "Unexpected rule name " + JSON.stringify(rule.name)
    }
}

function compileAnd(children) {
    let rules = []
    for (let child of children) {
        const rule = compileRule(child)
        if (rule.name === "card") {
            assert(rules.length)
            const previousRule = rules.pop()
            switch (rule.text) {
                case "?":
                    rules.push(zeroOrOne(previousRule))
                    break
                case "*":
                    rules.push(zeroOrMore(previousRule))
                    break
                case "+":
                    rules.push(oneOrMore(previousRule))
                    break
                default:
                    throw "Unexpected cardinality " + JSON.stringify(rule.text)
            }
        } else {
            rules.push(rule)
        }
    }
    return rules
}

function compileRules(rules) {
    assert(rules.name, "rules")
    const compiledRules = {}
    for (rule of rules.children) {
        assert(rule.name, "rule")
        assert(rule.children.length === 2)
        const ruleName = rule.children[0].text
        let ruleBody = rule.children[1]
        const compiled = compileAnd(ruleBody.children)
        assert(compiled.length)
        compiledRules[ruleName] = concat(compiled)
    }
    return createRules(compiledRules)
}

function parseRules(outfile, input) {
    fs.writeFileSync("./generated/parser.js", rulesParser(), "utf8")
    const parser = require("./parser")
    const out = []
    const pos = parser.rules(input, out)
    console.log(JSON.stringify(out, null, 3))
    assert(pos !== -1, "input not accepted")
    assert(pos === input.length, "input not fully consumed (" + pos + "/" + input.length + ")")
    const rules = out[0]
    fs.writeFileSync(outfile, compileRules(rules), "utf8")
}


parseRules(
    "./generated/test.js",
    `
    JSON = \\s* (NULL | BOOL | NUMBER | STRING | LIST | OBJECT) \\s*;
    NULL = "null";
    BOOL = "true" | "false";
    NUMBER = ("0" | \\d+) ("." \\d+)?;
    STRING = "\\"" [^"]* "\\"";
    LIST = "[" \\s* (JSON ("," JSON)* )?  \\s*  "]";
    OBJECT = "{" \\s* (STRING \\s* ":" \\s* JSON ("," \\s* STRING \\s* ":" \\s* JSON )* )?  \\s*  "}";
    `
)
const generated = require("./generated/test")
console.log("----------------------")
const input = '{"chiave": 123, "lista": [null, ["annidata", 2.0]]}'
const out = []
const pos = generated.JSON(input, out)
assert(pos !== -1, "input not accepted")
assert(pos === input.length, "input not fully consumed (" + pos + "/" + input.length + ")")
console.log(JSON.stringify(out, null, 3))
