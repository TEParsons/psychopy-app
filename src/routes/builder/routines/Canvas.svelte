<script>
    import { theme } from '../../globals.js';
    import { pilot_mode, experiment } from '../globals.js';
    import { Component } from '../utils.js';

    export let name;

    let routine = $experiment.routines.get(name);

    // work out timeline increments based on routine duration
    let increment;
    if (routine.visualStop < 2) {
        increment = 0.1;
    } else if (routine.visualStop < 20) {
        increment = 1;
    } else if (routine.visualStop < 200) {
        increment = 10;
    } else {
        increment = 100;
    }
    // work out duration to last increment
    let last_increment = Math.floor(routine.visualStop / increment) * increment;
    // work out ticks for timeline grid
    var ticks = [];
    for (let tick = 0; tick < last_increment; tick += increment) {
        ticks.push({
            label: tick + increment,
            proportion: 1
        })
    }
    var tick_remainder = (routine.visualStop - last_increment) / increment;

    // work out color for each component
    var comp_colors = new Map();
    for (let comp of routine.components) {
        if (comp.disabled) {
            comp_colors.set(comp.name, "overlay")
        } else if (comp.forceEnd) {
            comp_colors.set(comp.name, "quaternary")
        } else {
            comp_colors.set(comp.name, "secondary")
        }
    }
</script>

<div class=routine-canvas>
    <button class=horizontal id=routine-settings>
        <img src="icons/{$theme}/btn-settings.svg" alt="" />
        <label for=routine-settings>Settings</label>
    </button>

    {#if routine.components.length}
    <div class=comp-name></div>
    <div class=comp-overshoot-timeline></div>
    <div class=comp-timeline style="grid-template-columns: repeat({ticks.length}, 1fr) {tick_remainder}fr;">
        {#each ticks as tick}
        <div class=comp-timeline-tick id=timeline-label-{tick.label}>
            <label for=timeline-labels>{tick.label}s</label>
        </div>
        {/each}
        <div class=comp-timeline-tick id=timeline-label-remainder></div>
    </div>
    <div class=comp-overshoot-timeline></div>
    {/if}

    

    {#each routine.components as component}

    {#if component !== null}
    <label 
        class=comp-name 
        for={component.params.get('name').val} 
        style="opacity: {component.disabled ? 0.3 : 1}"
    >
        {component.params.get('name').val}
        <img 
            src="/icons/{$theme}/components/{component.tag}.svg" 
            alt="" 
        />
    </label>

    <div class=comp-overshoot-timeline>
    {#if component.visualStart === null}
        <div 
            class=comp-overshoot-bar
            style="background:linear-gradient(-90deg, var(--{comp_colors.get(component.name)}), var(--base));"
        ></div>
    {/if}
    </div>

    <div class=comp-timeline id={component.params.get('name').val} style="grid-template-columns: repeat({ticks.length}, 1fr) {tick_remainder}fr;">
        <div 
            class=comp-timeline-bar 
            style="
            left:{component.visualStart === null ? 0 : component.visualStart * 100 / routine.visualStop}%; 
            right:{component.visualStop === null ? 0 : (routine.visualStop - component.visualStop) * 100 / routine.visualStop}%;
            background-color:var(--{comp_colors.get(component.name)});
            "
        ></div>
        {#each ticks as tick}
        <div class=comp-timeline-tick style="flex-basis: {tick.proportion}"></div>
        {/each}
        <div class=comp-timeline-tick id=timeline-label-remainder></div>
    </div>

    <div class=comp-overshoot-timeline>
    {#if component.visualStop === null}
        <div 
            class=comp-overshoot-bar
            style="background:linear-gradient(90deg, var(--{comp_colors.get(component.name)}), var(--base));"
        ></div>
        {/if}
    </div>

    {/if}
    {/each}
</div>

<style>
    .routine-canvas {
        display: grid;
        grid-template-columns: [name] min-content [undershoot] 3rem [timeline] 1fr [overshoot] 3rem;
        grid-gap: 0;
        padding-bottom: 2rem;
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
    }
    .comp-name img {
        height: 3.5rem;
    }
    .comp-timeline {
        display: grid;
        position: relative;
        width: 100%;
        grid-column-start: timeline;
    }
    .comp-timeline-tick {
        color: var(--overlay);
        border-left: 1px solid var(--overlay);
        width: 100%;
        text-align: right;
    }
    .comp-timeline-tick label {
        padding-right: .5rem;
    }
    .comp-timeline-tick:last-child {
        border-right: 0;
    }
    .comp-timeline-bar {
        position: absolute;
        top: 25%;
        bottom: 25%;
    }
    .comp-overshoot-timeline {
        position: relative;
        width: 100%;
        height: 100%;
    }
    .comp-overshoot-bar {
        position: absolute;
        left: 0; right: 0;
        top: 25%;
        bottom: 25%;
    }

    #routine-settings {
        background-color: var(--mantle);
        margin-bottom: 0;
    }
    #routine-settings:hover {
        background-color: var(--primary);
        color: var(--primary-text);
    }
</style>