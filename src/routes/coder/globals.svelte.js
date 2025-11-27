import { Script } from "$lib/experiment/script.svelte"

export let current = $state({
    pages: [],
    tab: 0,
    openFile: async file => {
        // if file not already open, open it
        if (!current.pages.some(
            item => item.file.file === file.file
        )) {
            current.pages.push(
                new Script(file)
            )
        }
        // focus
        current.tab = current.pages.findIndex(item => item.file.file === file.file)
        // load content from file
        await current.pages[current.tab].fromFile(file)
    }
})