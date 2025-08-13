<script>
    import RoutineCanvas from './Canvas.svelte';
    import StandaloneRoutineCanvas from './Standalone.svelte'
    import { StandaloneRoutine, Routine } from '$lib/experiment.svelte.js';
    import { Notebook, NotebookPage, AddPageButton } from '$lib/utils/notebook';
    import { getContext } from "svelte";
    import { Dialog } from '$lib/utils/dialog';
    import { ParamsNotebook } from '$lib/utils/paramCtrls';
    
    let current = getContext("current");
    let showNewRoutineDialog = $state.raw(false)
    let notebook;
</script>

<Notebook>
    {#if current.experiment !== null}
        {#each Object.entries(current.experiment.routines) as [name, routine]}
            <NotebookPage 
                bind:selected={
                    () => {return current.routine === routine},
                    (value) => {current.routine = routine}
                }
                close={() => delete current.experiment.routines[name]}
                closeTooltip="Delete {name}"
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
    <AddPageButton
        callback={(evt) => {
            // create blank Routine
            current.inserting = new Routine()
            // show dialog
            showNewRoutineDialog = true
        }}
        tooltip="New Routine..."
    ></AddPageButton>
</Notebook>

<!-- dialog for creating a new Routine -->
{#if current.inserting instanceof Routine}
    <Dialog 
        id=new-routine
        title="New Routine" 
        bind:shown={showNewRoutineDialog} 
        onopen={() => notebook.setRestorePoint()}
        buttons={{
            OK: (evt) => {
                // add to experiment
                current.inserting.exp = current.experiment
                current.experiment.routines[current.inserting.name] = current.inserting
            }, 
            CANCEL: (evt) => {
                notebook.applyRestorePoint(evt)
                // stop inserting
                current.inserting = undefined;
            },  
            HELP: "https://www.psychopy.org/builder/routines.html#routines",
        }}
    >
        <ParamsNotebook bind:this={notebook} element={current.inserting.settings}></ParamsNotebook>
    </Dialog>
{/if}