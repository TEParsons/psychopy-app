<script>
    import { theme } from "$lib/globals.svelte.js";
    import Dialog from '$lib/utils/dialog/Dialog.svelte';
    import { Menu, MenuItem } from "$lib/utils/menu"
    import { ParamsNotebook } from '$lib/utils/paramCtrls/index.js';
    import { FlowLoop } from "$lib/experiment.svelte.js";
    import Loop from "./Loop.svelte"
    import RoutineNode from './Routine.svelte';
    import EntryPoint from './EntryPoint.svelte'
    import { current, actions } from "../globals.svelte.js";

    let {
        element=undefined
    } = $props()

    let showDialog = $state(false);
    let notebook;

    let showContextMenu = $state(false);
    let contextMenuPos = $state({
        x: undefined,
        y: undefined
    });

    function removeLoop(evt) {
        // update history
        actions.update();
        // remove from experiment
        if (element.name in current.experiment.loops) {
            delete current.experiment.loops[element.name]
        }
        // remove from flow
        if (current.experiment.flow.flat.includes(element.initiator)) {
            current.experiment.flow.flat.splice(
                current.experiment.flow.flat.indexOf(element.initiator), 
                1
            )
        }
        if (current.experiment.flow.flat.includes(element.terminator)) {
            current.experiment.flow.flat.splice(
                current.experiment.flow.flat.indexOf(element.terminator), 
                1
            )
        }

        console.log(
            $state.snapshot(current.experiment.flow.flat)
        )
    }
</script>

{#if element.complete}
    <EntryPoint index={element.initiator.index}></EntryPoint>
{/if}
<div class=loop class:incomplete={!element.complete}>
    {#if element}
        <button
            class=loop-name
            onclick={(evt) => showDialog = true}
            oncontextmenu={(evt) => {
                evt.preventDefault();
                // show menu
                showContextMenu = true;
                // set its position to the mouse pos
                contextMenuPos.x = evt.pageX;
                contextMenuPos.y = evt.pageY;
            }}
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

<!-- menu to open when right clicked on -->
<Menu 
    bind:shown={showContextMenu} 
    bind:position={contextMenuPos}
>
    <MenuItem 
        icon="/icons/{theme}/btn-delete.svg"
        label="Delete Loop"
        onclick={removeLoop}
    />
</Menu>

<!-- dialog to open when clicked on -->
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