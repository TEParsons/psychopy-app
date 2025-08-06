<script>
    import { Routine, LoopInitiator, LoopTerminator } from '$lib/experiment.svelte.js';
    import Menu from '$lib/utils/menu/Menu.svelte';
    import MenuItem from '$lib/utils/menu/Item.svelte';
    import Dialog from '$lib/utils/dialog/Dialog.svelte';
    import { ParamsNotebook } from '$lib/utils/paramCtrls/index.js';
    import { Button } from '$lib/utils/buttons';
    import { getContext } from "svelte";
    
    let current = getContext("current");
        
    let notebook;

    let showNewRoutineDialog = $state(false)
    let showMenu = $state(false)

</script>

<div
    class=container
>
    <!-- button to open add Routine menu -->
    <Button 
        label="Add Routine"
        icon="/icons/light/btn-routine.svg"
        tooltip="Add a Routine to the experiment flow"
        onclick={() => {
            // open the "add routine" menu
            showMenu = true
        }}
        horizontal
    ></Button>
    
    <!-- menu for adding a Routine -->
    <Menu 
        bind:shown={showMenu}
    >
        <MenuItem 
            label="New Routine..."
            onclick={() => {
                // create blank Routine
                current.inserting = new Routine()
                // show dialog
                showNewRoutineDialog = true
            }}
        />
        {#each Object.entries(current.experiment.routines) as [name, routine]}
        <MenuItem 
            label={name}
            onclick={() => {
                // set this Routine as the one to insert
                current.inserting = routine
            }}
        />
        {/each}
    </Menu>
</div>

<!-- dialog for creating a new Routine -->
{#if current.inserting instanceof Routine}
<Dialog 
    id=new-routine
    title="New Routine" 
    bind:shown={showNewRoutineDialog} 
    buttons={{
        OK: (evt) => {
            // apply changes
            notebook.applyChanges()
            // add to experiment
            current.inserting.exp = current.experiment
            current.experiment.routines[current.inserting.name] = current.inserting
        }, 
        CANCEL: (evt) => {
            // discard changes to params
            notebook.discardChanges(evt)
            // stop inserting
            current.inserting = undefined;
        }, 
        HELP: "https://www.psychopy.org/builder/routines.html#routines",
    }}
>
    <ParamsNotebook bind:this={notebook} element={current.inserting.settings}></ParamsNotebook>
</Dialog>
{/if}


<style>
    .container {
        position: relative;
    }
</style>