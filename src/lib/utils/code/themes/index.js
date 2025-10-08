import LightPalette from "./light.json";
import DarkPalette from "./dark.json";


let themes = {};

for (let [key, base, palette] of [
    ["psychopy-light", "vs", LightPalette],
    ["psychopy-dark", "vs-dark", DarkPalette],
])
    themes[key] = {
        "base": base,
        "inherit": false,
        "rules": [
            // default
            { 'token': "", 'foreground': palette.text, 'background': palette.base },
            // data types
            { 'token': "string", 'foreground': palette.outline },
            { 'token': "number", 'foreground': palette.blue },
            // comments
            { 'token': "comment.block", 'fontStyle':"italic" },
            { 'token': "comment", 'foreground': palette.green},
            // keywords
            { 'token': "keyword", 'foreground': palette.red },
            { 'token': "type", 'foreground': palette.blue },
            // generic
            { 'token': "invalid", 'foreground': palette.red },
            { 'token': "emphasis", 'fontStyle': "italic" },
            { 'token': "strong", 'fontStyle': "bold" },
        ],
        "colors": {
            'editor.foreground': palette.text,
            'editor.background': palette.base,
            'editor.selectionBackground': palette.crust,
            'editor.inactiveSelection': palette.mantle,
            'editor.referenceHighlight': palette.red,
            'editorCursor.foreground': palette.red,
            'editorWhitespace.foreground': palette.mantle,
            'editorGutter.background': palette.mantle,
            'editorLineNumber.foreground': palette.outline,
            'editorLineNumber.activeForeground': palette.text,
            'editor.lineHighlightBackground': palette.crust,
        }
    }

export default themes