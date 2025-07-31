<script>
    import { ParamsNotebook } from "$lib/utils/paramCtrls";
    import { Button } from '$lib/utils/buttons';
    import { getContext } from 'svelte';

    export let component;

    let notebook;
    
    function discardChanges(evt) {
        // reset temp params from component to discard any live changes
        notebook.discardChanges(evt)
    }

    let history = getContext("history")

    function applyChanges(evt) {
        // update history
        history.update();
        // apply temporary params to component
        notebook.applyChanges(evt)
    }
</script>

<div class=standalone-routine-canvas>
    <ParamsNotebook 
        bind:this={notebook}
        element={component}
    ></ParamsNotebook>
    <Button
        label=Apply
        horizontal
        onclick={applyChanges} 
    ></Button>
</div>