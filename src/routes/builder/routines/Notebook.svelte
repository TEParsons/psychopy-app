<script>
    import RoutineCanvas from './Canvas.svelte';
    import StandaloneRoutineCanvas from './Standalone.svelte'
    import { experiment, currentRoutine } from '../globals.js';
    import { onMount } from 'svelte';
    import { StandaloneRoutine, Routine } from '$lib/experiment.svelte.js';
    import { Notebook, NotebookPage } from '$lib/utils/notebook';

    /** @private @type {import("svelte/store").Writable<HTMLButtonElement|undefined>} Handle of the currently active tab*/
    let activeTab;
    /** @private @type {import("svelte/store").Writable<Array<HTMLButtonElement|undefined>>} Handles of each tab element */
    let tabs;
    /** @private @type {Array<any>} Arbitrary data to associated with each tab */
    let tabData;

    onMount(() => {
        // when active page changes, set current Routine
        activeTab.subscribe((value) => {
            // get index of active tab
            let i = $tabs.indexOf(value)
            // if unchanged, do nothing
            if ($currentRoutine === tabData[i]) {
                return
            }
            // set corresponding Routine
            currentRoutine.set(tabData[i])
        })

        // when current Routine changes, change to matching page
        currentRoutine.subscribe((value) => {
            // get index of active Routine (by name)
            let tab;
            for (let i in tabData) {
                if (value && tabData[i].name === value.name) {
                    tab = $tabs[i]
                    break
                }
            }
            // if unchanged, do nothing
            if ($activeTab === tab) {
                return
            }
            // set active tab
            activeTab.set(tab)
        })
    })
</script>


<Notebook flush
    bind:activeTab={activeTab} 
    bind:tabs={tabs}
    bind:tabData={tabData}
>
    {#if $experiment !== null}
    {#each [...$experiment.routines] as [name, routine]}
    <NotebookPage 
        label={routine.name} 
        data={routine}
    >
        {#if routine instanceof Routine}
        <RoutineCanvas routine={routine} />
        {:else if $experiment.routines.get(name) instanceof StandaloneRoutine}
        <StandaloneRoutineCanvas component={routine} />
        {/if}
    </NotebookPage>
    {/each}
    {/if}
</Notebook>