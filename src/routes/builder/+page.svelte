<script>
    import { theme } from "$lib/globals.js";
    import { experiment } from './globals.js';
    import Panel from '$lib/utils/Panel.svelte';
    import Frame from '$lib/utils/Frame.svelte';

    import Ribbon from './Ribbon.svelte';
    import RoutinesNotebook from './routines/Notebook.svelte';
    import ComponentsPanel from './components/Panel.svelte';
    import FlowPanel from './flow/Panel.svelte';
    import { browser } from '$app/environment';
    import { onMount, setContext } from "svelte";
    import { Experiment } from "$lib/experiment.svelte.js";

    let current = $state({
        file: undefined,
        experiment: new Experiment("untitled.psyexp"),
        routine: undefined,
        moving: undefined,
        inserting: undefined
    })
    setContext("current", current)
</script>

<title>PsychoPy Builder: {current.experiment.filename}</title>
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