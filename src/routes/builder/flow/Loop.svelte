<script>
    import { theme } from "$lib/globals.svelte.js";
    import Dialog from '$lib/utils/dialog/Dialog.svelte';
    import { ParamsNotebook } from '$lib/utils/paramCtrls/index.js';
    import { FlowLoop } from "$lib/experiment.svelte.js";
    import Loop from "./Loop.svelte"
    import RoutineNode from './Routine.svelte';
    import EntryPoint from './EntryPoint.svelte'

    let {
        element=undefined
    } = $props()

    let showDialog = $state(false);
    let notebook;
</script>

{#if element.complete}
    <EntryPoint index={element.initiator.index}></EntryPoint>
{/if}
<div class=loop class:incomplete={!element.complete}>
    {#if element}
        <button
            class=loop-name
            onclick={(evt) => showDialog = true}
        >
            {element.name}
        </button>
        
    {/if}
    <img class=loop-arrow src="/icons/{theme}/sym-arrow-up.svg" alt="<"/>
    {#if element}
        {#each element.routines as rt}
            {#if rt instanceof FlowLoop}
                <Loop element={rt}></Loop>
            {:else}
                <RoutineNode element={rt}></RoutineNode>
            {/if}
        {/each}
    {/if}
    {#if element.complete}
        <EntryPoint index={element.terminator.index}></EntryPoint>
    {/if}
</div>

<Dialog 
    id="loop-{element.name}" 
    title={element.name}
    bind:shown={showDialog} 
    buttons={{
        OK: () => notebook.applyChanges(), 
        APPLY: () => notebook.applyChanges(), 
        CANCEL: () => notebook.discardChanges(), 
    }}
>
    <ParamsNotebook 
        element={element} 
        bind:this={notebook}
    />
</Dialog>

<style>
    .loop {
        position: relative;
        display: flex;
        flex-direction: row;
        align-items: start;
        gap: 1rem;
        border: 1px solid var(--outline);
        border-radius: 1rem;
        padding: 2rem 1rem;
        padding-top: 0;
    }
    .loop .loop-name {
        position: absolute;
        line-height: 1rem;
        bottom: 0;
        left: 50%;
        transform: translate(-50%, 50%);
        padding: .5rem 1rem;
        background-color: var(--outline);
        color: var(--text-on-outline);
        border-radius: 1rem;
        box-shadow: 
            inset -1px -1px 2px rgba(0, 0, 0, 0.05)
        ;
    }
    .loop .loop-name:hover {
        box-shadow: 
            inset 1px 1px 10px rgba(0, 0, 0, 0.25)
        ;
    }
    .loop-arrow {
        width: .75rem;
        position: absolute;
        right: 100%;
        top: 50%;
        transform: translateX(calc(50% - .5px)) translateY(-50%);
    }

    .loop.incomplete {
        border-right: none;
        border-top: none;
        border-bottom: none;
        padding: 4rem 1rem;
    }
    .loop.incomplete .loop-name {
        left: 0;
        bottom: 50%;
    }
    .loop.incomplete .loop-arrow {
        top: calc(50% - 2rem);
    }
</style>