exports.escape = escape
function escape(text, pos = 0) {
    let start = pos
    let a = true
    let children = []
    if (a = /* char predicate */ (/* char "\\" */ text.charCodeAt(pos) === 92)) {
        pos += 1
    }

    if (a) {
        if (a = /* char predicate */ (/* any char */ pos < text.length)) {
            pos += 1
        }

    }

    if (a) {
        return ({
            name: "escape",
            start,
            end: pos,
            children
        })
    }
    return null
}
exports.ident = ident
function ident(text, pos = 0) {
    let start = pos
    let a = true
    let children = []
    if (a = /* char predicate */ (/* set */ (/* range from "a" to "z" */ text.charCodeAt(pos) >= 97 && text.charCodeAt(pos) <= 122 || /* range from "A" to "Z" */ text.charCodeAt(pos) >= 65 && text.charCodeAt(pos) <= 90 || /* char "_" */ text.charCodeAt(pos) === 95 || /* char "$" */ text.charCodeAt(pos) === 36))) {
        pos += 1
    }

    if (a) {
        let c1 = 0
        let prevPos2 = pos
        let prevChildLen3 = children.length
        do {
            if (a = /* char predicate */ (/* set */ (/* range from "a" to "z" */ text.charCodeAt(pos) >= 97 && text.charCodeAt(pos) <= 122 || /* range from "A" to "Z" */ text.charCodeAt(pos) >= 65 && text.charCodeAt(pos) <= 90 || /* range from "0" to "9" */ text.charCodeAt(pos) >= 48 && text.charCodeAt(pos) <= 57 || /* char "_" */ text.charCodeAt(pos) === 95 || /* char "$" */ text.charCodeAt(pos) === 36))) {
                pos += 1
            }

        } while (a && ++c1 < Infinity);
        a = c1 >= 0
        if (!a) {
            pos = prevPos2
            children.length = prevChildLen3
        }

    }

    if (a) {
        return ({
            name: "ident",
            start,
            end: pos,
            children
        })
    }
    return null
}
exports.str = str
function str(text, pos = 0) {
    let start = pos
    let a = true
    let children = []
    if (a = /* char predicate */ (/* char "\"" */ text.charCodeAt(pos) === 34)) {
        pos += 1
    }

    if (a) {
        let c4 = 0
        let prevPos5 = pos
        let prevChildLen6 = children.length
        do {
            if (a = /* char predicate */ (/* char "\\" */ text.charCodeAt(pos) === 92)) {
                pos += 1
            }

            if (a) {
                if (a = /* char predicate */ (/* char "\"" */ text.charCodeAt(pos) === 34)) {
                    pos += 1
                }

            }

            if (!a) {
                if (a = /* char predicate */ (/* nset */ pos < text.length && !(/* char "\"" */ text.charCodeAt(pos) === 34))) {
                    pos += 1
                }

            }

        } while (a && ++c4 < Infinity);
        a = c4 >= 0
        if (!a) {
            pos = prevPos5
            children.length = prevChildLen6
        }
        if (a) {
            if (a = /* char predicate */ (/* char "\"" */ text.charCodeAt(pos) === 34)) {
                pos += 1
            }

        }

    }

    if (a) {
        return ({
            name: "str",
            start,
            end: pos,
            children
        })
    }
    return null
}
exports.nset = nset
function nset(text, pos = 0) {
    let start = pos
    let a = true
    let children = []
    if (a = /* string */ text.startsWith("[^", pos)) {
        pos += 2
    }

    if (a) {
        let c7 = 0
        let prevPos8 = pos
        let prevChildLen9 = children.length
        do {
            let match10 = escape(text, pos)
            if (a = (match10 !== null)) {
                pos += match10.end - match10.start
                children.push(match10)
            }

            if (!a) {
                if (a = /* char predicate */ (/* nset */ pos < text.length && !(/* char "]" */ text.charCodeAt(pos) === 93))) {
                    pos += 1
                }

            }

        } while (a && ++c7 < Infinity);
        a = c7 >= 1
        if (!a) {
            pos = prevPos8
            children.length = prevChildLen9
        }
        if (a) {
            if (a = /* char predicate */ (/* char "]" */ text.charCodeAt(pos) === 93)) {
                pos += 1
            }

        }

    }

    if (a) {
        return ({
            name: "nset",
            start,
            end: pos,
            children
        })
    }
    return null
}
exports.set = set
function set(text, pos = 0) {
    let start = pos
    let a = true
    let children = []
    if (a = /* char predicate */ (/* char "[" */ text.charCodeAt(pos) === 91)) {
        pos += 1
    }

    if (a) {
        let c11 = 0
        let prevPos12 = pos
        let prevChildLen13 = children.length
        do {
            let match14 = escape(text, pos)
            if (a = (match14 !== null)) {
                pos += match14.end - match14.start
                children.push(match14)
            }

            if (!a) {
                if (a = /* char predicate */ (/* nset */ pos < text.length && !(/* char "]" */ text.charCodeAt(pos) === 93))) {
                    pos += 1
                }

            }

        } while (a && ++c11 < Infinity);
        a = c11 >= 1
        if (!a) {
            pos = prevPos12
            children.length = prevChildLen13
        }
        if (a) {
            if (a = /* char predicate */ (/* char "]" */ text.charCodeAt(pos) === 93)) {
                pos += 1
            }

        }

    }

    if (a) {
        return ({
            name: "set",
            start,
            end: pos,
            children
        })
    }
    return null
}
exports.card = card
function card(text, pos = 0) {
    let start = pos
    let a = true
    let children = []
    if (a = /* char predicate */ (/* set */ (/* char "?" */ text.charCodeAt(pos) === 63 || /* char "*" */ text.charCodeAt(pos) === 42 || /* char "+" */ text.charCodeAt(pos) === 43))) {
        pos += 1
    }

    if (a) {
        return ({
            name: "card",
            start,
            end: pos,
            children
        })
    }
    return null
}
exports.and = and
function and(text, pos = 0) {
    let start = pos
    let a = true
    let children = []
    let c15 = 0
    let prevPos16 = pos
    let prevChildLen17 = children.length
    do {
        let match18 = par(text, pos)
        if (a = (match18 !== null)) {
            pos += match18.end - match18.start
            children.push(match18)
        }

        if (!a) {
            let match19 = escape(text, pos)
            if (a = (match19 !== null)) {
                pos += match19.end - match19.start
                children.push(match19)
            }

        }
        if (!a) {
            let match20 = str(text, pos)
            if (a = (match20 !== null)) {
                pos += match20.end - match20.start
                children.push(match20)
            }

        }
        if (!a) {
            let match21 = nset(text, pos)
            if (a = (match21 !== null)) {
                pos += match21.end - match21.start
                children.push(match21)
            }

        }
        if (!a) {
            let match22 = set(text, pos)
            if (a = (match22 !== null)) {
                pos += match22.end - match22.start
                children.push(match22)
            }

        }
        if (!a) {
            let match23 = ident(text, pos)
            if (a = (match23 !== null)) {
                pos += match23.end - match23.start
                children.push(match23)
            }

        }

        if (a) {
            let c24 = 0
            let prevPos25 = pos
            let prevChildLen26 = children.length
            do {
                if (a = /* char predicate */ (/* set */ (/* char " " */ text.charCodeAt(pos) === 32 || /* char "\t" */ text.charCodeAt(pos) === 9 || /* char "\n" */ text.charCodeAt(pos) === 10))) {
                    pos += 1
                }

            } while (a && ++c24 < Infinity);
            a = c24 >= 0
            if (!a) {
                pos = prevPos25
                children.length = prevChildLen26
            }
            if (a) {
                let c27 = 0
                let prevPos28 = pos
                let prevChildLen29 = children.length
                do {
                    let match30 = card(text, pos)
                    if (a = (match30 !== null)) {
                        pos += match30.end - match30.start
                        children.push(match30)
                    }

                } while (a && ++c27 < 1);
                a = c27 >= 0
                if (!a) {
                    pos = prevPos28
                    children.length = prevChildLen29
                }
                if (a) {
                    let c31 = 0
                    let prevPos32 = pos
                    let prevChildLen33 = children.length
                    do {
                        if (a = /* char predicate */ (/* set */ (/* char " " */ text.charCodeAt(pos) === 32 || /* char "\t" */ text.charCodeAt(pos) === 9 || /* char "\n" */ text.charCodeAt(pos) === 10))) {
                            pos += 1
                        }

                    } while (a && ++c31 < Infinity);
                    a = c31 >= 0
                    if (!a) {
                        pos = prevPos32
                        children.length = prevChildLen33
                    }

                }

            }

        }

    } while (a && ++c15 < Infinity);
    a = c15 >= 1
    if (!a) {
        pos = prevPos16
        children.length = prevChildLen17
    }

    if (a) {
        return ({
            name: "and",
            start,
            end: pos,
            children
        })
    }
    return null
}
exports.or = or
function or(text, pos = 0) {
    let start = pos
    let a = true
    let children = []
    let match34 = par(text, pos)
    if (a = (match34 !== null)) {
        pos += match34.end - match34.start
        children.push(match34)
    }

    if (!a) {
        let match35 = and(text, pos)
        if (a = (match35 !== null)) {
            pos += match35.end - match35.start
            children.push(match35)
        }

    }

    if (a) {
        let c36 = 0
        let prevPos37 = pos
        let prevChildLen38 = children.length
        do {
            let c39 = 0
            let prevPos40 = pos
            let prevChildLen41 = children.length
            do {
                if (a = /* char predicate */ (/* set */ (/* char " " */ text.charCodeAt(pos) === 32 || /* char "\t" */ text.charCodeAt(pos) === 9 || /* char "\n" */ text.charCodeAt(pos) === 10))) {
                    pos += 1
                }

            } while (a && ++c39 < Infinity);
            a = c39 >= 0
            if (!a) {
                pos = prevPos40
                children.length = prevChildLen41
            }

            if (a) {
                if (a = /* char predicate */ (/* char "|" */ text.charCodeAt(pos) === 124)) {
                    pos += 1
                }
                if (a) {
                    let c42 = 0
                    let prevPos43 = pos
                    let prevChildLen44 = children.length
                    do {
                        if (a = /* char predicate */ (/* set */ (/* char " " */ text.charCodeAt(pos) === 32 || /* char "\t" */ text.charCodeAt(pos) === 9 || /* char "\n" */ text.charCodeAt(pos) === 10))) {
                            pos += 1
                        }

                    } while (a && ++c42 < Infinity);
                    a = c42 >= 0
                    if (!a) {
                        pos = prevPos43
                        children.length = prevChildLen44
                    }
                    if (a) {
                        let match45 = par(text, pos)
                        if (a = (match45 !== null)) {
                            pos += match45.end - match45.start
                            children.push(match45)
                        }

                        if (!a) {
                            let match46 = and(text, pos)
                            if (a = (match46 !== null)) {
                                pos += match46.end - match46.start
                                children.push(match46)
                            }

                        }

                    }

                }

            }

        } while (a && ++c36 < Infinity);
        a = c36 >= 1
        if (!a) {
            pos = prevPos37
            children.length = prevChildLen38
        }

    }

    if (a) {
        return ({
            name: "or",
            start,
            end: pos,
            children
        })
    }
    return null
}
exports.par = par
function par(text, pos = 0) {
    let start = pos
    let a = true
    let children = []
    if (a = /* char predicate */ (/* char "(" */ text.charCodeAt(pos) === 40)) {
        pos += 1
    }

    if (a) {
        let c47 = 0
        let prevPos48 = pos
        let prevChildLen49 = children.length
        do {
            if (a = /* char predicate */ (/* set */ (/* char " " */ text.charCodeAt(pos) === 32 || /* char "\t" */ text.charCodeAt(pos) === 9 || /* char "\n" */ text.charCodeAt(pos) === 10))) {
                pos += 1
            }

        } while (a && ++c47 < Infinity);
        a = c47 >= 0
        if (!a) {
            pos = prevPos48
            children.length = prevChildLen49
        }
        if (a) {
            let match50 = or(text, pos)
            if (a = (match50 !== null)) {
                pos += match50.end - match50.start
                children.push(match50)
            }

            if (!a) {
                let match51 = and(text, pos)
                if (a = (match51 !== null)) {
                    pos += match51.end - match51.start
                    children.push(match51)
                }

            }
            if (a) {
                let c52 = 0
                let prevPos53 = pos
                let prevChildLen54 = children.length
                do {
                    if (a = /* char predicate */ (/* set */ (/* char " " */ text.charCodeAt(pos) === 32 || /* char "\t" */ text.charCodeAt(pos) === 9 || /* char "\n" */ text.charCodeAt(pos) === 10))) {
                        pos += 1
                    }

                } while (a && ++c52 < Infinity);
                a = c52 >= 0
                if (!a) {
                    pos = prevPos53
                    children.length = prevChildLen54
                }
                if (a) {
                    if (a = /* char predicate */ (/* char ")" */ text.charCodeAt(pos) === 41)) {
                        pos += 1
                    }
                    if (a) {
                        let c55 = 0
                        let prevPos56 = pos
                        let prevChildLen57 = children.length
                        do {
                            if (a = /* char predicate */ (/* set */ (/* char " " */ text.charCodeAt(pos) === 32 || /* char "\t" */ text.charCodeAt(pos) === 9 || /* char "\n" */ text.charCodeAt(pos) === 10))) {
                                pos += 1
                            }

                        } while (a && ++c55 < Infinity);
                        a = c55 >= 0
                        if (!a) {
                            pos = prevPos56
                            children.length = prevChildLen57
                        }
                        if (a) {
                            let c58 = 0
                            let prevPos59 = pos
                            let prevChildLen60 = children.length
                            do {
                                let match61 = card(text, pos)
                                if (a = (match61 !== null)) {
                                    pos += match61.end - match61.start
                                    children.push(match61)
                                }

                            } while (a && ++c58 < 1);
                            a = c58 >= 0
                            if (!a) {
                                pos = prevPos59
                                children.length = prevChildLen60
                            }

                        }

                    }

                }

            }

        }

    }

    if (a) {
        return ({
            name: "par",
            start,
            end: pos,
            children
        })
    }
    return null
}
exports.rule = rule
function rule(text, pos = 0) {
    let start = pos
    let a = true
    let children = []
    let match62 = ident(text, pos)
    if (a = (match62 !== null)) {
        pos += match62.end - match62.start
        children.push(match62)
    }

    if (a) {
        let c63 = 0
        let prevPos64 = pos
        let prevChildLen65 = children.length
        do {
            if (a = /* char predicate */ (/* set */ (/* char " " */ text.charCodeAt(pos) === 32 || /* char "\t" */ text.charCodeAt(pos) === 9 || /* char "\n" */ text.charCodeAt(pos) === 10))) {
                pos += 1
            }

        } while (a && ++c63 < Infinity);
        a = c63 >= 0
        if (!a) {
            pos = prevPos64
            children.length = prevChildLen65
        }
        if (a) {
            if (a = /* char predicate */ (/* char "=" */ text.charCodeAt(pos) === 61)) {
                pos += 1
            }
            if (a) {
                let c66 = 0
                let prevPos67 = pos
                let prevChildLen68 = children.length
                do {
                    if (a = /* char predicate */ (/* set */ (/* char " " */ text.charCodeAt(pos) === 32 || /* char "\t" */ text.charCodeAt(pos) === 9 || /* char "\n" */ text.charCodeAt(pos) === 10))) {
                        pos += 1
                    }

                } while (a && ++c66 < Infinity);
                a = c66 >= 0
                if (!a) {
                    pos = prevPos67
                    children.length = prevChildLen68
                }
                if (a) {
                    let match69 = or(text, pos)
                    if (a = (match69 !== null)) {
                        pos += match69.end - match69.start
                        children.push(match69)
                    }

                    if (!a) {
                        let match70 = and(text, pos)
                        if (a = (match70 !== null)) {
                            pos += match70.end - match70.start
                            children.push(match70)
                        }

                    }
                    if (!a) {
                        let match71 = par(text, pos)
                        if (a = (match71 !== null)) {
                            pos += match71.end - match71.start
                            children.push(match71)
                        }

                        if (a) {
                            let c72 = 0
                            let prevPos73 = pos
                            let prevChildLen74 = children.length
                            do {
                                let c75 = 0
                                let prevPos76 = pos
                                let prevChildLen77 = children.length
                                do {
                                    if (a = /* char predicate */ (/* set */ (/* char " " */ text.charCodeAt(pos) === 32 || /* char "\t" */ text.charCodeAt(pos) === 9 || /* char "\n" */ text.charCodeAt(pos) === 10))) {
                                        pos += 1
                                    }

                                } while (a && ++c75 < Infinity);
                                a = c75 >= 0
                                if (!a) {
                                    pos = prevPos76
                                    children.length = prevChildLen77
                                }

                                if (a) {
                                    let match78 = card(text, pos)
                                    if (a = (match78 !== null)) {
                                        pos += match78.end - match78.start
                                        children.push(match78)
                                    }

                                }

                            } while (a && ++c72 < 1);
                            a = c72 >= 0
                            if (!a) {
                                pos = prevPos73
                                children.length = prevChildLen74
                            }

                        }

                    }

                }

            }

        }

    }

    if (a) {
        return ({
            name: "rule",
            start,
            end: pos,
            children
        })
    }
    return null
}
exports.rules = rules
function rules(text, pos = 0) {
    let start = pos
    let a = true
    let children = []
    let c79 = 0
    let prevPos80 = pos
    let prevChildLen81 = children.length
    do {
        let c82 = 0
        let prevPos83 = pos
        let prevChildLen84 = children.length
        do {
            if (a = /* char predicate */ (/* set */ (/* char " " */ text.charCodeAt(pos) === 32 || /* char "\t" */ text.charCodeAt(pos) === 9 || /* char "\n" */ text.charCodeAt(pos) === 10))) {
                pos += 1
            }

        } while (a && ++c82 < Infinity);
        a = c82 >= 0
        if (!a) {
            pos = prevPos83
            children.length = prevChildLen84
        }

        if (a) {
            let match85 = rule(text, pos)
            if (a = (match85 !== null)) {
                pos += match85.end - match85.start
                children.push(match85)
            }
            if (a) {
                let c86 = 0
                let prevPos87 = pos
                let prevChildLen88 = children.length
                do {
                    if (a = /* char predicate */ (/* set */ (/* char " " */ text.charCodeAt(pos) === 32 || /* char "\t" */ text.charCodeAt(pos) === 9 || /* char "\n" */ text.charCodeAt(pos) === 10))) {
                        pos += 1
                    }

                } while (a && ++c86 < Infinity);
                a = c86 >= 0
                if (!a) {
                    pos = prevPos87
                    children.length = prevChildLen88
                }
                if (a) {
                    if (a = /* char predicate */ (/* char ";" */ text.charCodeAt(pos) === 59)) {
                        pos += 1
                    }

                }

            }

        }

    } while (a && ++c79 < Infinity);
    a = c79 >= 1
    if (!a) {
        pos = prevPos80
        children.length = prevChildLen81
    }

    if (a) {
        let c89 = 0
        let prevPos90 = pos
        let prevChildLen91 = children.length
        do {
            if (a = /* char predicate */ (/* set */ (/* char " " */ text.charCodeAt(pos) === 32 || /* char "\t" */ text.charCodeAt(pos) === 9 || /* char "\n" */ text.charCodeAt(pos) === 10))) {
                pos += 1
            }

        } while (a && ++c89 < Infinity);
        a = c89 >= 0
        if (!a) {
            pos = prevPos90
            children.length = prevChildLen91
        }

    }

    if (a) {
        return ({
            name: "rules",
            start,
            end: pos,
            children
        })
    }
    return null
}
