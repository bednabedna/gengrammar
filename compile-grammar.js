const {
    andList, compileRules, isAnyChar, isChar,
    isInRange, isInSetList, isNotInSetList, isRule, isString,
    oneOrMore, orList, zeroOrMore, zeroOrOne, isEscape
} = require('./grammar')


function compileGrammarMatch(match, input) {
    if (!match)
        throw "no match"
    if (typeof input !== 'string')
        throw "input is not a string"
    if (match.end < input.length)
        throw "input not fully consumed"
    const rules = {}
    for (let rule of match.children) {
        const ruleName = input.substring(rule.children[0].start, rule.children[0].end)
        rules[ruleName] = compilePredicate(rule.children[1], input)
    }
    return compileRules(rules)
}

exports.compileGrammarMatch = compileGrammarMatch


function compilePredicate(predicate, input) {
    switch (predicate.name) {
        case "and":
            return compileAnd(predicate, input)
        case "or":
            return compileOr(predicate, input)
        case "str":
            const text = input.substring(predicate.start + 1, predicate.end - 1)
            if (text.length === 1)
                return isChar(text)
            return isString(text)
        case "escape":
            const char = input.substring(predicate.start + 1, predicate.end)
            if (char.length !== 1)
                throw "expected char to be of length 1"
            return isEscape(input.substring(predicate.start + 1, predicate.end))
        case "ident":
            return isRule(input.substring(predicate.start, predicate.end))
        case "nset":
            // TODO: ranges are not yet handled here...
            const inNSetChars = input.substring(predicate.start + 2, predicate.end - 1).split('').map(isChar)
            return isNotInSetList(inNSetChars)
        case "set":
            // TODO: ranges are not yet handled here...
            const inSetChars = input.substring(predicate.start + 2, predicate.end - 1).split('').map(isChar)
            return isInSetList(inSetChars)
        case "par":
            if (predicate.children.length === 1)
                return compilePredicate(predicate.children[0], input)
            if (predicate.children.length > 2)
                throw "expected par to have 2 children max"
            return compileCardinality(compilePredicate(predicate.children[0], input), predicate.children[1], input)
        default:
            throw "unknwon predicate " + JSON.stringify(predicate.name)
    }
}

function compileCardinality(predicate, caridnalityMatch, input) {
    const char = input.substring(caridnalityMatch.start, caridnalityMatch.end)
    if (char.length !== 1)
        throw "expected cardinality char to be of length 1"
    switch (char) {
        case "?":
            return zeroOrOne(predicate)
        case "*":
            return zeroOrMore(predicate)
        case "+":
            return oneOrMore(predicate)
        default:
            throw "unknown cardinality " + JSON.stringify(caridnalityMatch.text)
    }
}

function compileAnd(andMatch, input) {
    let children = []
    for (let child of andMatch.children) {
        if (child.name === 'card') {
            children[children.length - 1] = compileCardinality(children[children.length - 1], child, input)
        } else {
            children.push(compilePredicate(child, input))
        }
    }
    return andList(children)
}

function compileOr(orMatch, input) {
    let children = []
    for (let child of orMatch.children) {
        if (child.name === 'card') {
            children[children.length - 1] = compileCardinality(children[children.length - 1], child, input)
        } else {
            children.push(compilePredicate(child, input))
        }
    }
    return orList(children)
}