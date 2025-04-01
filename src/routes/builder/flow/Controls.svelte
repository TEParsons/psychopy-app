<script>
    import { Routine, LoopInitiator, LoopTerminator, sortParams, unsortParams } from '$lib/experiment';
    import { inserting } from './globals.js';
    import { experiment } from '../globals.js';
    import { writable } from 'svelte/store';
    import Dialog from '../../utils/dialog/Dialog.svelte';
    import Panel from '../dialogs/component/Panel.svelte';
    import { updateHistory } from '../history.js';

    let dialog;
    let newRoutine = writable(new Routine())
    let tempParams = writable(sortParams($newRoutine.settings.copyParams()))

    function discardChanges(evt) {
        // reset temp params from component to discard any live changes
        tempParams.set(
            sortParams($newRoutine.settings.copyParams())
        )
    }

    function insertRoutine(evt) {
        // update history
        updateHistory()
        // apply temporary params to Routine settings
        $newRoutine.settings.params = unsortParams($tempParams)
        // add to experiment
        $newRoutine.exp = $experiment
        $experiment.routines.set($newRoutine.name, $newRoutine)
        // prepare to insert the new Routine into the Flow
        inserting.set($newRoutine)
    }

    function createRoutine() {
        // create blank Routine
        newRoutine.set(new Routine())
        
        // show dialog
        dialog.showModal()
    }

</script>

<div class=flow-buttons>
    <!-- New Routine button & dialog -->
    <button class=horizontal id=add-routine on:click={createRoutine}>
        <img src="/icons/light/btn-routine.svg" alt="" />
        <label for=add-routine>Add Routine</label>
    </button>
    <Dialog 
        id=new-routine 
        title="New Routine" 
        bind:handle={dialog} 
        buttons={{
            OK: insertRoutine, 
            CANCEL: discardChanges, 
        }}
    >
        <Panel component={$newRoutine.settings} tempParams={tempParams} />
    </Dialog>
    <!-- New Loop button & dialog -->
    <button class=horizontal id=add-loop>
        <img src="/icons/light/btn-loop.svg" alt="" />
        <label for=add-loop>Add Loop</label>
    </button>
</div>

<style>
    .flow-buttons {
        padding: 1rem;
        display: grid;
        grid-auto-flow: row;
    }
    button {
        background-color: var(--crust);
    }
</style>