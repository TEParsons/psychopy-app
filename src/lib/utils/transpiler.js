export function js2py(val) {
    // substitute JS style booleans
    if (val === true || val === "true") {
        val = "True"
    }
    if (val === false || val === "false") {
        val = "False"
    }
    // recursively jsonise a dict
    if (val instanceof Object) {
        val = JSON.stringify(val)
    }

    return val
}

export function py2js(val) {
    // substitute JS style booleans
    if (val === "True") {
        val = true
    }
    if (val === "False") {
        val = false
    }
    // recursively parse a JSON
    if (String(val).startsWith("{") && String(val).endsWith("}")) {
        val = JSON.parse(
            sanitizeJSON(val)
        )
        
    }

    return val
}

export function sanitizeJSON(val) {
    return String(val).replaceAll(
    // identify key:value pairs with single quotes
    /'(.*?)': *'(.*?)'/g, 
    (_, key, val) => {
        // escape any double quotes inside the key and value
        key = key.replaceAll(
            /(?<!\\)"/g,
            "\\\""
        )
        val = val.replaceAll(
            /(?<!\\)"/g,
            "\\\""
        )
        // return the key:value pair with double quotes (i.e. JSON friendly)
        return `"${key}": "${val}"`
    }
)
}