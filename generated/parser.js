exports.escape = escape

exports.ident = ident

exports.str = str

exports.nset = nset

exports.set = set

exports.card = card

exports.and = and

exports.or = or

exports.par = par

exports.rule = rule

exports.rules = rules

function escape(text, parent, pos = 0) {
    var start = pos
    var accept = true
    var children = parent ? [] : null
    accept = text.charCodeAt(pos) === 92 /*"\\"*/
    if (accept) {
        pos += 1
        accept = pos < text.length
        if (accept) {
            pos += 1

        }

    }

    if (accept && pos !== start) {
        var end = pos
        if (parent)
            parent.push({
                name: "escape",
                text: text.substring(start, end),
                children
            })
        return end
    }
    return -1
}

function ident(text, parent, pos = 0) {
    var start = pos
    var accept = true
    var children = parent ? [] : null
    accept = (text.charCodeAt(pos) >= 97 && text.charCodeAt(pos) <= 122 || text.charCodeAt(pos) >= 65 && text.charCodeAt(pos) <= 90 || text.charCodeAt(pos) === 95 /*"_"*/ || text.charCodeAt(pos) === 36 /*"$"*/)
    if (accept) {
        pos += 1
        accept = (text.charCodeAt(pos) >= 97 && text.charCodeAt(pos) <= 122 || text.charCodeAt(pos) >= 65 && text.charCodeAt(pos) <= 90 || text.charCodeAt(pos) >= 48 && text.charCodeAt(pos) <= 57 || text.charCodeAt(pos) === 95 /*"_"*/ || text.charCodeAt(pos) === 36 /*"$"*/)
        while (accept) {
            pos += 1
            accept = (text.charCodeAt(pos) >= 97 && text.charCodeAt(pos) <= 122 || text.charCodeAt(pos) >= 65 && text.charCodeAt(pos) <= 90 || text.charCodeAt(pos) >= 48 && text.charCodeAt(pos) <= 57 || text.charCodeAt(pos) === 95 /*"_"*/ || text.charCodeAt(pos) === 36 /*"$"*/)
        }
        accept = true


    }

    if (accept && pos !== start) {
        var end = pos
        if (parent)
            parent.push({
                name: "ident",
                text: text.substring(start, end),
                children
            })
        return end
    }
    return -1
}

function str(text, parent, pos = 0) {
    var start = pos
    var accept = true
    var children = parent ? [] : null
    accept = text.charCodeAt(pos) === 34 /*"\""*/
    if (accept) {
        pos += 1
        var prev = pos
        var prev = pos
        accept = text.charCodeAt(pos) === 92 /*"\\"*/
        if (accept) {
            pos += 1
            accept = text.charCodeAt(pos) === 34 /*"\""*/
            if (accept) {
                pos += 1

            }

        }

        if (!accept) {
            pos = prev
            accept = pos < text.length && !(text.charCodeAt(pos) === 34 /*"\""*/)
            if (accept) {
                pos += 1

            }

        }

        while (accept) {
            prev = pos
            var prev = pos
            accept = text.charCodeAt(pos) === 92 /*"\\"*/
            if (accept) {
                pos += 1
                accept = text.charCodeAt(pos) === 34 /*"\""*/
                if (accept) {
                    pos += 1

                }

            }

            if (!accept) {
                pos = prev
                accept = pos < text.length && !(text.charCodeAt(pos) === 34 /*"\""*/)
                if (accept) {
                    pos += 1

                }

            }

            if (pos === prev) break
        }
        pos = prev
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
                name: "str",
                text: text.substring(start, end),
                children
            })
        return end
    }
    return -1
}

