<script>
    export let element;
    import EntryPoint from './EntryPoint.svelte'   
    import { Menu, MenuItem, SubMenu } from '$lib/utils/menu';
    import { theme } from '$lib/globals';
    import { writable } from 'svelte/store';
    import { updateHistory } from '../history';
    import Tooltip from '$lib/utils/tooltip/Tooltip.svelte';
    import { getContext } from "svelte";

    let current = getContext("current")

    let menu;
    let menuPos = writable({
        position: "absolute", 
        left: "0px",
        top: "0px", 
    });

    function showContextMenu(evt) {
        // set pos to click location
        menuPos.set({
            position: "fixed", 
            left: evt.pageX + "px", 
            top: evt.pageY + "px",
        })
        // show menu
        menu.setOpen(true);
    }

    function removeRoutine(evt) {
        // update history
        updateHistory();
        // move dragged routine to new position in the flow
        current.experiment.flow.removeElement(element.index)
    }

</script>

<EntryPoint index={element.index}></EntryPoint>
<div 
    class=routine 
    id=flow-{element.name} 
    draggable=true
    on:dragstart={() => current.moving = element} 
    on:dragend={() => current.moving = undefined} 
    on:click={() => current.routine = element}
    class:active={current.routine ? current.routine.name === element.name : false}
    role="none"
    on:contextmenu|preventDefault={showContextMenu}
>
{#if element.settings && "desc" in element.settings.params && element.settings.params['desc'].val}
<Tooltip>
    {element.settings.params.get('desc').val}
</Tooltip>
{/if}
{element.name}
</div>
<Menu 
    bind:this={menu} 
>
    <MenuItem 
        icon="/icons/{$theme}/btn-delete.svg"
        label="Remove"
        action={removeRoutine}
    />
</Menu>

<style>
    .routine {
        position: relative;
        background-color: var(--blue);
        color: var(--text-on-blue);
        padding: 1rem;
        line-height: 1rem;
        border-radius: 1rem;
        margin-top: -1.5rem;
        box-shadow: 
            inset -1px -1px 2px rgba(0, 0, 0, 0.05)
        ;
    }
    .routine:hover {
        box-shadow: 
            inset 1px 1px 10px rgba(0, 0, 0, 0.1)
        ;
    }
    .active {
        font-weight: bold;
    }
</style>