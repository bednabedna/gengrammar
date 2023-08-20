exports.JSON = JSON

exports.NULL = NULL

exports.BOOL = BOOL

exports.NUMBER = NUMBER

exports.STRING = STRING

exports.LIST = LIST

exports.OBJECT = OBJECT

function JSON(text, parent, pos = 0) {
    var start = pos
    var accept = true
    var children = parent ? [] : null
    accept = (text.charCodeAt(pos) === 32 /*" "*/ || text.charCodeAt(pos) === 9 /*"\t"*/ || text.charCodeAt(pos) === 10 /*"\n"*/)
    while (accept) {
        pos += 1
        accept = (text.charCodeAt(pos) === 32 /*" "*/ || text.charCodeAt(pos) === 9 /*"\t"*/ || text.charCodeAt(pos) === 10 /*"\n"*/)
    }
    accept = true
    var prev = pos
    var newPos = NULL(text, children, pos) /*1*/
    accept = newPos !== -1
    if (accept) {
        pos = newPos

    }

    if (!accept) {
        pos = prev
        var prev = pos
        var newPos = BOOL(text, children, pos) /*1*/
        accept = newPos !== -1
        if (accept) {
            pos = newPos

        }

        if (!accept) {
            pos = prev
            var prev = pos
            var newPos = NUMBER(text, children, pos) /*1*/
            accept = newPos !== -1
            if (accept) {
                pos = newPos

            }

            if (!accept) {
                pos = prev
                var prev = pos
                var newPos = STRING(text, children, pos) /*1*/
                accept = newPos !== -1
                if (accept) {
                    pos = newPos

                }

                if (!accept) {
                    pos = prev
                    var prev = pos
                    var newPos = LIST(text, children, pos) /*1*/
                    accept = newPos !== -1
                    if (accept) {
                        pos = newPos

                    }

                    if (!accept) {
                        pos = prev
                        var newPos = OBJECT(text, children, pos) /*1*/
                        accept = newPos !== -1
                        if (accept) {
                            pos = newPos

                        }

                    }

                }

            }

        }

    }
    accept = (text.charCodeAt(pos) === 32 /*" "*/ || text.charCodeAt(pos) === 9 /*"\t"*/ || text.charCodeAt(pos) === 10 /*"\n"*/)
    while (accept) {
        pos += 1
        accept = (text.charCodeAt(pos) === 32 /*" "*/ || text.charCodeAt(pos) === 9 /*"\t"*/ || text.charCodeAt(pos) === 10 /*"\n"*/)
    }
    accept = true



    if (accept && pos !== start) {
        var end = pos
        if (parent)
            parent.push({
                name: "JSON",
                text: text.substring(start, end),
                children
            })
        return end
    }
    return -1
}

function NULL(text, parent, pos = 0) {
    var start = pos
    var accept = true
    var children = parent ? [] : null
    accept = text.startsWith("null", pos)
    if (accept) {
        pos += 4

    }

    if (accept && pos !== start) {
        var end = pos
        if (parent)
            parent.push({
                name: "NULL",
                text: text.substring(start, end),
                children
            })
        return end
    }
    return -1
}

function BOOL(text, parent, pos = 0) {
    var start = pos
    var accept = true
    var children = parent ? [] : null
    accept = text.startsWith("true", pos)
    if (accept) {
        pos += 4

    }
    accept = text.startsWith("false", pos)
    if (accept) {
        pos += 5

    }

    if (accept && pos !== start) {
        var end = pos
        if (parent)
            parent.push({
                name: "BOOL",
                text: text.substring(start, end),
                children
            })
        return end
    }
    return -1
}

function NUMBER(text, parent, pos = 0) {
    var start = pos
    var accept = true
    var children = parent ? [] : null
    var prev = pos
    accept = text.charCodeAt(pos) === 48 /*"0"*/
    if (accept) {
        pos += 1

    }

    if (!accept) {
        pos = prev
        accept = text.charCodeAt(pos) >= 48 && text.charCodeAt(pos) <= 57
        if (accept) {
            pos += 1
            accept = text.charCodeAt(pos) >= 48 && text.charCodeAt(pos) <= 57
            while (accept) {
                pos += 1
                accept = text.charCodeAt(pos) >= 48 && text.charCodeAt(pos) <= 57
            }
            accept = true


        }

    }
    var prev = pos
    accept = text.charCodeAt(pos) === 46 /*"."*/
    if (accept) {
        pos += 1
        accept = text.charCodeAt(pos) >= 48 && text.charCodeAt(pos) <= 57
        if (accept) {
            pos += 1
            accept = text.charCodeAt(pos) >= 48 && text.charCodeAt(pos) <= 57
            while (accept) {
                pos += 1
                accept = text.charCodeAt(pos) >= 48 && text.charCodeAt(pos) <= 57
            }
            accept = true


        }

    }

    if (!accept) {
        accept = true
        pos = prev
    }


    if (accept && pos !== start) {
        var end = pos
        if (parent)
            parent.push({
                name: "NUMBER",
                text: text.substring(start, end),
                children
            })
        return end
    }
    return -1
}

