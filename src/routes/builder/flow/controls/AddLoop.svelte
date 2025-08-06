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
    onopen={() => notebook.setRestorePoint()}
    buttons={{
        OK: (evt) => {
            // add to experiment
            current.experiment.loops[current.inserting.name] = current.inserting
        }, 
        CANCEL: (evt) => {
            notebook.applyRestorePoint(evt)
            // stop inserting
            current.inserting = undefined;
        }, 
        HELP: "https://www.psychopy.org/builder/flow.html#loops",
    }}
>
    <ParamsNotebook bind:this={notebook} element={element}></ParamsNotebook>
</Dialog>
{/if}
