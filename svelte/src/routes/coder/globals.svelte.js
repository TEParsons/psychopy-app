export let current = $state({
    pages: [],
    tab: 0,
    newFile: evt => {
        // add new tab with blank file
        current.pages.push({
            label: "untitled.py",
            file: undefined,
            content: ""
        })
        // focus new tab
        current.tab = $state.snapshot(current.pages.length) - 1
    },
    openFile: undefined
})