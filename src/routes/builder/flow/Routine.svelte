<script>
    import EntryPoint from './EntryPoint.svelte'   
    import { Menu, MenuItem, SubMenu } from '$lib/utils/menu';
    import { theme } from '$lib/globals.svelte.js';
    import Tooltip from '$lib/utils/tooltip/Tooltip.svelte';
    import { getContext } from "svelte";
    
    let current = getContext("current");
    let actions = getContext("actions");

    let {
        element
    } = $props()

    let showContextMenu = $state(false)
    let contextMenuPos = $state({
        x: undefined,
        y: undefined
    });

    function removeRoutine(evt) {
        // update history
        actions.update();
        // move dragged routine to new position in the flow
        current.experiment.flow.removeElement(element.index)
    }

</script>

<EntryPoint index={element.index}></EntryPoint>
<div 
    class=routine 
    draggable=true
    ondragstart={() => current.moving = element} 
    ondragend={() => current.moving = undefined} 
    onclick={() => current.routine = element}
    class:active={current.routine ? current.routine.name === element.name : false}
    role="none"
    oncontextmenu={(evt) => {
        evt.preventDefault();
        // show menu
        showContextMenu = true;
        // set its position to the mouse pos
        contextMenuPos.x = evt.pageX;
        contextMenuPos.y = evt.pageY;
    }}
>
{#if element.settings && "desc" in element.settings.params && element.settings.params['desc'].val}
<Tooltip>
    {element.settings.params.get('desc').val}
</Tooltip>
{/if}
{element.name}
<!-- context menu -->
<Menu 
    bind:shown={showContextMenu} 
    bind:position={contextMenuPos}
>
    <MenuItem 
        icon="/icons/{theme}/btn-delete.svg"
        label="Remove"
        onclick={removeRoutine}
    />
</Menu>
</div>

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