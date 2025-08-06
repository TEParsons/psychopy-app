<script>
    import Panel from '$lib/utils/Panel.svelte';
    import Frame from '$lib/utils/Frame.svelte';

    import Ribbon from './ribbon/Ribbon.svelte';
    import RoutinesNotebook from './routines/Notebook.svelte';
    import ComponentsPanel from './components/Panel.svelte';
    import FlowPanel from './flow/Panel.svelte';
    import { current } from "./globals.svelte.js";
    import { setContext } from 'svelte';

    // reference current in context for ease of access
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