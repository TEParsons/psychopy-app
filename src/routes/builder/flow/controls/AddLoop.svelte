<script>
    import { writable } from 'svelte/store';

    import { Routine, LoopInitiator, LoopTerminator, sortParams, unsortParams } from '$lib/experiment';
    import { updateHistory } from '../../history.js';
    import Menu from '$lib/utils/menu/Menu.svelte';
    import MenuItem from '$lib/utils/menu/Item.svelte';
    import Dialog from '$lib/utils/dialog/Dialog.svelte';
    import ParamsPanel from '../../../dialogs/component/Panel.svelte';

    import { experiment } from '../../globals.js';
    import { inserting } from '../globals.js';
    
    let dialog;
    let menu;
    
    let element = writable(LoopInitiator.fromTemplate("TrialHandler"));
    let tempParams = writable(sortParams($element.copyParams()));

    function insertLoopInitiator(evt) {
        // update history
        updateHistory()
        // apply temporary params to loop
        $element.params = unsortParams($tempParams)
        // add to experiment
        $element.exp = $experiment
        $experiment.routines.set($element.name, $element)
        // prepare to insert the new Routine into the Flow
        inserting.set($element)
    }

    function discardChanges(evt) {
        // reset temp params from component to discard any live changes
        tempParams.set(
            sortParams($element.copyParams())
        )
    }

</script>


<!-- button to open add Routine menu -->
<button class=horizontal id=add-loop on:click={() => {
    // create blank Loop
    element.set(LoopInitiator.fromTemplate("TrialHandler"))
    // show dialog
    dialog.showModal()
}}>
    <img src="/icons/light/btn-loop.svg" alt="" />
    <label for=add-loop>Add Loop</label>
</button>

<!-- dialog for creating a new Routine -->
<Dialog 
    id=new-loop 
    title="New Loop" 
    bind:handle={dialog} 
    buttons={{
        OK: insertLoopInitiator, 
        CANCEL: discardChanges, 
    }}
>
    <ParamsPanel component={$element} tempParams={tempParams} />
</Dialog>

<style>
    button {
        background-color: var(--crust);
    }
</style>