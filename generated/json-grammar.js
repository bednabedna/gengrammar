exports.JSON = JSON
function JSON(text, pos = 0) {
    let start = pos
    let a = true
    let children = []
    let c1 = 0
    let prevPos2 = pos
    let prevChildLen3 = children.length
    do {
        if (a = /* char predicate */ (/* set */ (/* char " " */ text.charCodeAt(pos) === 32 || /* char "\t" */ text.charCodeAt(pos) === 9 || /* char "\n" */ text.charCodeAt(pos) === 10))) {
            pos += 1
        }

    } while (a && ++c1 < Infinity);
    a = c1 >= 0
    if (!a) {
        pos = prevPos2
        children.length = prevChildLen3
    }

    if (a) {
        let match4 = NULL(text, pos)
        if (a = (match4 !== null)) {
            pos += match4.end - match4.start
            children.push(match4)
        }


        if (!a) {
            let match5 = BOOL(text, pos)
            if (a = (match5 !== null)) {
                pos += match5.end - match5.start
                children.push(match5)
            }


        }
        if (!a) {
            let match6 = NUMBER(text, pos)
            if (a = (match6 !== null)) {
                pos += match6.end - match6.start
                children.push(match6)
            }


        }
        if (!a) {
            let match7 = STRING(text, pos)
            if (a = (match7 !== null)) {
                pos += match7.end - match7.start
                children.push(match7)
            }


        }
        if (!a) {
            let match8 = LIST(text, pos)
            if (a = (match8 !== null)) {
                pos += match8.end - match8.start
                children.push(match8)
            }


        }
        if (!a) {
            let match9 = OBJECT(text, pos)
            if (a = (match9 !== null)) {
                pos += match9.end - match9.start
                children.push(match9)
            }


        }
        if (a) {
            let c10 = 0
            let prevPos11 = pos
            let prevChildLen12 = children.length
            do {
                if (a = /* char predicate */ (/* set */ (/* char " " */ text.charCodeAt(pos) === 32 || /* char "\t" */ text.charCodeAt(pos) === 9 || /* char "\n" */ text.charCodeAt(pos) === 10))) {
                    pos += 1
                }

            } while (a && ++c10 < Infinity);
            a = c10 >= 0
            if (!a) {
                pos = prevPos11
                children.length = prevChildLen12
            }

        }

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
    if (a = /* char predicate */ (/* char "0" */ text.charCodeAt(pos) === 48)) {
        pos += 1
    }


    if (!a) {
        let c13 = 0
        let prevPos14 = pos
        let prevChildLen15 = children.length
        do {
            if (a = /* char predicate */ (/* range from "0" to "9" */ text.charCodeAt(pos) >= 48 && text.charCodeAt(pos) <= 57)) {
                pos += 1
            }

        } while (a && ++c13 < Infinity);
        a = c13 >= 1
        if (!a) {
            pos = prevPos14
            children.length = prevChildLen15
        }


    }

    if (a) {
        let c16 = 0
        let prevPos17 = pos
        let prevChildLen18 = children.length
        do {
            if (a = /* char predicate */ (/* char "." */ text.charCodeAt(pos) === 46)) {
                pos += 1
            }

            if (a) {
                let c19 = 0
                let prevPos20 = pos
                let prevChildLen21 = children.length
                do {
                    if (a = /* char predicate */ (/* range from "0" to "9" */ text.charCodeAt(pos) >= 48 && text.charCodeAt(pos) <= 57)) {
                        pos += 1
                    }

                } while (a && ++c19 < Infinity);
                a = c19 >= 1
                if (!a) {
                    pos = prevPos20
                    children.length = prevChildLen21
                }

            }

        } while (a && ++c16 < 1);
        a = c16 >= 0
        if (!a) {
            pos = prevPos17
            children.length = prevChildLen18
        }

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
    if (a = /* char predicate */ (/* char "\"" */ text.charCodeAt(pos) === 34)) {
        pos += 1
    }

    if (a) {
        let c22 = 0
        let prevPos23 = pos
        let prevChildLen24 = children.length
        do {
            if (a = /* char predicate */ (/* nset */ pos < text.length && !(/* char "\"" */ text.charCodeAt(pos) === 34))) {
                pos += 1
            }

        } while (a && ++c22 < Infinity);
        a = c22 >= 0
        if (!a) {
            pos = prevPos23
            children.length = prevChildLen24
        }
        if (a) {
            if (a = /* char predicate */ (/* char "\"" */ text.charCodeAt(pos) === 34)) {
                pos += 1
            }

        }

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
    if (a = /* char predicate */ (/* char "[" */ text.charCodeAt(pos) === 91)) {
        pos += 1
    }

    if (a) {
        let c25 = 0
        let prevPos26 = pos
        let prevChildLen27 = children.length
        do {
            let match28 = JSON(text, pos)
            if (a = (match28 !== null)) {
                pos += match28.end - match28.start
                children.push(match28)
            }

            if (a) {
                let c29 = 0
                let prevPos30 = pos
                let prevChildLen31 = children.length
                do {
                    if (a = /* char predicate */ (/* char "," */ text.charCodeAt(pos) === 44)) {
                        pos += 1
                    }

                    if (a) {
                        let match32 = JSON(text, pos)
                        if (a = (match32 !== null)) {
                            pos += match32.end - match32.start
                            children.push(match32)
                        }

                    }

                } while (a && ++c29 < Infinity);
                a = c29 >= 0
                if (!a) {
                    pos = prevPos30
                    children.length = prevChildLen31
                }

            }

        } while (a && ++c25 < 1);
        a = c25 >= 0
        if (!a) {
            pos = prevPos26
            children.length = prevChildLen27
        }
        if (a) {
            if (a = /* char predicate */ (/* char "]" */ text.charCodeAt(pos) === 93)) {
                pos += 1
            }

        }

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
    let c33 = 0
    let prevPos34 = pos
    let prevChildLen35 = children.length
    do {
        if (a = /* char predicate */ (/* set */ (/* char " " */ text.charCodeAt(pos) === 32 || /* char "\t" */ text.charCodeAt(pos) === 9 || /* char "\n" */ text.charCodeAt(pos) === 10))) {
            pos += 1
        }

    } while (a && ++c33 < Infinity);
    a = c33 >= 0
    if (!a) {
        pos = prevPos34
        children.length = prevChildLen35
    }

    if (a) {
        let match36 = STRING(text, pos)
        if (a = (match36 !== null)) {
            pos += match36.end - match36.start
            children.push(match36)
        }
        if (a) {
            let c37 = 0
            let prevPos38 = pos
            let prevChildLen39 = children.length
            do {
                if (a = /* char predicate */ (/* set */ (/* char " " */ text.charCodeAt(pos) === 32 || /* char "\t" */ text.charCodeAt(pos) === 9 || /* char "\n" */ text.charCodeAt(pos) === 10))) {
                    pos += 1
                }

            } while (a && ++c37 < Infinity);
            a = c37 >= 0
            if (!a) {
                pos = prevPos38
                children.length = prevChildLen39
            }

        }

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
    if (a = /* char predicate */ (/* char "{" */ text.charCodeAt(pos) === 123)) {
        pos += 1
    }

    if (a) {
        let c40 = 0
        let prevPos41 = pos
        let prevChildLen42 = children.length
        do {
            let match43 = KEY(text, pos)
            if (a = (match43 !== null)) {
                pos += match43.end - match43.start
                children.push(match43)
            }

            if (a) {
                if (a = /* char predicate */ (/* char ":" */ text.charCodeAt(pos) === 58)) {
                    pos += 1
                }
                if (a) {
                    let match44 = JSON(text, pos)
                    if (a = (match44 !== null)) {
                        pos += match44.end - match44.start
                        children.push(match44)
                    }
                    if (a) {
                        let c45 = 0
                        let prevPos46 = pos
                        let prevChildLen47 = children.length
                        do {
                            if (a = /* char predicate */ (/* char "," */ text.charCodeAt(pos) === 44)) {
                                pos += 1
                            }

                            if (a) {
                                let match48 = KEY(text, pos)
                                if (a = (match48 !== null)) {
                                    pos += match48.end - match48.start
                                    children.push(match48)
                                }
                                if (a) {
                                    if (a = /* char predicate */ (/* char ":" */ text.charCodeAt(pos) === 58)) {
                                        pos += 1
                                    }
                                    if (a) {
                                        let match49 = JSON(text, pos)
                                        if (a = (match49 !== null)) {
                                            pos += match49.end - match49.start
                                            children.push(match49)
                                        }

                                    }

                                }

                            }

                        } while (a && ++c45 < Infinity);
                        a = c45 >= 0
                        if (!a) {
                            pos = prevPos46
                            children.length = prevChildLen47
                        }

                    }

                }

            }

        } while (a && ++c40 < 1);
        a = c40 >= 0
        if (!a) {
            pos = prevPos41
            children.length = prevChildLen42
        }
        if (a) {
            if (a = /* char predicate */ (/* char "}" */ text.charCodeAt(pos) === 125)) {
                pos += 1
            }

        }

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
