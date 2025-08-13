<script>
    import EntryPoint from './EntryPoint.svelte'   
    import { Menu, MenuItem, SubMenu } from '$lib/utils/menu';
    import { theme } from '$lib/globals.svelte.js';
    import Tooltip from '$lib/utils/tooltip/Tooltip.svelte';
    import { getContext } from "svelte";
    
    let current = getContext("current");

    let {
        element
    } = $props()

    let showContextMenu = $state(false)
    let contextMenuPos = $state({
        x: undefined,
        y: undefined
    });

    let showTooltip = $state(false);

    function removeRoutine(evt) {
        // update history
        current.experiment.history.update(`remove ${element.name}`);
        // remove this element from the flow
        current.experiment.flow.removeElement(element.index)
    }
    
    $effect(() => {
        if (!Object.values(current.experiment.routines).includes(element)) {
            current.experiment.flow.removeElement(element.index)
        }
    })

</script>

<EntryPoint index={element.index}></EntryPoint>
<button 
    class=routine 
    draggable={true}
    onmouseenter={() => {showTooltip = true}}
    onmouseleave={() => {showTooltip = false}}
    onfocusin={() => {showTooltip = true}}
    onfocusout={() => {showTooltip = false}}
    ondragstart={() => current.moving = element} 
    ondragend={() => current.moving = undefined} 
    onclick={() => current.routine = element}
    class:active={current.routine ? current.routine.name === element.name : false}
    oncontextmenu={(evt) => {
        evt.preventDefault();
        // show menu
        showContextMenu = true;
        // set its position to the mouse pos
        contextMenuPos.x = evt.pageX;
        contextMenuPos.y = evt.pageY;
    }}
>
    <!-- tooltip -->
    {#if element.settings && "desc" in element.settings.params && element.settings.params['desc'].val}
        <Tooltip
            bind:shown={showTooltip}
            position="bottom"
        >
            {#if element.settings.params['desc'].val.length > 64}
                {element.settings.params['desc'].val.slice(0, 64)}...
            {:else}
                {element.settings.params['desc'].val}
            {/if}
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
</button>

<style>
    .routine {
        position: relative;
        background-color: var(--blue);
        color: var(--text-on-blue);
        padding: 1rem;
        border-radius: 1rem;
        box-shadow: 
            inset -1px -1px 2px rgba(0, 0, 0, 0.05)
        ;
        border: 1px solid var(--blue);
        transform: translateY(-50%);
    }
    .routine:focus,
    .routine:hover {
        box-shadow: inset 1px 1px 10px rgba(0, 0, 0, 0.1);
        border-color: var(--outline);
    }
    .active {
        font-weight: bold;
    }
</style>