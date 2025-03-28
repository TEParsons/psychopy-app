<script>
    import { hoveredComponent } from './globals.js';
    import Dialog from "../dialogs/component/Dialog.svelte";

    export let component;
    export let ticks;

    // get routine from component
    let routine = component.routine;
    
    let dialog;
</script>


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
    on:click={() => dialog.showModal()}
    on:mouseenter={() => hoveredComponent.set(component.name)}
    on:mouseleave={() => hoveredComponent.set(null)}
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

<style>
    @import url("./timeline.css");
</style>