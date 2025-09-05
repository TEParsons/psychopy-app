<script>
    import { setContext } from "svelte";
    import { current } from "./globals.svelte";

    import CoderRibbon from "./ribbon/Ribbon.svelte";
    import { CoderNotebook } from "./notebook";
    import Frame from "$lib/utils/Frame.svelte";
    import Panel from "$lib/utils/Panel.svelte";
    

    // reference current in context for ease of access
    setContext("current", current)

</script>

<Frame
    rows={3} 
    cols={5}
>
    {#snippet ribbon()}
        <CoderRibbon />
    {/snippet}
    <Panel
        title=Files
        hspan={1}
        vspan={2}
    ></Panel>
    <Panel
        title=Editor 
        hspan={3} 
        vspan={2}
    >
        <CoderNotebook />
    </Panel>
    <Panel
        title=Outline
        hspan={1}
        vspan={2}
    ></Panel>
    <Panel
        title=Console
        hspan={5}
        vspan={1}
    >
        
    </Panel>
</Frame>
