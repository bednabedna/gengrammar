const {
    and, compileRules, isAnyChar, isChar,
    isInRange, isInSet, isNotInSet, isRule, isString,
    oneOrMore, or, zeroOrMore, zeroOrOne, isEscape
} = require('./grammar')

const fs = require('fs')


function writeGrammarDefinition() {
    const spaces = zeroOrMore(isEscape('s'))
    const rules = {
        // "\\." 
        "escape": and(isChar("\\"), isAnyChar()),
        // "."
        "anychar": isChar("."),
        // [a-zA-Z_$][a-zA-Z0-9_$]*
        "ident": and(
            isInSet(isInRange("a", "z"), isInRange("A", "Z"), isChar("_"), isChar("$")),
            zeroOrMore(
                isInSet(isInRange("a", "z"), isInRange("A", "Z"), isInRange("0", "9"), isChar("_"), isChar("$"))
            )
        ),
        // '"(\\"|[^"])*"'
        "str": and(
            isChar('"'),
            zeroOrMore(or(
                and(isChar("\\"), isChar('"')),
                isNotInSet(isChar('"'))
            )),
            isChar('"')
        ),
        // "[" ( escape | [^\]] )+ ]     TODO: ranges
        "set": and(
            isChar('['),
            zeroOrOne(isChar('^')),
            oneOrMore(or(
                isRule("escape"),
                isRule("range"),
                isRule("char")
            )),
            isChar(']')
        ),
        // . "-" .
        "range": and(isAnyChar(), isChar("-"), isAnyChar()),
        // [^"]
        "char": isNotInSet(isChar(']')),
        // "[?*+]"
        "card": isInSet(isChar("?"), isChar("*"), isChar("+")),
        // ((par|escape|str|ident)\s*card?\s*)+
        "and": oneOrMore(and(
            or(
                isRule("par"),
                isRule("anychar"),
                isRule("escape"),
                isRule("str"),
                isRule("set"),
                isRule("ident")
            ),
            spaces,
            zeroOrOne(isRule("card")),
            spaces
        )),
        // (par|and)(\s*"|"\s*(par|and))+
        "or": and(
            or(
                isRule("par"),
                isRule("and")
            ),
            oneOrMore(and(
                spaces,
                isChar("|"),
                spaces,
                or(
                    isRule("par"),
                    isRule("and")
                )
            ))
        ),
        // "(" \s* (or|and) \s* ")" \s* card?
        "par": and(
            isChar("("),
            spaces,
            or(
                isRule("or"),
                isRule("and")
            ),
            spaces,
            isChar(")"),
            spaces,
            zeroOrOne(isRule("card"))
        ),
        // ident \s* "=" \s* ( par (\s* card)? | or | and )
        "rule": and(
            isRule("ident"),
            spaces,
            isChar("="),
            spaces,
            or(
                isRule("or"),
                isRule("and"),
                and(isRule("par"), zeroOrOne(and(spaces, isRule("card"))))
            )
        ),
        // (\s* rule \s* ";")+ \s*
        "rules": and(oneOrMore(and(spaces, isRule("rule"), spaces, isChar(";"))), spaces)
    }
    fs.writeFileSync("generated/grammar-parser.js", compileRules(rules), "utf8")
}

exports.writeGrammarDefinition = writeGrammarDefinition