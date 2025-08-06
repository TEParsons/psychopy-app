<script>
    import { LoopInitiator } from '$lib/experiment.svelte.js';
    import { ParamsNotebook } from '$lib/utils/paramCtrls/index.js';
    import { Button } from '$lib/utils/buttons';
    import { getContext } from "svelte";
    import Dialog from "$lib/utils/dialog/Dialog.svelte";
    
    let current = getContext("current");
    let notebook;

    let element = $state(
        new LoopInitiator("TrialHandler")
    )

    function insertLoopInitiator(evt) {
        // apply temporary params to loop
        notebook.applyChanges()
        // update history
        current.experiment.history.update()
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
        current.inserting = new LoopInitiator("TrialHandler")
        current.inserting.exp = current.experiment;
        // show dialog
        showDialog = true
    }}
></Button>
<!-- dialog for creating a new Loop -->
{#if current.inserting instanceof LoopInitiator}
<Dialog 
    id=new-loop 
    title="New loop"
    bind:shown={showDialog} 
    buttons={{
        OK: (evt) => {
            // apply changes to params
            notebook.applyChanges(evt)
            // add loop to experiment
            current.experiment.loops[current.inserting.name] = current.inserting
        }, 
        CANCEL: (evt) => {
            // discard changes to params
            notebook.discardChanges(evt)
            // stop inserting
            current.inserting = undefined;
        }, 
        HELP: "https://www.psychopy.org/builder/flow.html#loops",
    }}
>
    <ParamsNotebook bind:this={notebook} element={element}></ParamsNotebook>
</Dialog>
{/if}
