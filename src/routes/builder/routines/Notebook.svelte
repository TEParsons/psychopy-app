<script>
    import RoutineCanvas from './Canvas.svelte';
    import StandaloneRoutineCanvas from './Standalone.svelte'
    import { StandaloneRoutine, Routine } from '$lib/experiment.svelte.js';
    import { Notebook, NotebookPage } from '$lib/utils/notebook';
    import { getContext } from "svelte";
    
    let current = getContext("current");

</script>


<Notebook 
    flush
>
    {#if current.experiment !== null}
    {#each Object.entries(current.experiment.routines) as [name, routine]}
    <NotebookPage 
        bind:selected={
            () => {return current.routine === routine},
            (value) => {current.routine = routine}
        }
        label={routine.name} 
        data={routine}
    >
        {#if routine instanceof Routine}
        <RoutineCanvas routine={routine} />
        {:else if current.experiment.routines[name] instanceof StandaloneRoutine}
        <StandaloneRoutineCanvas component={routine} />
        {/if}
    </NotebookPage>
    {/each}
    {/if}
</Notebook>