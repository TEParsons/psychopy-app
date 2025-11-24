<script>
    import Panel from '$lib/utils/Panel.svelte';
    import Frame from '$lib/utils/Frame.svelte';
    import Shortcuts from '$lib/utils/Shortcuts.svelte';
    import { shortcuts } from "./callbacks.svelte";
    import Ribbon from './ribbon/Ribbon.svelte';
    import RoutinesNotebook from './routines/Notebook.svelte';
    import ComponentsPanel from './components/Panel.svelte';
    import FlowPanel from './flow/Panel.svelte';
    import { current } from "./globals.svelte.js";
    import { setContext } from 'svelte';
    import { electron } from "$lib/globals.svelte";
    import { parsePath } from "$lib/utils/files";
    import SetupPython from '../../lib/python/SetupPython.svelte';

    // reference current in context for ease of access
    setContext("current", current)
    // listen for messages from other windows
    if (electron) {
        // for opening files via another window
        electron.windows.listen("fileOpen", (evt, file) => current.experiment.file = parsePath(file))
    }
    
</script>

{#if current.experiment.file}
    <title>PsychoPy Builder: {current.experiment.file?.name}</title>
{:else}
    <title>PsychoPy Builder</title>
{/if}

<Frame 
    rows={3} 
    cols={4}
>
    {#snippet ribbon()}
    <Ribbon></Ribbon>
    {/snippet}

    <Panel 
        title=Routines 
        hspan={3} 
        vspan={2}
    >
        <RoutinesNotebook></RoutinesNotebook>
    </Panel>
    <Panel 
        title=Components 
        vspan={2}
    >
        <ComponentsPanel></ComponentsPanel>
    </Panel>
    <Panel 
        title=Flow 
        hspan={4}
    >
        <FlowPanel></FlowPanel>
    </Panel>

    <!-- this will setup keyboard shortcuts -->
    <Shortcuts
        callbacks={shortcuts}
    />
    <!-- this will setup a Python instance -->
    <SetupPython />

</Frame>

<style>
    :global(#routine-pnl) {
        grid-column-end: span 2;
        grid-row-end: span 2;
    }
    :global(#components-pnl) {
        grid-column-end: span 1;
        grid-row-end: span 2;
        background-color: var(--mantle);
    }
    :global(#flow-pnl) {
        grid-column-end: span 3;
        grid-row-end: span 1;
        background-color: var(--mantle);
    }
</style>