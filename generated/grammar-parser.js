exports.escape = escape
function escape(text, pos = 0) {
    let start = pos
    let a = true
    let children = []
    let prevPos1 = pos
    let prevChildLen2 = children.length
    if (a = /* char predicate */ (/* char "\\" */ text.charCodeAt(pos) === 92)) {
        pos += 1
    }

    if (a) {
        if (a = /* char predicate */ (/* any char */ pos < text.length)) {
            pos += 1
        }

    }
    if (!a) {
        pos = prevPos1
        children.length = prevChildLen2
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
exports.anychar = anychar
function anychar(text, pos = 0) {
    let start = pos
    let a = true
    let children = []
    if (a = /* char predicate */ (/* char "." */ text.charCodeAt(pos) === 46)) {
        pos += 1
    }

    if (a) {
        return ({
            name: "anychar",
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
    let prevPos3 = pos
    let prevChildLen4 = children.length
    if (a = /* char predicate */ (/* set */ (/* range from "a" to "z" */ text.charCodeAt(pos) >= 97 && text.charCodeAt(pos) <= 122 || /* range from "A" to "Z" */ text.charCodeAt(pos) >= 65 && text.charCodeAt(pos) <= 90 || /* char "_" */ text.charCodeAt(pos) === 95 || /* char "$" */ text.charCodeAt(pos) === 36))) {
        pos += 1
    }

    if (a) {

        let c5 = 0
        do {
            if (a = /* char predicate */ (/* set */ (/* range from "a" to "z" */ text.charCodeAt(pos) >= 97 && text.charCodeAt(pos) <= 122 || /* range from "A" to "Z" */ text.charCodeAt(pos) >= 65 && text.charCodeAt(pos) <= 90 || /* range from "0" to "9" */ text.charCodeAt(pos) >= 48 && text.charCodeAt(pos) <= 57 || /* char "_" */ text.charCodeAt(pos) === 95 || /* char "$" */ text.charCodeAt(pos) === 36))) {
                pos += 1
            }
        } while (a && ++c5);

        a = true

    }
    if (!a) {
        pos = prevPos3
        children.length = prevChildLen4
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
    let prevPos8 = pos
    let prevChildLen9 = children.length
    if (a = /* char predicate */ (/* char "\"" */ text.charCodeAt(pos) === 34)) {
        pos += 1
    }

    if (a) {

        let c10 = 0
        do {
            let prevPos13 = pos
            let prevChildLen14 = children.length
            if (a = /* char predicate */ (/* char "\\" */ text.charCodeAt(pos) === 92)) {
                pos += 1
            }

            if (a) {
                if (a = /* char predicate */ (/* char "\"" */ text.charCodeAt(pos) === 34)) {
                    pos += 1
                }

            }
            if (!a) {
                pos = prevPos13
                children.length = prevChildLen14
            }
            if (!a) {
                if (a = /* char predicate */ (/* nset */ pos < text.length && !(/* char "\"" */ text.charCodeAt(pos) === 34))) {
                    pos += 1
                }

            }
        } while (a && ++c10);

        a = true
        if (a) {
            if (a = /* char predicate */ (/* char "\"" */ text.charCodeAt(pos) === 34)) {
                pos += 1
            }

        }

    }
    if (!a) {
        pos = prevPos8
        children.length = prevChildLen9
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
exports.set = set
function set(text, pos = 0) {
    let start = pos
    let a = true
    let children = []
    let prevPos15 = pos
    let prevChildLen16 = children.length
    if (a = /* char predicate */ (/* char "[" */ text.charCodeAt(pos) === 91)) {
        pos += 1
    }

    if (a) {
        if (a = /* char predicate */ (/* char "^" */ text.charCodeAt(pos) === 94)) {
            pos += 1
        }

        a = true
        if (a) {

            let c17 = 0
            let prevPos18 = 0
            let prevChildLen19 = 0
            do {
                let match20 = escape(text, pos)
                if (a = (match20 !== null)) {
                    pos += match20.end - match20.start
                    children.push(match20)
                }

                if (!a) {
                    let match21 = range(text, pos)
                    if (a = (match21 !== null)) {
                        pos += match21.end - match21.start
                        children.push(match21)
                    }

                }
                if (!a) {
                    let match22 = char(text, pos)
                    if (a = (match22 !== null)) {
                        pos += match22.end - match22.start
                        children.push(match22)
                    }

                }
            } while (a && ++c17);

            a = c17 >= 1
            if (!a) {
                pos = prevPos18
                children.length = prevChildLen19
            }
            if (a) {
                if (a = /* char predicate */ (/* char "]" */ text.charCodeAt(pos) === 93)) {
                    pos += 1
                }

            }

        }

    }
    if (!a) {
        pos = prevPos15
        children.length = prevChildLen16
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
exports.range = range
function range(text, pos = 0) {
    let start = pos
    let a = true
    let children = []
    let prevPos23 = pos
    let prevChildLen24 = children.length
    if (a = /* char predicate */ (/* any char */ pos < text.length)) {
        pos += 1
    }

    if (a) {
        if (a = /* char predicate */ (/* char "-" */ text.charCodeAt(pos) === 45)) {
            pos += 1
        }
        if (a) {
            if (a = /* char predicate */ (/* any char */ pos < text.length)) {
                pos += 1
            }

        }

    }
    if (!a) {
        pos = prevPos23
        children.length = prevChildLen24
    }
    if (a) {
        return ({
            name: "range",
            start,
            end: pos,
            children
        })
    }
    return null
}
exports.char = char
function char(text, pos = 0) {
    let start = pos
    let a = true
    let children = []
    if (a = /* char predicate */ (/* nset */ pos < text.length && !(/* char "]" */ text.charCodeAt(pos) === 93))) {
        pos += 1
    }

    if (a) {
        return ({
            name: "char",
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

    let c25 = 0
    let prevPos26 = 0
    let prevChildLen27 = 0
    do {
        let prevPos28 = pos
        let prevChildLen29 = children.length
        let match30 = par(text, pos)
        if (a = (match30 !== null)) {
            pos += match30.end - match30.start
            children.push(match30)
        }

        if (!a) {
            let match31 = anychar(text, pos)
            if (a = (match31 !== null)) {
                pos += match31.end - match31.start
                children.push(match31)
            }

        }
        if (!a) {
            let match32 = escape(text, pos)
            if (a = (match32 !== null)) {
                pos += match32.end - match32.start
                children.push(match32)
            }

        }
        if (!a) {
            let match33 = str(text, pos)
            if (a = (match33 !== null)) {
                pos += match33.end - match33.start
                children.push(match33)
            }

        }
        if (!a) {
            let match34 = set(text, pos)
            if (a = (match34 !== null)) {
                pos += match34.end - match34.start
                children.push(match34)
            }

        }
        if (!a) {
            let match35 = ident(text, pos)
            if (a = (match35 !== null)) {
                pos += match35.end - match35.start
                children.push(match35)
            }

        }

        if (a) {

            let c36 = 0
            do {
                if (a = /* char predicate */ (/* set */ (/* char " " */ text.charCodeAt(pos) === 32 || /* char "\t" */ text.charCodeAt(pos) === 9 || /* char "\n" */ text.charCodeAt(pos) === 10))) {
                    pos += 1
                }
            } while (a && ++c36);

            a = true
            if (a) {
                let match39 = card(text, pos)
                if (a = (match39 !== null)) {
                    pos += match39.end - match39.start
                    children.push(match39)
                }

                a = true
                if (a) {

                    let c40 = 0
                    do {
                        if (a = /* char predicate */ (/* set */ (/* char " " */ text.charCodeAt(pos) === 32 || /* char "\t" */ text.charCodeAt(pos) === 9 || /* char "\n" */ text.charCodeAt(pos) === 10))) {
                            pos += 1
                        }
                    } while (a && ++c40);

                    a = true

                }

            }

        }
        if (!a) {
            pos = prevPos28
            children.length = prevChildLen29
        }
    } while (a && ++c25);

    a = c25 >= 1
    if (!a) {
        pos = prevPos26
        children.length = prevChildLen27
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
    let prevPos43 = pos
    let prevChildLen44 = children.length
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

    if (a) {

        let c47 = 0
        let prevPos48 = 0
        let prevChildLen49 = 0
        do {
            let prevPos50 = pos
            let prevChildLen51 = children.length

            let c52 = 0
            do {
                if (a = /* char predicate */ (/* set */ (/* char " " */ text.charCodeAt(pos) === 32 || /* char "\t" */ text.charCodeAt(pos) === 9 || /* char "\n" */ text.charCodeAt(pos) === 10))) {
                    pos += 1
                }
            } while (a && ++c52);

            a = true

            if (a) {
                if (a = /* char predicate */ (/* char "|" */ text.charCodeAt(pos) === 124)) {
                    pos += 1
                }
                if (a) {

                    let c55 = 0
                    do {
                        if (a = /* char predicate */ (/* set */ (/* char " " */ text.charCodeAt(pos) === 32 || /* char "\t" */ text.charCodeAt(pos) === 9 || /* char "\n" */ text.charCodeAt(pos) === 10))) {
                            pos += 1
                        }
                    } while (a && ++c55);

                    a = true
                    if (a) {
                        let match58 = par(text, pos)
                        if (a = (match58 !== null)) {
                            pos += match58.end - match58.start
                            children.push(match58)
                        }

                        if (!a) {
                            let match59 = and(text, pos)
                            if (a = (match59 !== null)) {
                                pos += match59.end - match59.start
                                children.push(match59)
                            }

                        }

                    }

                }

            }
            if (!a) {
                pos = prevPos50
                children.length = prevChildLen51
            }
        } while (a && ++c47);

        a = c47 >= 1
        if (!a) {
            pos = prevPos48
            children.length = prevChildLen49
        }

    }
    if (!a) {
        pos = prevPos43
        children.length = prevChildLen44
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
    let prevPos60 = pos
    let prevChildLen61 = children.length
    if (a = /* char predicate */ (/* char "(" */ text.charCodeAt(pos) === 40)) {
        pos += 1
    }

    if (a) {

        let c62 = 0
        do {
            if (a = /* char predicate */ (/* set */ (/* char " " */ text.charCodeAt(pos) === 32 || /* char "\t" */ text.charCodeAt(pos) === 9 || /* char "\n" */ text.charCodeAt(pos) === 10))) {
                pos += 1
            }
        } while (a && ++c62);

        a = true
        if (a) {
            let match65 = or(text, pos)
            if (a = (match65 !== null)) {
                pos += match65.end - match65.start
                children.push(match65)
            }

            if (!a) {
                let match66 = and(text, pos)
                if (a = (match66 !== null)) {
                    pos += match66.end - match66.start
                    children.push(match66)
                }

            }
            if (a) {

                let c67 = 0
                do {
                    if (a = /* char predicate */ (/* set */ (/* char " " */ text.charCodeAt(pos) === 32 || /* char "\t" */ text.charCodeAt(pos) === 9 || /* char "\n" */ text.charCodeAt(pos) === 10))) {
                        pos += 1
                    }
                } while (a && ++c67);

                a = true
                if (a) {
                    if (a = /* char predicate */ (/* char ")" */ text.charCodeAt(pos) === 41)) {
                        pos += 1
                    }
                    if (a) {

                        let c70 = 0
                        do {
                            if (a = /* char predicate */ (/* set */ (/* char " " */ text.charCodeAt(pos) === 32 || /* char "\t" */ text.charCodeAt(pos) === 9 || /* char "\n" */ text.charCodeAt(pos) === 10))) {
                                pos += 1
                            }
                        } while (a && ++c70);

                        a = true
                        if (a) {
                            let match73 = card(text, pos)
                            if (a = (match73 !== null)) {
                                pos += match73.end - match73.start
                                children.push(match73)
                            }

                            a = true

                        }

                    }

                }

            }

        }

    }
    if (!a) {
        pos = prevPos60
        children.length = prevChildLen61
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
    let prevPos74 = pos
    let prevChildLen75 = children.length
    let match76 = ident(text, pos)
    if (a = (match76 !== null)) {
        pos += match76.end - match76.start
        children.push(match76)
    }

    if (a) {

        let c77 = 0
        do {
            if (a = /* char predicate */ (/* set */ (/* char " " */ text.charCodeAt(pos) === 32 || /* char "\t" */ text.charCodeAt(pos) === 9 || /* char "\n" */ text.charCodeAt(pos) === 10))) {
                pos += 1
            }
        } while (a && ++c77);

        a = true
        if (a) {
            if (a = /* char predicate */ (/* char "=" */ text.charCodeAt(pos) === 61)) {
                pos += 1
            }
            if (a) {

                let c80 = 0
                do {
                    if (a = /* char predicate */ (/* set */ (/* char " " */ text.charCodeAt(pos) === 32 || /* char "\t" */ text.charCodeAt(pos) === 9 || /* char "\n" */ text.charCodeAt(pos) === 10))) {
                        pos += 1
                    }
                } while (a && ++c80);

                a = true
                if (a) {
                    let match83 = or(text, pos)
                    if (a = (match83 !== null)) {
                        pos += match83.end - match83.start
                        children.push(match83)
                    }

                    if (!a) {
                        let match84 = and(text, pos)
                        if (a = (match84 !== null)) {
                            pos += match84.end - match84.start
                            children.push(match84)
                        }

                    }
                    if (!a) {
                        let prevPos85 = pos
                        let prevChildLen86 = children.length
                        let match87 = par(text, pos)
                        if (a = (match87 !== null)) {
                            pos += match87.end - match87.start
                            children.push(match87)
                        }

                        if (a) {
                            let prevPos88 = pos
                            let prevChildLen89 = children.length

                            let c90 = 0
                            do {
                                if (a = /* char predicate */ (/* set */ (/* char " " */ text.charCodeAt(pos) === 32 || /* char "\t" */ text.charCodeAt(pos) === 9 || /* char "\n" */ text.charCodeAt(pos) === 10))) {
                                    pos += 1
                                }
                            } while (a && ++c90);

                            a = true

                            if (a) {
                                let match93 = card(text, pos)
                                if (a = (match93 !== null)) {
                                    pos += match93.end - match93.start
                                    children.push(match93)
                                }

                            }
                            if (!a) {
                                pos = prevPos88
                                children.length = prevChildLen89
                            }
                            a = true

                        }
                        if (!a) {
                            pos = prevPos85
                            children.length = prevChildLen86
                        }
                    }

                }

            }

        }

    }
    if (!a) {
        pos = prevPos74
        children.length = prevChildLen75
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
    let prevPos94 = pos
    let prevChildLen95 = children.length

    let c96 = 0
    let prevPos97 = 0
    let prevChildLen98 = 0
    do {
        let prevPos99 = pos
        let prevChildLen100 = children.length

        let c101 = 0
        do {
            if (a = /* char predicate */ (/* set */ (/* char " " */ text.charCodeAt(pos) === 32 || /* char "\t" */ text.charCodeAt(pos) === 9 || /* char "\n" */ text.charCodeAt(pos) === 10))) {
                pos += 1
            }
        } while (a && ++c101);

        a = true

        if (a) {
            let match104 = rule(text, pos)
            if (a = (match104 !== null)) {
                pos += match104.end - match104.start
                children.push(match104)
            }
            if (a) {

                let c105 = 0
                do {
                    if (a = /* char predicate */ (/* set */ (/* char " " */ text.charCodeAt(pos) === 32 || /* char "\t" */ text.charCodeAt(pos) === 9 || /* char "\n" */ text.charCodeAt(pos) === 10))) {
                        pos += 1
                    }
                } while (a && ++c105);

                a = true
                if (a) {
                    if (a = /* char predicate */ (/* char ";" */ text.charCodeAt(pos) === 59)) {
                        pos += 1
                    }

                }

            }

        }
        if (!a) {
            pos = prevPos99
            children.length = prevChildLen100
        }
    } while (a && ++c96);

    a = c96 >= 1
    if (!a) {
        pos = prevPos97
        children.length = prevChildLen98
    }

    if (a) {

        let c108 = 0
        do {
            if (a = /* char predicate */ (/* set */ (/* char " " */ text.charCodeAt(pos) === 32 || /* char "\t" */ text.charCodeAt(pos) === 9 || /* char "\n" */ text.charCodeAt(pos) === 10))) {
                pos += 1
            }
        } while (a && ++c108);

        a = true

    }
    if (!a) {
        pos = prevPos94
        children.length = prevChildLen95
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
