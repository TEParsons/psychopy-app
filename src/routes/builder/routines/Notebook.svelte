<script>
    import RoutineCanvas from './Canvas.svelte';
    import StandaloneRoutineCanvas from './Standalone.svelte'
    import { experiment, currentRoutine } from '../globals.js';
    import { currentPage } from './globals.js';
    import { onMount, onDestroy } from 'svelte';
    import { StandaloneRoutine, Routine } from '$lib/experiment.js';
    import { Notebook, NotebookPage } from '$lib/utils/notebook';

    let activeTab;
    let tabs;

    onMount(() => {
        // link current page to overall active Routine
        activeTab.subscribe((value) => {
            currentRoutine.set(
                $experiment.routines.get(value.textContent.trim())
            )
        })
        // // link overall active Routine to current page
        // currentRoutine.subscribe((value) => {
        //     if (value === undefined) {
        //         activeTab.set(undefined)
        //         return
        //     }
        //     let matchingTab;
        //     for (let tab of $tabs) {
        //         if (tab.textContent.trim() === value.name) {
        //             activeTab.set(tab)
        //         }
        //     }
        // })
        // when the experiment changes, get the current Routine again
        experiment.subscribe((value) => {
            console.log($currentRoutine)
            currentRoutine.set(
                value.routines.get(
                    $activeTab.textContent.trim()
                )
            )
        })
    })
</script>


<Notebook 
    bind:activeTab={activeTab} 
    bind:tabs={tabs}
    flush
>
    {#if $experiment !== null}
    {#each [...$experiment.routines] as [name, routine]}
    <NotebookPage title={routine.name}>
        {#if routine instanceof Routine}
        <RoutineCanvas routine={routine} />
        {:else if $experiment.routines.get(name) instanceof StandaloneRoutine}
        <StandaloneRoutineCanvas component={routine} />
        {/if}
    </NotebookPage>
    {/each}
    {/if}
</Notebook>