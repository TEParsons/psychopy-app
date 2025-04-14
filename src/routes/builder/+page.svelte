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

    experiment.subscribe((value) => {
        if (browser) {
            if (value) {
                document.title = "PsychoPy Builder: " + value.filename;
            } else {
                document.title = "PsychoPy Builder";
            }
        }
    })
</script>

<Frame rows=3 cols=4>
    <Ribbon slot=ribbon></Ribbon>

    <Panel id=routine-pnl title=Routines hspan=3 vspan=2>
        <RoutinesNotebook></RoutinesNotebook>
    </Panel>
    <Panel id=components-pnl title=Components vspan=2>
        <ComponentsPanel></ComponentsPanel>
    </Panel>
    <Panel id=flow-pnl title=Flow hspan=4>
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
    }
    :global(#flow-pnl) {
        grid-column-end: span 3;
        grid-row-end: span 1;
    }
</style>