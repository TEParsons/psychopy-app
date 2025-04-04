<script>
    import { theme } from '../../globals.js';
    import { experiment } from '../globals.js';
    import { dragging, hoveredComponent } from './globals.js';
    import { updateHistory } from '../history.js';
    import EntryPoint from './EntryPoint.svelte';
    import Dialog from "../../dialogs/component/Dialog.svelte";
    import Menu from '../../utils/menu/Menu.svelte';
    import MenuItem from '../../utils/menu/Item.svelte';
    import { writable } from 'svelte/store';

    export let component;
    export let ticks;

    let routine = component.routine;
    let dialog;
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
        console.log(evt, $menuPos)
        // show menu
        menu.setOpen(true);
    }

    function removeComponent() {
        // update history
        updateHistory();
        // remove from Routine
        routine.removeComponent(component);
        // refresh
        experiment.set($experiment)
    }
</script>

<!-- entry point for this component -->
<EntryPoint routine={routine} index={component.index}></EntryPoint>

<!-- icon & name -->
<label 
    class=comp-name 
    for={component.params.get('name').val} 
    style="opacity: {component.disabled ? 0.3 : 1}"
    draggable="true" 
    on:dragstart={() => dragging.set(component.index)} 
    on:dragend={() => dragging.set(null)} 
    on:click={() => dialog.showModal()}
    on:mouseenter={() => hoveredComponent.set(component.name)}
    on:mouseleave={() => hoveredComponent.set(null)}
    role="none"
    on:contextmenu|preventDefault={showContextMenu}
>    
    {component.name}
    <img 
        src="/icons/{$theme}/components/{component.tag}.svg" 
        alt="" 
    />
</label>

<Menu 
    bind:menu={menu} 
    style="position: {$menuPos.position}; left: {$menuPos.left}; top: {$menuPos.top};"
>
    <MenuItem 
        icon="/icons/{$theme}/btn-delete.svg"
        label="Delete Component"
        action={removeComponent}
        closemenu={menu}
    />
</Menu>

<!-- bars representing this on the timeline -->

<div class=comp-overshoot-timeline>
{#if component.visualStart === null}
    <div 
        class=comp-overshoot-bar
        style="background:linear-gradient(-90deg, var(--{component.visualColor}), var(--base));"
    ></div>
{/if}
</div>

<div 
    class=comp-timeline 
    id={component.params.get('name').val} 
    style="grid-template-columns: repeat({ticks.labels.length}, 1fr) {ticks.remainder}fr;" 
    draggable={true} 
    on:click={() => dialog.showModal()}
    on:contextmenu|preventDefault={showContextMenu}
    on:mouseenter={() => hoveredComponent.set(component.name)}
    on:mouseleave={() => hoveredComponent.set(null)}
    on:dragstart={() => dragging.set(component.index)} 
    on:dragend={() => dragging.set(null)} 
    role="none"
>
    <div 
        class=comp-timeline-bar 
        style="
        left:{component.visualStart === null ? 0 : component.visualStart * 100 / routine.visualStop}%; 
        right:{component.visualStop === null ? 0 : (routine.visualStop - component.visualStop) * 100 / routine.visualStop}%;
        background-color:var(--{component.visualColor});
        "
    ></div>
    {#each ticks.labels as tick}
    <div class=comp-timeline-tick style="flex-basis: {tick.proportion}"></div>
    {/each}
    <div class=comp-timeline-tick id=timeline-label-remainder></div>
</div>
<Dialog 
    id="dlg-{component.name}"
    component={component} 
    bind:handle={dialog}
></Dialog>

<div class=comp-overshoot-timeline>
{#if component.visualStop === null}
    <div 
        class=comp-overshoot-bar
        style="background:linear-gradient(90deg, var(--{component.visualColor}), var(--base));"
    ></div>
    {/if}
</div>

<!-- dialog to open when clicked on -->
<Dialog 
    id="dlg-{component.name}"
    component={component} 
    bind:handle={dialog}
></Dialog>

<style>
    @import url("./timeline.css");

    .comp-name {
        display: grid;
        grid-template-columns: [name] min-content [icon] 3rem;
        grid-gap: 1rem;
        
        align-items: center;
        justify-items: center;
        grid-column-start: name;
        font-size: 1.2rem;
        padding: .5rem;
        justify-self: right;
    }
    .hidden {
        opacity: 0;
    }
    .component-ctrls {
        display: grid;
        grid-auto-flow: column;
        z-index: 2;
    }
    button {
        opacity: 25%;
        background-color: transparent;
        padding: 0rem;
        margin: .25rem;
    }
    button:enabled:hover {
        opacity: 100%;
    }
    button img {
        height: 1rem;
        width: 1rem;
    }
</style>