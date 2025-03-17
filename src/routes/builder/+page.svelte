<script>
    import { theme } from '../globals.js';
    import { pilot_mode, experiment } from './globals.js';
    import Panel from '../utils/Panel.svelte';
    import Frame from '../utils/Frame.svelte';
    import Notebook from '../utils/notebook/Notebook.svelte';
    import NotebookPage from '../utils/notebook/Page.svelte';

    import Ribbon from './Ribbon.svelte';
    import ComponentsPanel from './components/Panel.svelte';
    import RoutineCanvas from './routines/Canvas.svelte'
</script>

<Frame rows=3 cols=4>
    <Ribbon slot=ribbon/>
    <Panel id=routine-pnl title=Routines hspan=3 vspan=2>
        <Notebook id=routine-notebook>
            {#if $experiment !== null}
            {#each Array.from($experiment.routines.keys()) as name}
            <NotebookPage id={name} title={name}>
                <RoutineCanvas name={name} />
            </NotebookPage>
            {/each}
            {/if}
        </Notebook>
    </Panel>
    <Panel id=components-pnl title=Components vspan=2>
        <ComponentsPanel></ComponentsPanel>
    </Panel>
    <Panel id=flow-pnl title=Flow hspan=4>
        <button>Add Routine</button>
        <button>Add Loop</button>
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