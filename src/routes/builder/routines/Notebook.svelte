<script>
    import Notebook from '$lib/utils/notebook/Notebook.svelte';
    import NotebookPage from '$lib/utils/notebook/Page.svelte';
    import RoutineCanvas from './Canvas.svelte';
    import StandaloneRoutineCanvas from './Standalone.svelte'
    import { experiment, currentRoutine } from '../globals.js';
    import { currentPage } from './globals.js';
    import { onMount, onDestroy } from 'svelte';
    import { StandaloneRoutine, Routine } from '$lib/experiment.js';

    // when the page changes, update the current Routine
    currentPage.subscribe((value) => {
        currentRoutine.set($experiment.routines.get(value))
    })
    // when the experiment changes, get the current Routine again
    experiment.subscribe((value) => {
        currentRoutine.set(value.routines.get($currentPage))
    })

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