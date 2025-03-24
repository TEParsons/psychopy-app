<script>
    import Notebook from '../../utils/notebook/Notebook.svelte';
    import NotebookPage from '../../utils/notebook/Page.svelte';
    import RoutineCanvas from './Canvas.svelte';
    import StandaloneRoutineCanvas from '../dialogs/component/Panel.svelte'
    import { experiment } from '../globals.js';
    import { currentPage } from './globals.js';
    import { onMount, onDestroy } from 'svelte';
    import { StandaloneRoutine, Routine } from '../experiment.js';

</script>


<Notebook id=routine-notebook>
    {#if $experiment !== null}
    {#each Array.from($experiment.routines.keys()) as name}
    <NotebookPage id={name} title={name} activeTracker={currentPage}>
        {#if $experiment.routines.get(name) instanceof Routine}
        <RoutineCanvas routine={$experiment.routines.get(name)} />
        {:else if $experiment.routines.get(name) instanceof StandaloneRoutine}
        <StandaloneRoutineCanvas component={$experiment.routines.get(name)} />
        {/if}
    </NotebookPage>
    {/each}
    {/if}
</Notebook>