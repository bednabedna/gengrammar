# gengrammar

This JavaScript code generator creates parsers according to a [context-free grammar](https://en.wikipedia.org/wiki/Context-free_grammar) description in input. Context-free grammars are more powerful than regular expressions as they can recognize [context-free languages](https://en.wikipedia.org/wiki/Context-free_language). This code generator enhances context-free grammars with regex-like syntax, introducing escape sequences and cardinalities (?, *, +) to increase expressive capabilities.

The grammar can be describe by composing function calls or by a string that defines it. The files generated after executing the `index.js`, can be found in the `/generated` folder. This allows you to review the generated code without needing to run it. Notably, this project remains free from any external dependencies.

## Explanation of the example usage in index.js
This code can be found at the end of the `index.js` file.

The following function, `parseGrammar`, takes a string `grammar` describing a grammar and generates javascript functions corresponding to the rules of the grammar and writes them to the file `filePath`.
The function is able to parse the grammar description `grammar` by generating in `/generated/grammar-parser.js` the parser code that can parse the syntax that we are using. It is able to generate such parser thanks to `writeGrammarDefinition()` (from `grammar-definition.js`), which contains the instructions to generate such code. The insteresting part is that the generated code can be used to parse and generate another grammar parser. Therefore it is able to recursevly read its own definition to generate another parser that can recursevly do the same without the use of `writeGrammarDefinition()`.

```js
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
        // this time the import should succeed
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
```

Here we can se how we can use the code generated by `parseGrammar` to parse the definition of the JSON language. Regarding the grammar syntax: values contained in quotes are literal strings to match, while unquoted values are names of rules. As you can see you can also use most of the regex syntax. Spaces between tokens are ignored.

```js
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
```

Now that we have generated in `/generated/json-grammar.js` the JSON language parser, we can use it to parse the JSON formatted string `'{"chiave": 123, "lista": [null, ["annidata", 2.0], true]}'`.

```js
// Next, we will proceed to apply our JSON parser to the given input. 
const input = '{"chiave": 123, "lista": [null, ["annidata", 2.0], true]}'
const match = jsonGrammar.JSON(input)
// Print infos about the match
checkMatch(match, input)
if (!match || match.end < input.length)
    return
// The corresponding xml tree can be found at xml/json.match.xml
console.log(matchToXml(match, input))
```
The parsed result of `'{"chiave": 123, "lista": [null, ["annidata", 2.0], true]}'` within the `match` variable consists of a hierarchical arrangement of match objects. Each of these objects stands for a rule that has matched the input. In these objects, the "name" attribute designates the name of the corresponding rule that achieved the match, while the "start" attribute denotes the starting index of the matched substring, the "end" attribute indicates the endpoint, and the "children" attribute contains the rules that have been matched and are associated with the parent rule.

For instance, the rule "LIST" has its constituent items as children, the rule "OBJECT" has its keys and values as children, and the rule "NUMBER" is a submatch nested within the "JSON" rule. Given the structure of this grammar representation, the keys ("KEY") and values ("JSON") of the object alternate with each other within the children array.

The following represents the output of `matchToXml(match, input)` to the console (with the `checkMatch` output omitted):

```xml
<JSON>
    <OBJECT>
        {
        <KEY>
            <STRING>"chiave"</STRING>
        </KEY>
        :
        <JSON>
            <NUMBER>123</NUMBER>
        </JSON>
        ,
        <KEY>
            <STRING>"lista"</STRING>
        </KEY>
        :
        <JSON>
            <LIST>
                [
                <JSON>
                    <NULL>null</NULL>
                </JSON>
                ,
                <JSON>
                    <LIST>
                        [
                        <JSON>
                            <STRING>"annidata"</STRING>
                        </JSON>
                        ,
                        <JSON>
                            <NUMBER>2.0</NUMBER>
                        </JSON>
                        ]
                    </LIST>
                </JSON>
                ,
                <JSON>
                    <BOOL>true</BOOL>
                </JSON>
                ]
            </LIST>
        </JSON>
        }
    </OBJECT>
</JSON>
```

## Translation Process from Predicate Tree to JavaScript Code
The mechanism responsible for orchestrating the translation from a predicate tree into JavaScript code resides within the `grammar.js` file. To offer a concise overview, I'll provide a brief outline, given the extensive nature of the explanation. Each grammar rule is paired with a corresponding function, where every function incorporates two core variables: `a` (a boolean) that signifies whether the input is accepted, and `pos` that tracks the consumed input.

The system uses various predicates, which encapsulate a range of operations such as matching strings, matching individual characters, loops, logical "and" operations, and logical "or" operations. Whenever these predicates consume portions of the input, they switch the value of a to true and advance the `pos` variable accordingly. It's essential to note that each predicate ensures that, in the event of a failure, the `pos` variable is reset to its previous state. Here are some examples of simple predicates that consume input:

```js
// it does not mutate pos unless it accepts the input
if (a = input.startsWith("string123", pos)) {
    pos += 9 // <-- "string123".length
}
// function/rule call is a predicate, match123 is unqiue variable name
let match123 = rule123(input, pos, children)
if (a = (match123 !== null)) {
    pos += match123.end - match123.start
    children.push(match123)
}
// Char predicates are predicates that can advance only by one char (it allows them to be combined in sets and negative sets)
if (a = (input.charCodeAt(pos) === 33 || input.charCodeAt(pos) === 34)) {
    pos += 1
}
```
To emulate the concatenation of predicates `A B C`, the subsequent code is generated:
```js
A
if (a) {
    B
    if (a) {
        C
    }
}
if (a) {
    // accept
} else {
    // reject
}
```
To simulate an "or" operation among the predicates `A | B | C`, we generate the following code:
```js
A
if (!a) {
    B
    if (!a) {
        C
    }
}
if (a) {
    // accept
} else {
    // reject
}

```
To replicate a loop with a minimum of `min` iterations and a maximum of `max` iterations, the following code is employed:
```js
// uniquely named variable
let c123 = 0
// uniquely named variable
let prevPos123 = pos
// uniquely named variable
let prevChildLen123 = children.length
do {
    P // a predicate, it could be an "or" or a character matcher
} while (a && c123++ < max);
a = c123 >= min
if (!a) {
    // here the loop has failed
    pos = prevPos123
    children.length = prevChildLen123
}
```
Given the expections on predicates to reset the positions, we can expand any of the predicates in the example code and all the assumptions should hold. For additional instances of predicates, you can explore the generated code within the `/generated` directory. 

## Concluding Remarks on the Code
The presented code exemplifies a personal, compact coding project that I undertook to delve into an intriguing concept. It's worth noting that this endeavor is purely exploratory in nature. It lacks the optimization that comes with algorithmic refinement and hasn't undergone rigorous testing. It's my intention that this project isn't misconstrued as a representation of my professional coding standards. Ordinarily, I adhere to established code conventions and rigorously test my code for robustness.

Should you wish to explore my other GitHub projects, I welcome your curiosity. Nonetheless, I'd like to reiterate a caveat: while you're welcome to peruse my projects, including those shared here, it's important to consider that certain projects were developed several years ago. Furthermore, certain projects were made available primarily for interview purposes. The majority of my code is either private or not suitable for public presentation.

Engaging in this project was immensely enjoyable, and I believe it reflects my genuine enthusiasm for delving into diverse computer science concepts during my leisure time.

## Todos (not comprehensive)
Implement ranges in sets (e.g [a-z0-9]) and "." special character for the match compilation, introduce loop special cases and optimizazions, handle pos reset in some edge cases, add tests.