function STRING(text, parent, pos = 0) {
    var start = pos
    var accept = true
    var children = parent ? [] : null
    accept = text.charCodeAt(pos) === 34 /*"\""*/
    if (accept) {
        pos += 1
        accept = pos < text.length && !(text.charCodeAt(pos) === 34 /*"\""*/)
        while (accept) {
            pos += 1
            accept = pos < text.length && !(text.charCodeAt(pos) === 34 /*"\""*/)
        }
        accept = true
        accept = text.charCodeAt(pos) === 34 /*"\""*/
        if (accept) {
            pos += 1

        }


    }

    if (accept && pos !== start) {
        var end = pos
        if (parent)
            parent.push({
                name: "STRING",
                text: text.substring(start, end),
                children
            })
        return end
    }
    return -1
}

function LIST(text, parent, pos = 0) {
    var start = pos
    var accept = true
    var children = parent ? [] : null
    accept = text.charCodeAt(pos) === 91 /*"["*/
    if (accept) {
        pos += 1
        accept = (text.charCodeAt(pos) === 32 /*" "*/ || text.charCodeAt(pos) === 9 /*"\t"*/ || text.charCodeAt(pos) === 10 /*"\n"*/)
        while (accept) {
            pos += 1
            accept = (text.charCodeAt(pos) === 32 /*" "*/ || text.charCodeAt(pos) === 9 /*"\t"*/ || text.charCodeAt(pos) === 10 /*"\n"*/)
        }
        accept = true
        var prev = pos
        var newPos = JSON(text, children, pos) /*1*/
        accept = newPos !== -1
        if (accept) {
            pos = newPos
            var prev = pos
            accept = text.charCodeAt(pos) === 44 /*","*/
            if (accept) {
                pos += 1
                var newPos = JSON(text, children, pos) /*1*/
                accept = newPos !== -1
                if (accept) {
                    pos = newPos

                }

            }

            while (accept) {
                prev = pos
                accept = text.charCodeAt(pos) === 44 /*","*/
                if (accept) {
                    pos += 1
                    var newPos = JSON(text, children, pos) /*1*/
                    accept = newPos !== -1
                    if (accept) {
                        pos = newPos

                    }

                }

                if (pos === prev) break
            }
            pos = prev
            accept = true


        }

        if (!accept) {
            accept = true
            pos = prev
        }
        accept = (text.charCodeAt(pos) === 32 /*" "*/ || text.charCodeAt(pos) === 9 /*"\t"*/ || text.charCodeAt(pos) === 10 /*"\n"*/)
        while (accept) {
            pos += 1
            accept = (text.charCodeAt(pos) === 32 /*" "*/ || text.charCodeAt(pos) === 9 /*"\t"*/ || text.charCodeAt(pos) === 10 /*"\n"*/)
        }
        accept = true
        accept = text.charCodeAt(pos) === 93 /*"]"*/
        if (accept) {
            pos += 1

        }




    }

    if (accept && pos !== start) {
        var end = pos
        if (parent)
            parent.push({
                name: "LIST",
                text: text.substring(start, end),
                children
            })
        return end
    }
    return -1
}

