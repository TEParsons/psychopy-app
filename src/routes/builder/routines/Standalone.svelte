<script>
    import { ParamsNotebook } from "$lib/utils/paramCtrls";
    import { Button } from '$lib/utils/buttons';
    import { getContext } from 'svelte';

    let actions = getContext("actions");

    let {
        component
    } = $props();

    let notebook;
    
    function discardChanges(evt) {
        // reset temp params from component to discard any live changes
        notebook.discardChanges(evt)
    }


    function applyChanges(evt) {
        // update history
        actions.update();
        // apply temporary params to component
        notebook.applyChanges(evt)
    }
</script>

<div class=standalone-routine-canvas>
    <ParamsNotebook 
        bind:this={notebook}
        element={component}
    ></ParamsNotebook>
    <div class=standalone-routine-ctrls>
        <div class=ctrl-gap></div>
        <Button
            label=Apply
            primary
            horizontal
            onclick={applyChanges} 
        ></Button>
        <Button
            label=Discard
            horizontal
            onclick={discardChanges} 
        ></Button>
    </div>
</div>

<style>
    .standalone-routine-canvas {
        display: grid;
        gap: 1rem;
        grid-template-rows: [canvas] 1fr [ctrls] min-content;
        justify-content: center;
        padding: 1rem;
        height: 100%;
        box-sizing: border-box;
    }
    .standalone-routine-ctrls {
        display: flex;
        flex-direction: row;
        grid-row-start: ctrls;
        gap: 1rem;
        align-items: end;
    }
    .ctrl-gap {
        flex-grow: 1;
    }
</style>