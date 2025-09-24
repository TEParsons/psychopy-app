<script>
    import { setContext } from "svelte";
    import { current } from "./globals.svelte";

    import CoderRibbon from "./ribbon/Ribbon.svelte";
    import { CoderNotebook } from "./notebook";
    import Frame from "$lib/utils/Frame.svelte";
    import Panel from "$lib/utils/Panel.svelte";
    import ShellNotebook from "./shell/ShellNotebook.svelte";
    import { electron, python } from "$lib/globals.svelte";
    

    // reference current in context for ease of access
    setContext("current", current)

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
        ></Panel>
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
