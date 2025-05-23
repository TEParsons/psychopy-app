<script>
    export let element;
    import EntryPoint from './EntryPoint.svelte'   
    import { dragging } from './globals.js';
    import { experiment } from '../globals.js';
    import { currentRoutine } from '../globals.js';
    import { json } from '@sveltejs/kit';
    import { Menu, MenuItem, SubMenu } from '$lib/utils/menu';
    import { theme } from '$lib/globals';
    import { writable } from 'svelte/store';
    import { updateHistory } from '../history';
    import Tooltip from '$lib/utils/tooltip/Tooltip.svelte';

    function on_dragstart(evt) {
        dragging.set(element.index)
    }
    function on_dragend(evt) {
        dragging.set(null)
    }
    function on_click(evt) {
        currentRoutine.set(element)
    }

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
        $experiment.flow.removeElement(element.index)
        // update experiment so subscribed views update
        experiment.set($experiment)
    }

</script>

<EntryPoint index={element.index}></EntryPoint>
<div 
    class=routine 
    id=flow-{element.name} 
    draggable="true" 
    on:dragstart={on_dragstart} 
    on:dragend={on_dragend} 
    on:click={on_click}
    class:active={$currentRoutine ? $currentRoutine.name === element.name : false}
    role="none"
    on:contextmenu|preventDefault={showContextMenu}
>
{#if element.settings && element.settings.params.has("desc") && element.settings.params.get('desc').val}
<Tooltip>
    {element.settings.params.get('desc').val}
</Tooltip>
{/if}
{element.name}
</div>
<Menu 
    bind:menu={menu} 
    style="position: {$menuPos.position}; left: {$menuPos.left}; top: {$menuPos.top};"
>
    <MenuItem 
        icon="/icons/{$theme}/btn-delete.svg"
        label="Remove"
        action={removeRoutine}
        closemenu={menu}
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
    }
    .active {
        font-weight: bold;
    }
</style>