function OBJECT(text, parent, pos = 0) {
    var start = pos
    var accept = true
    var children = parent ? [] : null
    accept = text.charCodeAt(pos) === 123 /*"{"*/
    if (accept) {
        pos += 1
        accept = (text.charCodeAt(pos) === 32 /*" "*/ || text.charCodeAt(pos) === 9 /*"\t"*/ || text.charCodeAt(pos) === 10 /*"\n"*/)
        while (accept) {
            pos += 1
            accept = (text.charCodeAt(pos) === 32 /*" "*/ || text.charCodeAt(pos) === 9 /*"\t"*/ || text.charCodeAt(pos) === 10 /*"\n"*/)
        }
        accept = true
        var prev = pos
        var newPos = STRING(text, children, pos) /*1*/
        accept = newPos !== -1
        if (accept) {
            pos = newPos
            accept = (text.charCodeAt(pos) === 32 /*" "*/ || text.charCodeAt(pos) === 9 /*"\t"*/ || text.charCodeAt(pos) === 10 /*"\n"*/)
            while (accept) {
                pos += 1
                accept = (text.charCodeAt(pos) === 32 /*" "*/ || text.charCodeAt(pos) === 9 /*"\t"*/ || text.charCodeAt(pos) === 10 /*"\n"*/)
            }
            accept = true
            accept = text.charCodeAt(pos) === 58 /*":"*/
            if (accept) {
                pos += 1
                accept = (text.charCodeAt(pos) === 32 /*" "*/ || text.charCodeAt(pos) === 9 /*"\t"*/ || text.charCodeAt(pos) === 10 /*"\n"*/)
                while (accept) {
                    pos += 1
                    accept = (text.charCodeAt(pos) === 32 /*" "*/ || text.charCodeAt(pos) === 9 /*"\t"*/ || text.charCodeAt(pos) === 10 /*"\n"*/)
                }
                accept = true
                var newPos = JSON(text, children, pos) /*1*/
                accept = newPos !== -1
                if (accept) {
                    pos = newPos
                    var prev = pos
                    accept = text.charCodeAt(pos) === 44 /*","*/
                    if (accept) {
                        pos += 1
                        accept = (text.charCodeAt(pos) === 32 /*" "*/ || text.charCodeAt(pos) === 9 /*"\t"*/ || text.charCodeAt(pos) === 10 /*"\n"*/)
                        while (accept) {
                            pos += 1
                            accept = (text.charCodeAt(pos) === 32 /*" "*/ || text.charCodeAt(pos) === 9 /*"\t"*/ || text.charCodeAt(pos) === 10 /*"\n"*/)
                        }
                        accept = true
                        var newPos = STRING(text, children, pos) /*1*/
                        accept = newPos !== -1
                        if (accept) {
                            pos = newPos
                            accept = (text.charCodeAt(pos) === 32 /*" "*/ || text.charCodeAt(pos) === 9 /*"\t"*/ || text.charCodeAt(pos) === 10 /*"\n"*/)
                            while (accept) {
                                pos += 1
                                accept = (text.charCodeAt(pos) === 32 /*" "*/ || text.charCodeAt(pos) === 9 /*"\t"*/ || text.charCodeAt(pos) === 10 /*"\n"*/)
                            }
                            accept = true
                            accept = text.charCodeAt(pos) === 58 /*":"*/
                            if (accept) {
                                pos += 1
                                accept = (text.charCodeAt(pos) === 32 /*" "*/ || text.charCodeAt(pos) === 9 /*"\t"*/ || text.charCodeAt(pos) === 10 /*"\n"*/)
                                while (accept) {
                                    pos += 1
                                    accept = (text.charCodeAt(pos) === 32 /*" "*/ || text.charCodeAt(pos) === 9 /*"\t"*/ || text.charCodeAt(pos) === 10 /*"\n"*/)
                                }
                                accept = true
                                var newPos = JSON(text, children, pos) /*1*/
                                accept = newPos !== -1
                                if (accept) {
                                    pos = newPos

                                }


                            }


                        }


                    }

                    while (accept) {
                        prev = pos
                        accept = text.charCodeAt(pos) === 44 /*","*/
                        if (accept) {
                            pos += 1
                            accept = (text.charCodeAt(pos) === 32 /*" "*/ || text.charCodeAt(pos) === 9 /*"\t"*/ || text.charCodeAt(pos) === 10 /*"\n"*/)
                            while (accept) {
                                pos += 1
                                accept = (text.charCodeAt(pos) === 32 /*" "*/ || text.charCodeAt(pos) === 9 /*"\t"*/ || text.charCodeAt(pos) === 10 /*"\n"*/)
                            }
                            accept = true
                            var newPos = STRING(text, children, pos) /*1*/
                            accept = newPos !== -1
                            if (accept) {
                                pos = newPos
                                accept = (text.charCodeAt(pos) === 32 /*" "*/ || text.charCodeAt(pos) === 9 /*"\t"*/ || text.charCodeAt(pos) === 10 /*"\n"*/)
                                while (accept) {
                                    pos += 1
                                    accept = (text.charCodeAt(pos) === 32 /*" "*/ || text.charCodeAt(pos) === 9 /*"\t"*/ || text.charCodeAt(pos) === 10 /*"\n"*/)
                                }
                                accept = true
                                accept = text.charCodeAt(pos) === 58 /*":"*/
                                if (accept) {
                                    pos += 1
                                    accept = (text.charCodeAt(pos) === 32 /*" "*/ || text.charCodeAt(pos) === 9 /*"\t"*/ || text.charCodeAt(pos) === 10 /*"\n"*/)
                                    while (accept) {
                                        pos += 1
                                        accept = (text.charCodeAt(pos) === 32 /*" "*/ || text.charCodeAt(pos) === 9 /*"\t"*/ || text.charCodeAt(pos) === 10 /*"\n"*/)
                                    }
                                    accept = true
                                    var newPos = JSON(text, children, pos) /*1*/
                                    accept = newPos !== -1
                                    if (accept) {
                                        pos = newPos

                                    }


                                }


                            }


                        }

                        if (pos === prev) break
                    }
                    pos = prev
                    accept = true


                }


            }


        }

        if (!accept) {
            accept = true
            pos = prev
        }
        accept = (text.charCodeAt(pos) === 32 /*" "*/ || text.charCodeAt(pos) === 9 /*"\t"*/ || text.charCodeAt(pos) === 10 /*"\n"*/)
        while (accept) {
            pos += 1
            accept = (text.charCodeAt(pos) === 32 /*" "*/ || text.charCodeAt(pos) === 9 /*"\t"*/ || text.charCodeAt(pos) === 10 /*"\n"*/)
        }
        accept = true
        accept = text.charCodeAt(pos) === 125 /*"}"*/
        if (accept) {
            pos += 1

        }




    }

    if (accept && pos !== start) {
        var end = pos
        if (parent)
            parent.push({
                name: "OBJECT",
                text: text.substring(start, end),
                children
            })
        return end
    }
    return -1
}
