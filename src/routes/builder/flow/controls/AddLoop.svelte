<script>
    import { LoopInitiator } from '$lib/experiment.svelte.js';
    import Dialog from '$lib/utils/dialog/Dialog.svelte';
    import { ParamsNotebook } from '$lib/utils/paramCtrls/index.js';
    import { Button } from '$lib/utils/buttons';
    import { getContext } from "svelte";
    
    let current = getContext("current");
    let actions = getContext("actions");    
    let notebook;

    let element = $state(
        LoopInitiator.fromTemplate("TrialHandler")
    )

    function insertLoopInitiator(evt) {
        // apply temporary params to loop
        notebook.applyChanges()
        // update history
        actions.update()
        // add to experiment
        element.exp = current.experiment
        current.experiment.loops[element.name] = element
        // prepare to insert the new Routine into the Flow
        current.inserting = element;
    }

    function discardChanges(evt) {
        // reset temp params from component to discard any live changes
        notebook.discardChanges()
    }

    let showDialog = $state(false)

</script>


<!-- button to open add Routine menu -->
<Button 
    label="Add Loop"
    icon="/icons/light/btn-loop.svg"
    tooltip="Add a loop to the experiment flow"
    horizontal 
    onclick={() => {
        // create blank Loop
        element = LoopInitiator.fromTemplate("TrialHandler")
        // show dialog
        showDialog = true
    }}
></Button>
<!-- dialog for creating a new Routine -->
<Dialog 
    id=new-loop 
    title="New Loop" 
    bind:shown={showDialog} 
    buttons={{
        OK: insertLoopInitiator, 
        CANCEL: discardChanges, 
    }}
>
    <ParamsNotebook 
        element={element} 
        bind:this={notebook}
    />
</Dialog>
