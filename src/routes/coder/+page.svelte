<script>
    import { setContext } from "svelte";
    import { current } from "./globals.svelte";

    import CoderRibbon from "./ribbon/Ribbon.svelte";
    import { CoderNotebook } from "./notebook";
    import Frame from "$lib/utils/Frame.svelte";
    import Panel from "$lib/utils/Panel.svelte";
    import ShellNotebook from "./shell/ShellNotebook.svelte";
    import FileExplorer from "./files/FileExplorer.svelte";
    import { electron, python } from "$lib/globals.svelte";
    import path from "path-browserify";
    

    // reference current in context for ease of access
    setContext("current", current)

    // map openFile function now that electron exists
    current.openFile = async (file, label=undefined) => {
        // if no label, use file
        if (label === undefined) {
            label = path.basename(file)
        }
        // if file already open, navigate to it
        if (current.pages.some(
            item => item.file === file
        )) {
            
        } else {
            // otherwise, add a new page
            current.pages.push({
                label: label,
                file: file,
                content: await electron.files.load(file)
            })
        }
        // focus
        current.tab = current.pages.findIndex(item => item.file === file)
    }

    // listen for messages from other windows
    if (electron) {
        // for opening files via another window
        electron.windows.listen("fileOpen", (evt, file) => current.openFile(file))
    }

</script>

<title>PsychoPy Coder</title>
<Frame
    rows={3} 
    cols={5}
>
    {#snippet ribbon()}
        <CoderRibbon />
    {/snippet}
    {#if electron}
        <Panel
            title=Files
            hspan={1}
            vspan={2}
        >
            <!-- <FileExplorer /> -->
        </Panel>
    {/if}
    <Panel
        title=Editor 
        hspan={electron ? 3 : 4} 
        vspan={python ? 2 : 3}
    >
        <CoderNotebook />
    </Panel>
    <Panel
        title=Outline
        hspan={1}
        vspan={python ? 2 : 3}
    ></Panel>
    {#if python}
        <Panel
            title=Console
            hspan={5}
            vspan={1}
        >
            <ShellNotebook />
        </Panel>
    {/if}
</Frame>
