<script>
    import { ParamsNotebook } from "$lib/utils/paramCtrls";
    import { Button } from '$lib/utils/buttons';
    import { onMount } from "svelte";

    let {
        component
    } = $props();

    onMount(() => notebook.setRestorePoint())

    let notebook;

    let valid = $state({})

    let applyDisabled = $derived(
        Object.values(valid).some(
            (val) => !val.state
        )
    )
</script>

<div class=standalone-routine-canvas>
    <ParamsNotebook 
        bind:this={notebook}
        bind:valid={valid}
        element={component}
    ></ParamsNotebook>
    <div class=standalone-routine-ctrls>
        <div class=ctrl-gap></div>
        <Button
            label=Apply
            primary
            horizontal
            disabled={applyDisabled}
            onclick={(evt) => notebook.setRestorePoint()} 
        ></Button>
        <Button
            label=Discard
            horizontal
            onclick={(evt) => notebook.applyRestorePoint()} 
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