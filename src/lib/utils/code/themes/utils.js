
const colors = {
    red: "F2545B",
    purple: "C3BEF7",
    blue: "02A9EA",
    green: "6CCC74",
    yellow: "F1D302",
    orange: "EC9703",
    base: "FFFFFF",
    mantle: "F2F2F2",
    crust: "E4E4E4",
    overlay: "D6D6D6",
    outline: "66666E"
}

// example themes: https://github.com/microsoft/vscode/blob/913e891c34f8b4fe2c0767ec9f8bfd3b9dbe30d9/src/vs/editor/standalone/common/themes.ts#L9
// registry of ui tags: https://github.com/microsoft/vscode/blob/913e891c34f8b4fe2c0767ec9f8bfd3b9dbe30d9/src/vs/platform/theme/common/colorRegistry.ts


/** Substitute `--color` values in JSON for corresponding theme colors */
export function sanitize(theme) {
    // iterate through rules
    for (let rule of theme.rules) {
        // substitute vars
        if (rule.foreground && rule.foreground.startsWith("--")) {
            rule.foreground = colors[rule.foreground.replace("--", "")]
        }
        if (rule.background && rule.background.startsWith("--")) {
            rule.background = colors[rule.background.replace("--", "")]
        } 
    }

    return theme
}