function nset(text, parent, pos = 0) {
    var start = pos
    var accept = true
    var children = parent ? [] : null
    accept = text.startsWith("[^", pos)
    if (accept) {
        pos += 2
        var prev = pos
        var newPos = escape(text, children, pos) /*1*/
        accept = newPos !== -1
        if (accept) {
            pos = newPos

        }

        if (!accept) {
            pos = prev
            accept = pos < text.length && !(text.charCodeAt(pos) === 93 /*"]"*/)
            if (accept) {
                pos += 1

            }

        }

        if (accept) {
            var prev = pos
            var prev = pos
            var newPos = escape(text, children, pos) /*1*/
            accept = newPos !== -1
            if (accept) {
                pos = newPos

            }

            if (!accept) {
                pos = prev
                accept = pos < text.length && !(text.charCodeAt(pos) === 93 /*"]"*/)
                if (accept) {
                    pos += 1

                }

            }

            while (accept) {
                prev = pos
                var prev = pos
                var newPos = escape(text, children, pos) /*1*/
                accept = newPos !== -1
                if (accept) {
                    pos = newPos

                }

                if (!accept) {
                    pos = prev
                    accept = pos < text.length && !(text.charCodeAt(pos) === 93 /*"]"*/)
                    if (accept) {
                        pos += 1

                    }

                }

                if (pos === prev) break
            }
            pos = prev
            accept = true
            accept = text.charCodeAt(pos) === 93 /*"]"*/
            if (accept) {
                pos += 1

            }


        }

    }

    if (accept && pos !== start) {
        var end = pos
        if (parent)
            parent.push({
                name: "nset",
                text: text.substring(start, end),
                children
            })
        return end
    }
    return -1
}

function set(text, parent, pos = 0) {
    var start = pos
    var accept = true
    var children = parent ? [] : null
    accept = text.charCodeAt(pos) === 91 /*"["*/
    if (accept) {
        pos += 1
        var prev = pos
        var newPos = escape(text, children, pos) /*1*/
        accept = newPos !== -1
        if (accept) {
            pos = newPos

        }

        if (!accept) {
            pos = prev
            accept = pos < text.length && !(text.charCodeAt(pos) === 93 /*"]"*/)
            if (accept) {
                pos += 1

            }

        }

        if (accept) {
            var prev = pos
            var prev = pos
            var newPos = escape(text, children, pos) /*1*/
            accept = newPos !== -1
            if (accept) {
                pos = newPos

            }

            if (!accept) {
                pos = prev
                accept = pos < text.length && !(text.charCodeAt(pos) === 93 /*"]"*/)
                if (accept) {
                    pos += 1

                }

            }

            while (accept) {
                prev = pos
                var prev = pos
                var newPos = escape(text, children, pos) /*1*/
                accept = newPos !== -1
                if (accept) {
                    pos = newPos

                }

                if (!accept) {
                    pos = prev
                    accept = pos < text.length && !(text.charCodeAt(pos) === 93 /*"]"*/)
                    if (accept) {
                        pos += 1

                    }

                }

                if (pos === prev) break
            }
            pos = prev
            accept = true
            accept = text.charCodeAt(pos) === 93 /*"]"*/
            if (accept) {
                pos += 1

            }


        }

    }

    if (accept && pos !== start) {
        var end = pos
        if (parent)
            parent.push({
                name: "set",
                text: text.substring(start, end),
                children
            })
        return end
    }
    return -1
}

function card(text, parent, pos = 0) {
    var start = pos
    var accept = true
    var children = parent ? [] : null
    accept = (text.charCodeAt(pos) === 63 /*"?"*/ || text.charCodeAt(pos) === 42 /*"*"*/ || text.charCodeAt(pos) === 43 /*"+"*/)
    if (accept) {
        pos += 1

    }

    if (accept && pos !== start) {
        var end = pos
        if (parent)
            parent.push({
                name: "card",
                text: text.substring(start, end),
                children
            })
        return end
    }
    return -1
}

