<script>
    import Notebook from '../../utils/notebook/Notebook.svelte';
    import NotebookPage from '../../utils/notebook/Page.svelte';
    import RoutineCanvas from './Canvas.svelte';
    import StandaloneRoutineCanvas from './Standalone.svelte'
    import { experiment } from '../globals.js';
    import { currentPage } from './globals.js';
    import { onMount, onDestroy } from 'svelte';
    import { StandaloneRoutine, Routine } from '../experiment.js';

</script>


<Notebook id=routine-notebook flush>
    {#if $experiment !== null}
    {#each [...$experiment.routines] as [name, routine]}
    <NotebookPage id={name} title={routine.name} activeTracker={currentPage}>
        {#if routine instanceof Routine}
        <RoutineCanvas routine={routine} />
        {:else if $experiment.routines.get(name) instanceof StandaloneRoutine}
        <StandaloneRoutineCanvas component={routine} />
        {/if}
    </NotebookPage>
    {/each}
    {/if}
</Notebook>