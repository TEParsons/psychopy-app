<script>
    import { Routine, LoopInitiator, LoopTerminator } from '$lib/experiment.svelte.js';
    import { updateHistory } from '../../history.js';
    import Menu from '$lib/utils/menu/Menu.svelte';
    import MenuItem from '$lib/utils/menu/Item.svelte';
    import Dialog from '$lib/utils/dialog/Dialog.svelte';
    import { ParamsNotebook } from '$lib/utils/paramCtrls/index.js';
    import { Button } from '$lib/utils/buttons';
    import { getContext } from 'svelte';
    
    let dialog;
    let notebook;
    let menu;
    
    let current = getContext("current")

    function insertRoutine(evt) {
        // update history
        updateHistory()
        // add to experiment
        current.inserting.exp = current.experiment
        current.experiment.routines.set(current.inserting.name, current.inserting)
    }

    let showNewRoutineDialog = $state(false)

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
            menu.setOpen(true)
        }}
        horizontal
    ></Button>
    
    <!-- menu for adding a Routine -->
    <Menu 
        bind:this={menu}
    >
        <MenuItem 
            label="New Routine..."
            action={() => {
                // create blank Routine
                current.inserting = new Routine()
                // show dialog
                showNewRoutineDialog = true
            }}
        />
        {#each [...current.experiment.routines] as [name, routine]}
        <MenuItem 
            label={name}
            action={() => {
                // set this Routine as the one to insert
                current.inserting = routine
            }}
        />
        {/each}
    </Menu>
</div>

<!-- dialog for creating a new Routine -->

<Dialog 
    id=new-routine 
    title="New Routine" 
    bind:shown={showNewRoutineDialog} 
    buttons={{
        OK: insertRoutine, 
        CANCEL: () => current.inserting = undefined, 
    }}
>
    {#if current.inserting}
        <ParamsNotebook element={current.inserting.settings} bind:this={notebook} />
    {/if}
</Dialog>


<style>
    .container {
        position: relative;
    }
</style>