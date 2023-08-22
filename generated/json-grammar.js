exports.JSON = JSON
function JSON(text, pos = 0) {
    let start = pos
    let a = true
    let children = []
    let prevPos1 = pos
    let prevChildLen2 = children.length

    let c3 = 0
    do {
        if (a = /* char predicate */ (/* set */ (/* char " " */ text.charCodeAt(pos) === 32 || /* char "\t" */ text.charCodeAt(pos) === 9 || /* char "\n" */ text.charCodeAt(pos) === 10))) {
            pos += 1
        }
    } while (a && ++c3);

    a = true

    if (a) {
        let match6 = NULL(text, pos)
        if (a = (match6 !== null)) {
            pos += match6.end - match6.start
            children.push(match6)
        }

        if (!a) {
            let match7 = BOOL(text, pos)
            if (a = (match7 !== null)) {
                pos += match7.end - match7.start
                children.push(match7)
            }

        }
        if (!a) {
            let match8 = NUMBER(text, pos)
            if (a = (match8 !== null)) {
                pos += match8.end - match8.start
                children.push(match8)
            }

        }
        if (!a) {
            let match9 = STRING(text, pos)
            if (a = (match9 !== null)) {
                pos += match9.end - match9.start
                children.push(match9)
            }

        }
        if (!a) {
            let match10 = LIST(text, pos)
            if (a = (match10 !== null)) {
                pos += match10.end - match10.start
                children.push(match10)
            }

        }
        if (!a) {
            let match11 = OBJECT(text, pos)
            if (a = (match11 !== null)) {
                pos += match11.end - match11.start
                children.push(match11)
            }

        }
        if (a) {

            let c12 = 0
            do {
                if (a = /* char predicate */ (/* set */ (/* char " " */ text.charCodeAt(pos) === 32 || /* char "\t" */ text.charCodeAt(pos) === 9 || /* char "\n" */ text.charCodeAt(pos) === 10))) {
                    pos += 1
                }
            } while (a && ++c12);

            a = true

        }

    }
    if (!a) {
        pos = prevPos1
        children.length = prevChildLen2
    }
    if (a) {
        return ({
            name: "JSON",
            start,
            end: pos,
            children
        })
    }
    return null
}
exports.NULL = NULL
function NULL(text, pos = 0) {
    let start = pos
    let a = true
    let children = []
    if (a = /* string */ text.startsWith("null", pos)) {
        pos += 4
    }

    if (a) {
        return ({
            name: "NULL",
            start,
            end: pos,
            children
        })
    }
    return null
}
exports.BOOL = BOOL
function BOOL(text, pos = 0) {
    let start = pos
    let a = true
    let children = []
    if (a = /* string */ text.startsWith("true", pos)) {
        pos += 4
    }

    if (!a) {
        if (a = /* string */ text.startsWith("false", pos)) {
            pos += 5
        }

    }

    if (a) {
        return ({
            name: "BOOL",
            start,
            end: pos,
            children
        })
    }
    return null
}
exports.NUMBER = NUMBER
function NUMBER(text, pos = 0) {
    let start = pos
    let a = true
    let children = []
    let prevPos15 = pos
    let prevChildLen16 = children.length
    if (a = /* char predicate */ (/* char "0" */ text.charCodeAt(pos) === 48)) {
        pos += 1
    }

    if (!a) {

        let c17 = 0
        let prevPos18 = 0
        let prevChildLen19 = 0
        do {
            if (a = /* char predicate */ (/* range from "0" to "9" */ text.charCodeAt(pos) >= 48 && text.charCodeAt(pos) <= 57)) {
                pos += 1
            }
        } while (a && ++c17);

        a = c17 >= 1
        if (!a) {
            pos = prevPos18
            children.length = prevChildLen19
        }

    }

    if (a) {
        let prevPos20 = pos
        let prevChildLen21 = children.length
        if (a = /* char predicate */ (/* char "." */ text.charCodeAt(pos) === 46)) {
            pos += 1
        }

        if (a) {

            let c22 = 0
            let prevPos23 = 0
            let prevChildLen24 = 0
            do {
                if (a = /* char predicate */ (/* range from "0" to "9" */ text.charCodeAt(pos) >= 48 && text.charCodeAt(pos) <= 57)) {
                    pos += 1
                }
            } while (a && ++c22);

            a = c22 >= 1
            if (!a) {
                pos = prevPos23
                children.length = prevChildLen24
            }

        }
        if (!a) {
            pos = prevPos20
            children.length = prevChildLen21
        }
        a = true

    }
    if (!a) {
        pos = prevPos15
        children.length = prevChildLen16
    }
    if (a) {
        return ({
            name: "NUMBER",
            start,
            end: pos,
            children
        })
    }
    return null
}
exports.STRING = STRING
function STRING(text, pos = 0) {
    let start = pos
    let a = true
    let children = []
    let prevPos25 = pos
    let prevChildLen26 = children.length
    if (a = /* char predicate */ (/* char "\"" */ text.charCodeAt(pos) === 34)) {
        pos += 1
    }

    if (a) {

        let c27 = 0
        do {
            if (a = /* char predicate */ (/* nset */ pos < text.length && !(/* char "\"" */ text.charCodeAt(pos) === 34))) {
                pos += 1
            }
        } while (a && ++c27);

        a = true
        if (a) {
            if (a = /* char predicate */ (/* char "\"" */ text.charCodeAt(pos) === 34)) {
                pos += 1
            }

        }

    }
    if (!a) {
        pos = prevPos25
        children.length = prevChildLen26
    }
    if (a) {
        return ({
            name: "STRING",
            start,
            end: pos,
            children
        })
    }
    return null
}
exports.LIST = LIST
function LIST(text, pos = 0) {
    let start = pos
    let a = true
    let children = []
    let prevPos30 = pos
    let prevChildLen31 = children.length
    if (a = /* char predicate */ (/* char "[" */ text.charCodeAt(pos) === 91)) {
        pos += 1
    }

    if (a) {
        let prevPos32 = pos
        let prevChildLen33 = children.length
        let match34 = JSON(text, pos)
        if (a = (match34 !== null)) {
            pos += match34.end - match34.start
            children.push(match34)
        }

        if (a) {

            let c35 = 0
            do {
                let prevPos38 = pos
                let prevChildLen39 = children.length
                if (a = /* char predicate */ (/* char "," */ text.charCodeAt(pos) === 44)) {
                    pos += 1
                }

                if (a) {
                    let match40 = JSON(text, pos)
                    if (a = (match40 !== null)) {
                        pos += match40.end - match40.start
                        children.push(match40)
                    }

                }
                if (!a) {
                    pos = prevPos38
                    children.length = prevChildLen39
                }
            } while (a && ++c35);

            a = true

        }
        if (!a) {
            pos = prevPos32
            children.length = prevChildLen33
        }
        a = true
        if (a) {
            if (a = /* char predicate */ (/* char "]" */ text.charCodeAt(pos) === 93)) {
                pos += 1
            }

        }

    }
    if (!a) {
        pos = prevPos30
        children.length = prevChildLen31
    }
    if (a) {
        return ({
            name: "LIST",
            start,
            end: pos,
            children
        })
    }
    return null
}
exports.KEY = KEY
function KEY(text, pos = 0) {
    let start = pos
    let a = true
    let children = []
    let prevPos41 = pos
    let prevChildLen42 = children.length

    let c43 = 0
    do {
        if (a = /* char predicate */ (/* set */ (/* char " " */ text.charCodeAt(pos) === 32 || /* char "\t" */ text.charCodeAt(pos) === 9 || /* char "\n" */ text.charCodeAt(pos) === 10))) {
            pos += 1
        }
    } while (a && ++c43);

    a = true

    if (a) {
        let match46 = STRING(text, pos)
        if (a = (match46 !== null)) {
            pos += match46.end - match46.start
            children.push(match46)
        }
        if (a) {

            let c47 = 0
            do {
                if (a = /* char predicate */ (/* set */ (/* char " " */ text.charCodeAt(pos) === 32 || /* char "\t" */ text.charCodeAt(pos) === 9 || /* char "\n" */ text.charCodeAt(pos) === 10))) {
                    pos += 1
                }
            } while (a && ++c47);

            a = true

        }

    }
    if (!a) {
        pos = prevPos41
        children.length = prevChildLen42
    }
    if (a) {
        return ({
            name: "KEY",
            start,
            end: pos,
            children
        })
    }
    return null
}
exports.OBJECT = OBJECT
function OBJECT(text, pos = 0) {
    let start = pos
    let a = true
    let children = []
    let prevPos50 = pos
    let prevChildLen51 = children.length
    if (a = /* char predicate */ (/* char "{" */ text.charCodeAt(pos) === 123)) {
        pos += 1
    }

    if (a) {
        let prevPos52 = pos
        let prevChildLen53 = children.length
        let match54 = KEY(text, pos)
        if (a = (match54 !== null)) {
            pos += match54.end - match54.start
            children.push(match54)
        }

        if (a) {
            if (a = /* char predicate */ (/* char ":" */ text.charCodeAt(pos) === 58)) {
                pos += 1
            }
            if (a) {
                let match55 = JSON(text, pos)
                if (a = (match55 !== null)) {
                    pos += match55.end - match55.start
                    children.push(match55)
                }
                if (a) {

                    let c56 = 0
                    do {
                        let prevPos59 = pos
                        let prevChildLen60 = children.length
                        if (a = /* char predicate */ (/* char "," */ text.charCodeAt(pos) === 44)) {
                            pos += 1
                        }

                        if (a) {
                            let match61 = KEY(text, pos)
                            if (a = (match61 !== null)) {
                                pos += match61.end - match61.start
                                children.push(match61)
                            }
                            if (a) {
                                if (a = /* char predicate */ (/* char ":" */ text.charCodeAt(pos) === 58)) {
                                    pos += 1
                                }
                                if (a) {
                                    let match62 = JSON(text, pos)
                                    if (a = (match62 !== null)) {
                                        pos += match62.end - match62.start
                                        children.push(match62)
                                    }

                                }

                            }

                        }
                        if (!a) {
                            pos = prevPos59
                            children.length = prevChildLen60
                        }
                    } while (a && ++c56);

                    a = true

                }

            }

        }
        if (!a) {
            pos = prevPos52
            children.length = prevChildLen53
        }
        a = true
        if (a) {
            if (a = /* char predicate */ (/* char "}" */ text.charCodeAt(pos) === 125)) {
                pos += 1
            }

        }

    }
    if (!a) {
        pos = prevPos50
        children.length = prevChildLen51
    }
    if (a) {
        return ({
            name: "OBJECT",
            start,
            end: pos,
            children
        })
    }
    return null
}
