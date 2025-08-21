<script>
    import EntryPoint from './EntryPoint.svelte';
    import Menu from '$lib/utils/menu/Menu.svelte';
    import MenuItem from '$lib/utils/menu/Item.svelte';
    import { getContext } from "svelte"
    import { ParamsDialog } from "$lib/utils/paramCtrls";
    
    let current = getContext("current");

    let {
        component
    } = $props()

    let ticks = $derived(component.routine.visualTicks)

    let hovered = $state(false);

    let showContextMenu = $state(false);
    let contextMenuPos = $state({
        x: undefined,
        y: undefined
    });

    function oncontextmenu(evt) {
        evt.preventDefault();
        // show menu
        showContextMenu = true;
        // set its position to the mouse pos
        contextMenuPos.x = evt.pageX;
        contextMenuPos.y = evt.pageY;
    }

    let showDialog = $state(false);

    function removeComponent() {
        // update history
        current.experiment.history.update(`remove ${component.name}`);
        // remove from Routine
        component.routine.removeComponent(component);
    }
</script>

<!-- entry point for this component -->
<EntryPoint routine={component.routine} index={component.index}></EntryPoint>

<!-- icon & name -->
<label 
    class=comp-name 
    for={component.params['name'].val} 
    style="opacity: {component.disabled ? 0.3 : 1}"
    style:border={hovered ? "1px solid var(--overlay)" : `1px solid var(--base)`}
    draggable="true" 
    onclick={() => {showDialog = true}}
    ondragstart={() => current.moving = component} 
    ondragend={() => current.moving = undefined} 
    onmouseenter={() => hovered = true}
    onmouseleave={() => hovered = false}
    role="none"
    oncontextmenu={oncontextmenu}
>    
    {component.name}
    <svg>
        <use xlink:href="icons/components/{component.tag}.svg"></use>
    </svg>
</label>

<!-- bars representing this on the timeline -->

<div class=comp-overshoot-timeline>
{#if component.visualStart === null}
    <div 
        class=comp-overshoot-bar
        style="background:linear-gradient(-90deg, var(--{component.visualColor}), var(--base));"
        onmouseenter={() => hovered = true}
        onmouseleave={() => hovered = false}
        role="none"
    ></div>
{/if}
</div>

<div 
    class=comp-timeline 
    id={component.params['name'].val} 
    style="grid-template-columns: repeat({ticks.labels.length}, 1fr) {ticks.remainder}fr;" 
    draggable={true} 
    onclick={() => {showDialog = true}}
    oncontextmenu={oncontextmenu}
    ondragstart={() => current.moving = component} 
    ondragend={() => current.moving = undefined} 
    onmouseenter={() => hovered = true}
    onmouseleave={() => hovered = false}
    role=none
>
    <div 
        class=comp-timeline-bar 
        style:left="{component.visualStart === null ? 0 : component.visualStart * 100 / component.routine.visualStop}%"
        style:right="{component.visualStop === null ? 0 : (component.routine.visualStop - component.visualStop) * 100 / component.routine.visualStop}%"
        style:background-color="var(--{component.visualColor})"
        style:border={hovered ? "1px solid var(--outline)" : `1px solid var(--${component.visualColor})`}
        onfocusin={() => hovered = true}
        onfocusout={() => hovered = false}
    ></div>
    {#each ticks.labels as tick}
    <div class=comp-timeline-tick style="flex-basis: {tick.proportion}"></div>
    {/each}
    <div 
        class=comp-timeline-tick 
        id=timeline-label-remainder 
        style:border-left={component.routine.settings.visualStop ? ".5rem solid var(--orange)" : "1px solid var(--overlay)"}
        style:z-index={component.routine.settings.visualStop ? 2 : 0}
    ></div>
</div>

<div class=comp-overshoot-timeline>
{#if component.visualStop === null}
    <div 
        class=comp-overshoot-bar
        style:background="linear-gradient(90deg, var(--{component.routine.settings.visualStop ? "overlay" : component.visualColor}), var(--base))"
        onmouseenter={() => hovered = true}
        onmouseleave={() => hovered = false}
        role="none"
    ></div>
    {/if}
</div>

<!-- menu to open when right clicked on -->
<Menu 
    bind:shown={showContextMenu} 
    bind:position={contextMenuPos}
>
    <MenuItem 
        icon="icons/btn-delete.svg"
        label="Delete Component"
        onclick={removeComponent}
    />
</Menu>

<!-- dialog to open when clicked on -->

<ParamsDialog 
    element={component}
    bind:shown={showDialog} 
/>

<style>
    .comp-timeline {
        display: grid;
        position: relative;
        width: 100%;
        grid-column-start: timeline;
    }
    .comp-overshoot-timeline {
        position: relative;
        width: 100%;
        height: 100%;
    }

    .comp-timeline-bar {
        position: absolute;
        top: 25%;
        bottom: 25%;
        z-index: 1;
    }

    .comp-overshoot-bar {
        position: absolute;
        left: 0; right: 0;
        top: 25%;
        bottom: 25%;
    }
    .comp-timeline {
        display: grid;
        position: relative;
        width: 100%;
        grid-column-start: timeline;
    }
    .comp-timeline-tick {
        color: var(--outline);
        border-left: 1px solid var(--overlay);
        width: 100%;
        text-align: right;
    }.comp-timeline-tick:last-child {
        border-right: 1px solid var(--overlay);
    }
    .comp-timeline-tick:last-child {
        border-right: 0;
    }

    .comp-overshoot-timeline {
        position: relative;
        width: 100%;
        height: 100%;
    }

    .comp-name {
        display: grid;
        grid-template-columns: [name] min-content [icon] 3rem;
        grid-gap: 1rem;
        
        align-items: center;
        justify-items: center;
        grid-column-start: name;
        font-size: 1.2rem;
        padding: .5rem 1rem;
        justify-self: right;
        border-radius: .5rem;
    }
</style>