function and(text, parent, pos = 0) {
    var start = pos
    var accept = true
    var children = parent ? [] : null
    var prev = pos
    var newPos = par(text, children, pos) /*1*/
    accept = newPos !== -1
    if (accept) {
        pos = newPos

    }

    if (!accept) {
        pos = prev
        var prev = pos
        var newPos = escape(text, children, pos) /*1*/
        accept = newPos !== -1
        if (accept) {
            pos = newPos

        }

        if (!accept) {
            pos = prev
            var prev = pos
            var newPos = str(text, children, pos) /*1*/
            accept = newPos !== -1
            if (accept) {
                pos = newPos

            }

            if (!accept) {
                pos = prev
                var prev = pos
                var newPos = nset(text, children, pos) /*1*/
                accept = newPos !== -1
                if (accept) {
                    pos = newPos

                }

                if (!accept) {
                    pos = prev
                    var prev = pos
                    var newPos = set(text, children, pos) /*1*/
                    accept = newPos !== -1
                    if (accept) {
                        pos = newPos

                    }

                    if (!accept) {
                        pos = prev
                        var newPos = ident(text, children, pos) /*1*/
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
    var newPos = card(text, children, pos) /*2*/
    accept = newPos !== -1
    if (accept) {
        pos = newPos
    } else {
        accept = true
    }
    accept = (text.charCodeAt(pos) === 32 /*" "*/ || text.charCodeAt(pos) === 9 /*"\t"*/ || text.charCodeAt(pos) === 10 /*"\n"*/)
    while (accept) {
        pos += 1
        accept = (text.charCodeAt(pos) === 32 /*" "*/ || text.charCodeAt(pos) === 9 /*"\t"*/ || text.charCodeAt(pos) === 10 /*"\n"*/)
    }
    accept = true




    if (accept) {
        var prev = pos
        var prev = pos
        var newPos = par(text, children, pos) /*1*/
        accept = newPos !== -1
        if (accept) {
            pos = newPos

        }

        if (!accept) {
            pos = prev
            var prev = pos
            var newPos = escape(text, children, pos) /*1*/
            accept = newPos !== -1
            if (accept) {
                pos = newPos

            }

            if (!accept) {
                pos = prev
                var prev = pos
                var newPos = str(text, children, pos) /*1*/
                accept = newPos !== -1
                if (accept) {
                    pos = newPos

                }

                if (!accept) {
                    pos = prev
                    var prev = pos
                    var newPos = nset(text, children, pos) /*1*/
                    accept = newPos !== -1
                    if (accept) {
                        pos = newPos

                    }

                    if (!accept) {
                        pos = prev
                        var prev = pos
                        var newPos = set(text, children, pos) /*1*/
                        accept = newPos !== -1
                        if (accept) {
                            pos = newPos

                        }

                        if (!accept) {
                            pos = prev
                            var newPos = ident(text, children, pos) /*1*/
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
        var newPos = card(text, children, pos) /*2*/
        accept = newPos !== -1
        if (accept) {
            pos = newPos
        } else {
            accept = true
        }
        accept = (text.charCodeAt(pos) === 32 /*" "*/ || text.charCodeAt(pos) === 9 /*"\t"*/ || text.charCodeAt(pos) === 10 /*"\n"*/)
        while (accept) {
            pos += 1
            accept = (text.charCodeAt(pos) === 32 /*" "*/ || text.charCodeAt(pos) === 9 /*"\t"*/ || text.charCodeAt(pos) === 10 /*"\n"*/)
        }
        accept = true




        while (accept) {
            prev = pos
            var prev = pos
            var newPos = par(text, children, pos) /*1*/
            accept = newPos !== -1
            if (accept) {
                pos = newPos

            }

            if (!accept) {
                pos = prev
                var prev = pos
                var newPos = escape(text, children, pos) /*1*/
                accept = newPos !== -1
                if (accept) {
                    pos = newPos

                }

                if (!accept) {
                    pos = prev
                    var prev = pos
                    var newPos = str(text, children, pos) /*1*/
                    accept = newPos !== -1
                    if (accept) {
                        pos = newPos

                    }

                    if (!accept) {
                        pos = prev
                        var prev = pos
                        var newPos = nset(text, children, pos) /*1*/
                        accept = newPos !== -1
                        if (accept) {
                            pos = newPos

                        }

                        if (!accept) {
                            pos = prev
                            var prev = pos
                            var newPos = set(text, children, pos) /*1*/
                            accept = newPos !== -1
                            if (accept) {
                                pos = newPos

                            }

                            if (!accept) {
                                pos = prev
                                var newPos = ident(text, children, pos) /*1*/
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
            var newPos = card(text, children, pos) /*2*/
            accept = newPos !== -1
            if (accept) {
                pos = newPos
            } else {
                accept = true
            }
            accept = (text.charCodeAt(pos) === 32 /*" "*/ || text.charCodeAt(pos) === 9 /*"\t"*/ || text.charCodeAt(pos) === 10 /*"\n"*/)
            while (accept) {
                pos += 1
                accept = (text.charCodeAt(pos) === 32 /*" "*/ || text.charCodeAt(pos) === 9 /*"\t"*/ || text.charCodeAt(pos) === 10 /*"\n"*/)
            }
            accept = true




            if (pos === prev) break
        }
        pos = prev
        accept = true


    }

    if (accept && pos !== start) {
        var end = pos
        if (parent)
            parent.push({
                name: "and",
                text: text.substring(start, end),
                children
            })
        return end
    }
    return -1
}

function or(text, parent, pos = 0) {
    var start = pos
    var accept = true
    var children = parent ? [] : null
    var prev = pos
    var newPos = par(text, children, pos) /*1*/
    accept = newPos !== -1
    if (accept) {
        pos = newPos

    }

    if (!accept) {
        pos = prev
        var newPos = and(text, children, pos) /*1*/
        accept = newPos !== -1
        if (accept) {
            pos = newPos

        }

    }
    accept = (text.charCodeAt(pos) === 32 /*" "*/ || text.charCodeAt(pos) === 9 /*"\t"*/ || text.charCodeAt(pos) === 10 /*"\n"*/)
    while (accept) {
        pos += 1
        accept = (text.charCodeAt(pos) === 32 /*" "*/ || text.charCodeAt(pos) === 9 /*"\t"*/ || text.charCodeAt(pos) === 10 /*"\n"*/)
    }
    accept = true
    accept = text.charCodeAt(pos) === 124 /*"|"*/
    if (accept) {
        pos += 1
        accept = (text.charCodeAt(pos) === 32 /*" "*/ || text.charCodeAt(pos) === 9 /*"\t"*/ || text.charCodeAt(pos) === 10 /*"\n"*/)
        while (accept) {
            pos += 1
            accept = (text.charCodeAt(pos) === 32 /*" "*/ || text.charCodeAt(pos) === 9 /*"\t"*/ || text.charCodeAt(pos) === 10 /*"\n"*/)
        }
        accept = true
        var prev = pos
        var newPos = par(text, children, pos) /*1*/
        accept = newPos !== -1
        if (accept) {
            pos = newPos

        }

        if (!accept) {
            pos = prev
            var newPos = and(text, children, pos) /*1*/
            accept = newPos !== -1
            if (accept) {
                pos = newPos

            }

        }


    }


    if (accept) {
        var prev = pos
        accept = (text.charCodeAt(pos) === 32 /*" "*/ || text.charCodeAt(pos) === 9 /*"\t"*/ || text.charCodeAt(pos) === 10 /*"\n"*/)
        while (accept) {
            pos += 1
            accept = (text.charCodeAt(pos) === 32 /*" "*/ || text.charCodeAt(pos) === 9 /*"\t"*/ || text.charCodeAt(pos) === 10 /*"\n"*/)
        }
        accept = true
        accept = text.charCodeAt(pos) === 124 /*"|"*/
        if (accept) {
            pos += 1
            accept = (text.charCodeAt(pos) === 32 /*" "*/ || text.charCodeAt(pos) === 9 /*"\t"*/ || text.charCodeAt(pos) === 10 /*"\n"*/)
            while (accept) {
                pos += 1
                accept = (text.charCodeAt(pos) === 32 /*" "*/ || text.charCodeAt(pos) === 9 /*"\t"*/ || text.charCodeAt(pos) === 10 /*"\n"*/)
            }
            accept = true
            var prev = pos
            var newPos = par(text, children, pos) /*1*/
            accept = newPos !== -1
            if (accept) {
                pos = newPos

            }

            if (!accept) {
                pos = prev
                var newPos = and(text, children, pos) /*1*/
                accept = newPos !== -1
                if (accept) {
                    pos = newPos

                }

            }


        }


        while (accept) {
            prev = pos
            accept = (text.charCodeAt(pos) === 32 /*" "*/ || text.charCodeAt(pos) === 9 /*"\t"*/ || text.charCodeAt(pos) === 10 /*"\n"*/)
            while (accept) {
                pos += 1
                accept = (text.charCodeAt(pos) === 32 /*" "*/ || text.charCodeAt(pos) === 9 /*"\t"*/ || text.charCodeAt(pos) === 10 /*"\n"*/)
            }
            accept = true
            accept = text.charCodeAt(pos) === 124 /*"|"*/
            if (accept) {
                pos += 1
                accept = (text.charCodeAt(pos) === 32 /*" "*/ || text.charCodeAt(pos) === 9 /*"\t"*/ || text.charCodeAt(pos) === 10 /*"\n"*/)
                while (accept) {
                    pos += 1
                    accept = (text.charCodeAt(pos) === 32 /*" "*/ || text.charCodeAt(pos) === 9 /*"\t"*/ || text.charCodeAt(pos) === 10 /*"\n"*/)
                }
                accept = true
                var prev = pos
                var newPos = par(text, children, pos) /*1*/
                accept = newPos !== -1
                if (accept) {
                    pos = newPos

                }

                if (!accept) {
                    pos = prev
                    var newPos = and(text, children, pos) /*1*/
                    accept = newPos !== -1
                    if (accept) {
                        pos = newPos

                    }

                }


            }


            if (pos === prev) break
        }
        pos = prev
        accept = true


    }

    if (accept && pos !== start) {
        var end = pos
        if (parent)
            parent.push({
                name: "or",
                text: text.substring(start, end),
                children
            })
        return end
    }
    return -1
}

function par(text, parent, pos = 0) {
    var start = pos
    var accept = true
    var children = parent ? [] : null
    accept = text.charCodeAt(pos) === 40 /*"("*/
    if (accept) {
        pos += 1
        accept = (text.charCodeAt(pos) === 32 /*" "*/ || text.charCodeAt(pos) === 9 /*"\t"*/ || text.charCodeAt(pos) === 10 /*"\n"*/)
        while (accept) {
            pos += 1
            accept = (text.charCodeAt(pos) === 32 /*" "*/ || text.charCodeAt(pos) === 9 /*"\t"*/ || text.charCodeAt(pos) === 10 /*"\n"*/)
        }
        accept = true
        var prev = pos
        var newPos = or(text, children, pos) /*1*/
        accept = newPos !== -1
        if (accept) {
            pos = newPos

        }

        if (!accept) {
            pos = prev
            var newPos = and(text, children, pos) /*1*/
            accept = newPos !== -1
            if (accept) {
                pos = newPos

            }

        }
        accept = (text.charCodeAt(pos) === 32 /*" "*/ || text.charCodeAt(pos) === 9 /*"\t"*/ || text.charCodeAt(pos) === 10 /*"\n"*/)
        while (accept) {
            pos += 1
            accept = (text.charCodeAt(pos) === 32 /*" "*/ || text.charCodeAt(pos) === 9 /*"\t"*/ || text.charCodeAt(pos) === 10 /*"\n"*/)
        }
        accept = true
        accept = text.charCodeAt(pos) === 41 /*")"*/
        if (accept) {
            pos += 1
            accept = (text.charCodeAt(pos) === 32 /*" "*/ || text.charCodeAt(pos) === 9 /*"\t"*/ || text.charCodeAt(pos) === 10 /*"\n"*/)
            while (accept) {
                pos += 1
                accept = (text.charCodeAt(pos) === 32 /*" "*/ || text.charCodeAt(pos) === 9 /*"\t"*/ || text.charCodeAt(pos) === 10 /*"\n"*/)
            }
            accept = true
            var newPos = card(text, children, pos) /*2*/
            accept = newPos !== -1
            if (accept) {
                pos = newPos
            } else {
                accept = true
            }



        }



    }

    if (accept && pos !== start) {
        var end = pos
        if (parent)
            parent.push({
                name: "par",
                text: text.substring(start, end),
                children
            })
        return end
    }
    return -1
}

function rule(text, parent, pos = 0) {
    var start = pos
    var accept = true
    var children = parent ? [] : null
    var newPos = ident(text, children, pos) /*1*/
    accept = newPos !== -1
    if (accept) {
        pos = newPos
        accept = (text.charCodeAt(pos) === 32 /*" "*/ || text.charCodeAt(pos) === 9 /*"\t"*/ || text.charCodeAt(pos) === 10 /*"\n"*/)
        while (accept) {
            pos += 1
            accept = (text.charCodeAt(pos) === 32 /*" "*/ || text.charCodeAt(pos) === 9 /*"\t"*/ || text.charCodeAt(pos) === 10 /*"\n"*/)
        }
        accept = true
        accept = text.charCodeAt(pos) === 61 /*"="*/
        if (accept) {
            pos += 1
            accept = (text.charCodeAt(pos) === 32 /*" "*/ || text.charCodeAt(pos) === 9 /*"\t"*/ || text.charCodeAt(pos) === 10 /*"\n"*/)
            while (accept) {
                pos += 1
                accept = (text.charCodeAt(pos) === 32 /*" "*/ || text.charCodeAt(pos) === 9 /*"\t"*/ || text.charCodeAt(pos) === 10 /*"\n"*/)
            }
            accept = true
            var prev = pos
            var newPos = or(text, children, pos) /*1*/
            accept = newPos !== -1
            if (accept) {
                pos = newPos

            }

            if (!accept) {
                pos = prev
                var prev = pos
                var newPos = and(text, children, pos) /*1*/
                accept = newPos !== -1
                if (accept) {
                    pos = newPos

                }

                if (!accept) {
                    pos = prev
                    var newPos = par(text, children, pos) /*1*/
                    accept = newPos !== -1
                    if (accept) {
                        pos = newPos
                        var prev = pos
                        accept = (text.charCodeAt(pos) === 32 /*" "*/ || text.charCodeAt(pos) === 9 /*"\t"*/ || text.charCodeAt(pos) === 10 /*"\n"*/)
                        while (accept) {
                            pos += 1
                            accept = (text.charCodeAt(pos) === 32 /*" "*/ || text.charCodeAt(pos) === 9 /*"\t"*/ || text.charCodeAt(pos) === 10 /*"\n"*/)
                        }
                        accept = true
                        var newPos = card(text, children, pos) /*1*/
                        accept = newPos !== -1
                        if (accept) {
                            pos = newPos

                        }


                        if (!accept) {
                            accept = true
                            pos = prev
                        }


                    }

                }

            }


        }


    }

    if (accept && pos !== start) {
        var end = pos
        if (parent)
            parent.push({
                name: "rule",
                text: text.substring(start, end),
                children
            })
        return end
    }
    return -1
}

function rules(text, parent, pos = 0) {
    var start = pos
    var accept = true
    var children = parent ? [] : null
    accept = (text.charCodeAt(pos) === 32 /*" "*/ || text.charCodeAt(pos) === 9 /*"\t"*/ || text.charCodeAt(pos) === 10 /*"\n"*/)
    while (accept) {
        pos += 1
        accept = (text.charCodeAt(pos) === 32 /*" "*/ || text.charCodeAt(pos) === 9 /*"\t"*/ || text.charCodeAt(pos) === 10 /*"\n"*/)
    }
    accept = true
    var newPos = rule(text, children, pos) /*1*/
    accept = newPos !== -1
    if (accept) {
        pos = newPos
        accept = (text.charCodeAt(pos) === 32 /*" "*/ || text.charCodeAt(pos) === 9 /*"\t"*/ || text.charCodeAt(pos) === 10 /*"\n"*/)
        while (accept) {
            pos += 1
            accept = (text.charCodeAt(pos) === 32 /*" "*/ || text.charCodeAt(pos) === 9 /*"\t"*/ || text.charCodeAt(pos) === 10 /*"\n"*/)
        }
        accept = true
        accept = text.charCodeAt(pos) === 59 /*";"*/
        if (accept) {
            pos += 1

        }


    }


    if (accept) {
        var prev = pos
        accept = (text.charCodeAt(pos) === 32 /*" "*/ || text.charCodeAt(pos) === 9 /*"\t"*/ || text.charCodeAt(pos) === 10 /*"\n"*/)
        while (accept) {
            pos += 1
            accept = (text.charCodeAt(pos) === 32 /*" "*/ || text.charCodeAt(pos) === 9 /*"\t"*/ || text.charCodeAt(pos) === 10 /*"\n"*/)
        }
        accept = true
        var newPos = rule(text, children, pos) /*1*/
        accept = newPos !== -1
        if (accept) {
            pos = newPos
            accept = (text.charCodeAt(pos) === 32 /*" "*/ || text.charCodeAt(pos) === 9 /*"\t"*/ || text.charCodeAt(pos) === 10 /*"\n"*/)
            while (accept) {
                pos += 1
                accept = (text.charCodeAt(pos) === 32 /*" "*/ || text.charCodeAt(pos) === 9 /*"\t"*/ || text.charCodeAt(pos) === 10 /*"\n"*/)
            }
            accept = true
            accept = text.charCodeAt(pos) === 59 /*";"*/
            if (accept) {
                pos += 1

            }


        }


        while (accept) {
            prev = pos
            accept = (text.charCodeAt(pos) === 32 /*" "*/ || text.charCodeAt(pos) === 9 /*"\t"*/ || text.charCodeAt(pos) === 10 /*"\n"*/)
            while (accept) {
                pos += 1
                accept = (text.charCodeAt(pos) === 32 /*" "*/ || text.charCodeAt(pos) === 9 /*"\t"*/ || text.charCodeAt(pos) === 10 /*"\n"*/)
            }
            accept = true
            var newPos = rule(text, children, pos) /*1*/
            accept = newPos !== -1
            if (accept) {
                pos = newPos
                accept = (text.charCodeAt(pos) === 32 /*" "*/ || text.charCodeAt(pos) === 9 /*"\t"*/ || text.charCodeAt(pos) === 10 /*"\n"*/)
                while (accept) {
                    pos += 1
                    accept = (text.charCodeAt(pos) === 32 /*" "*/ || text.charCodeAt(pos) === 9 /*"\t"*/ || text.charCodeAt(pos) === 10 /*"\n"*/)
                }
                accept = true
                accept = text.charCodeAt(pos) === 59 /*";"*/
                if (accept) {
                    pos += 1

                }


            }


            if (pos === prev) break
        }
        pos = prev
        accept = true
        accept = (text.charCodeAt(pos) === 32 /*" "*/ || text.charCodeAt(pos) === 9 /*"\t"*/ || text.charCodeAt(pos) === 10 /*"\n"*/)
        while (accept) {
            pos += 1
            accept = (text.charCodeAt(pos) === 32 /*" "*/ || text.charCodeAt(pos) === 9 /*"\t"*/ || text.charCodeAt(pos) === 10 /*"\n"*/)
        }
        accept = true



    }

    if (accept && pos !== start) {
        var end = pos
        if (parent)
            parent.push({
                name: "rules",
                text: text.substring(start, end),
                children
            })
        return end
    }
    return -1
}
