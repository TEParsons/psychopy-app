<script>
    import { writable } from 'svelte/store';

    import { Routine, LoopInitiator, LoopTerminator, sortParams, unsortParams } from '$lib/experiment.svelte.js';
    import { updateHistory } from '../../history.js';
    import Menu from '$lib/utils/menu/Menu.svelte';
    import MenuItem from '$lib/utils/menu/Item.svelte';
    import Dialog from '$lib/utils/dialog/Dialog.svelte';

    import { experiment } from '../../globals.js';
    import { inserting } from '../globals.js';
    import { ParamsNotebook } from '$lib/utils/paramCtrls/index.js';
    import { Button } from '$lib/utils/buttons';
    
    let dialog;
    let notebook;
    let menu;
    
    let element = writable(LoopInitiator.fromTemplate("TrialHandler"));

    function insertLoopInitiator(evt) {
        // update history
        updateHistory()
        // apply temporary params to loop
        notebook.applyChanges()
        // add to experiment
        $element.exp = $experiment
        $experiment.routines.set($element.name, $element)
        // prepare to insert the new Routine into the Flow
        inserting.set($element)
    }

    function discardChanges(evt) {
        // reset temp params from component to discard any live changes
        notebook.discardChanges()
    }

</script>


<!-- button to open add Routine menu -->
<Button 
    label="Add Loop"
    icon="/icons/light/btn-loop.svg"
    tooltip="Add a loop to the experiment flow"
    horizontal 
    onclick={() => {
        // create blank Loop
        element.set(LoopInitiator.fromTemplate("TrialHandler"))
        // show dialog
        dialog.showModal()
    }}
></Button>

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
    <ParamsNotebook element={$element} bind:this={notebook}/>
</Dialog>

<style>
    button {
        background-color: var(--crust);
    }
</style>