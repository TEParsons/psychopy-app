<script>
    import Panel from '$lib/utils/Panel.svelte';
    import Frame from '$lib/utils/Frame.svelte';

    import Ribbon from './Ribbon.svelte';
    import RoutinesNotebook from './routines/Notebook.svelte';
    import ComponentsPanel from './components/Panel.svelte';
    import FlowPanel from './flow/Panel.svelte';
    import { setContext } from "svelte";
    import { Experiment } from "$lib/experiment.svelte.js";

    let current = $state({
        file: undefined,
        experiment: new Experiment("untitled.psyexp"),
        routine: undefined,
        moving: undefined,
        inserting: undefined
    })
    setContext("current", current)
    let history = $state({
        past: [],
        future: [],
        update: () => {
            // store experiment state
            history.past.push(
                current.experiment.toJSON()
            )
            // limit to 16 items to save memory
            while (history.past.length >= 16) {
                delete history.past[0]
                history.past = history.past.slice(1);
            }
            // clear future
            history.future = []
        },
        undo: () => {
            // do nothing if we have no past
            if (!history.past) {
                return
            }
            // store present as future
            history.future.push(
                current.experiment.toJSON()
            )
            // restore last state
            current.experiment = Experiment.fromJSON(
                history.past.pop()
            )
        },
        redo: () => {
            // do nothin if we have no future
            if (!history.future) {
                return
            }
            // restore next state
            current.experiment = Experiment.fromJSON(
                history.future.shift()
            )
        },
        clear: () => {
            history.past = []
            history.future = []
        }
    })
    setContext("history", history)
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