const { compileGrammarMatch } = require('./compile-grammar')
const fs = require('fs')

function parseGrammar(filePath, grammar) {
    let grammarParser = null
    try {
        // try to import the generated parser
        grammarParser = require('./generated/grammar-parser')
    } catch (e) {
        if (e.code !== 'MODULE_NOT_FOUND')
            throw e
        // We did not have already generated the parser
        console.log("Generate grammar parser")
        const { writeGrammarDefinition } = require('./grammar-definition')
        // We create the file containing the parser for a grammar definition
        writeGrammarDefinition()
        // this time the import should succede
        grammarParser = require('./generated/grammar-parser')
    }
    // Now we use the imported parser to parse the grammar definition in input (a string)
    const match = grammarParser.rules(grammar)
    // This prints some infos about the result
    checkMatch(match, grammar)
    if (match.end < grammar.length)
        return // no match, grammar wasn't a valid grammar definition
    // We print the xml tree representing the parse tree (you can find an example in xml/json-grammar.xml)
    console.log(matchToXml(match, grammar), "\n\n")
    // Now we compile the matched grammar to javascript
    let jsCode = compileGrammarMatch(match, grammar)
    // We save the code to a file
    fs.writeFileSync(filePath, jsCode, "utf8")
    // We import and return the module. Every function in the module corresponds to a rule of the grammar in input
    return require(filePath)
}

// Formats the match tree to xml
function matchToXml(match, input, offset = 0) {
    if (!match) {
        return ""
    }
    const padding = 4
    if (!match.children.length) {
        return " ".repeat(offset * padding) + "<" + match.name + ">" + input.substring(match.start, match.end) + "</" + match.name + ">\n"
    }
    let result = " ".repeat(offset * padding) + "<" + match.name + ">\n"
    if (match.children.length) {
        let frag = input.substring(match.start, match.children[0].start).trim()
        if (frag)
            result += " ".repeat((offset + 1) * padding) + frag + "\n"
        for (let i = 0; i < match.children.length; ++i) {
            let child = match.children[i]
            result += matchToXml(child, input, offset + 1)
            if (i < match.children.length - 1) {
                frag = input.substring(child.end, match.children[i + 1].start).trim()
                if (frag)
                    result += " ".repeat((offset + 1) * padding) + frag + "\n"
            }
        }
        frag = input.substring(match.children[match.children.length - 1].end, match.end).trim()
        if (frag)
            result += " ".repeat((offset + 1) * padding) + frag + "\n"
    } else {
        result += " ".repeat((offset + 1) * padding) + input.substring(match.start, match.end) + "\n"
    }
    return result + " ".repeat(offset * padding) + "</" + match.name + ">\n"
}

// Prints infos about the match: do we have a complete, partial or no match at all?
function checkMatch(match, input) {
    if (match) {
        if (match.end < input.length) {
            console.log("partial match", JSON.stringify(input.substring(match.start, match.end)), "(" + match.end + "/" + input.length + ")")
        } else {
            console.log("full match", JSON.stringify(input.substring(match.start, match.end)))
        }
    } else {
        console.log("no match for", input)
    }
}

// Generate the code to parse the JSON grammar, save it to ./generated/json-grammar.js, import it and return it to the variable jsonGrammar
const jsonGrammar = parseGrammar(
    "./generated/json-grammar.js",
    `
    JSON = \\s* (NULL | BOOL | NUMBER | STRING | LIST | OBJECT) \\s*;
    NULL = "null";
    BOOL = "true" | "false";
    NUMBER = ("0" | \\d+) ("." \\d+)?;
    STRING = \\" [^"]* \\";
    LIST = "[" (JSON ("," JSON)* )? "]";
    KEY = \\s* STRING \\s*;
    OBJECT = "{" (KEY ":" JSON ("," KEY ":" JSON )* )? "}";
    `
)
// Next, we will proceed to apply our JSON parser to the given input. 
const input = '{"chiave": 123, "lista": [null, ["annidata", 2.0], true]}'
const match = jsonGrammar.JSON(input)

checkMatch(match, input)

if (!match || match.end < input.length)
    return

// The corresponding xml tree can be found at xml/json.match.xml
console.log(matchToXml(match, input))
