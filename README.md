# gengrammar

Generates js code that decides a grammar given a grammar description (a grammar is like a regex but more powerful, so we are generating "powerful" regexes).
The grammar description can be created through composing function calls or by parsing a string containing the grammar definition.  
 [This is a grammar](https://en.wikipedia.org/wiki/Definite_clause_grammar) but in this program DCG have been augmented to use regex syntax in the rules body.
 The folder `/generated` contains the files generated when `index.js` is executed. They are there so that you can see the generated code without the need to execute anything.
 This project does not use any dependency.

## Explanation of the example usage in index.js
This code can be found at the end of the `index.js` file.

The following function `parseRules` takes a file path and a string describing a grammar and generates at the file path javascript functions corresponding to the rules names.
The function is able to parse the grammar description `input` because it generates in `/generated/parser.js` the js code needed to parse the syntax of my grammar definition. It is able to generate such grammar thanks to `rulesParser()` that contains the instruction to generate such code. However that generated code is then use to parse and generate another grammar definition, therefore it is able to recursevly read its own definition to generate another parser that can recursevly do the same without the use of `rulesParser()`.

```js
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
```

Here we can se how we can use the code generated in the previous step to parse the definition of the JSON language. Values contained in quotes are literal strings to match, while unquoted values are names of rules. You can also use the regex syntax as you can see. Spaces between tokens are ignored.

```js
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
```

Now that we have generated in `/generated/test.js` the JSON language grammar parser, we can use it to parse the JSON formatted string `{"chiave": 123, "lista": [null, ["annidata", 2.0]]}`.

```js
const generated = require("./generated/test")
console.log("----------------------")
const input = '{"chiave": 123, "lista": [null, ["annidata", 2.0]]}'
const out = []
const pos = generated.JSON(input, out) // generated.JSON is the generated function corresponding to the "JSON" rule
assert(pos !== -1, "input not accepted")
assert(pos === input.length, "input not fully consumed (" + pos + "/" + input.length + ")")
console.log(JSON.stringify(out, null, 3))
```
The parsed result of `'{"chiave": 123, "lista": [null, ["annidata", 2.0]]}'` in `out` contains a tree of objects. Each object rapresents a rule that matched the input, where "name" is the name of the matching rule, "text" is the input substring that is matched and children are the rules that matched that are part of the parent rule (for example "LIST" has the items as children, "OBJECT" has the keys and values, and "NUMBER" is a submatch of the rule "JSON"). In this grammar rappresentation we didin't include an entry rule so the keys ("STRING") and values ("JSON") of the object simply alternate each others in the children array.
The result of `JSON.stringify(out, null, 3)` is the following:

```json
[
   {
      "name": "JSON",
      "text": "{\"chiave\": 123, \"lista\": [null, [\"annidata\", 2.0]]}",
      "children": [
         {
            "name": "OBJECT",
            "text": "{\"chiave\": 123, \"lista\": [null, [\"annidata\", 2.0]]}",
            "children": [
               {
                  "name": "STRING",
                  "text": "\"chiave\"",
                  "children": []
               },
               {
                  "name": "JSON",
                  "text": "123",
                  "children": [
                     {
                        "name": "NUMBER",
                        "text": "123",
                        "children": []
                     }
                  ]
               },
               {
                  "name": "STRING",
                  "text": "\"lista\"",
                  "children": []
               },
               {
                  "name": "JSON",
                  "text": "[null, [\"annidata\", 2.0]]",
                  "children": [
                     {
                        "name": "LIST",
                        "text": "[null, [\"annidata\", 2.0]]",
                        "children": [
                           {
                              "name": "JSON",
                              "text": "null",
                              "children": [
                                 {
                                    "name": "NULL",
                                    "text": "null",
                                    "children": []
                                 }
                              ]
                           },
                           {
                              "name": "JSON",
                              "text": " [\"annidata\", 2.0]",
                              "children": [
                                 {
                                    "name": "LIST",
                                    "text": "[\"annidata\", 2.0]",
                                    "children": [
                                       {
                                          "name": "JSON",
                                          "text": "\"annidata\"",
                                          "children": [
                                             {
                                                "name": "STRING",
                                                "text": "\"annidata\"",
                                                "children": []
                                             }
                                          ]
                                       },
                                       {
                                          "name": "JSON",
                                          "text": " 2.0",
                                          "children": [
                                             {
                                                "name": "NUMBER",
                                                "text": "2.0",
                                                "children": []
                                             }
                                          ]
                                       }
                                    ]
                                 }
                              ]
                           }
                        ]
                     }
                  ]
               }
            ]
         }
      ]
   }
]
```

## Final notes about the code
This is an example of a personal small code project that I did to explore an idea that I think is cool. However it is not nicely written, nor performant, nor tested. I hope that I won't give the impression that this is how I code professionally, I normally follow code conventions and test my code. Feel free to checkout my other projects on GitHub, however the same warning applies, in particular these projects where made some years ago and where uploaded here just for an interview. I am not proud of the code quality but I think that it shows that I actually enjoy exploring different ideas related to computer science in my free time. 
