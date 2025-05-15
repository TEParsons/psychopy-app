<script>
    import { writable } from 'svelte/store';
    import { theme } from "$lib/globals.js";
    import { experiment, currentRoutine } from '../globals.js';
    import { updateHistory } from '../history.js';
    import { StandaloneRoutine, Routine, Component } from '$lib/experiment.js';

    export let component;

    function titleCase(name) {
        name = name.replace("Component", "");
        name = name.replace("Routine", "");

        name = name.replace(/(\w)([A-Z])/g, "$1 $2")

        return name;
    }

    function newRoutine() {
        // update history
        updateHistory()
        // create a new StandaloneRoutine
        let rt = StandaloneRoutine.fromTemplate(component['__name__'])
        // add it to the experiment
        $experiment.routines.set(
            rt.name,
            rt
        )
        // navigate to it
        currentRoutine.set(rt)
        // refresh
        experiment.set($experiment);
    }
    
</script>

{#if !component.hidden}
<button 
    class="component-button vertical" 
    id="add-{component['__name__']}-btn" 
    disabled={!$currentRoutine}
    on:click={newRoutine}
>
    <img src="/icons/{$theme}/components/{component['__name__']}.svg" alt="">
    <label for="add-{component['__name__']}-btn">{titleCase(component['__name__'])}</label>
</button>
{/if}

<style>
    button.component-button {
        background-color: var(--mantle);
        width: 4rem;
        box-sizing: content-box;
        margin: 0;
        padding: 1rem;
    }
    button.component-button:enabled:hover {
        background-color: var(--base);
        color: var(--text);
    }
    button.component-button img {
        width: 3.5rem;
    }
    button.component-button label {
        hyphens: auto;
    }
</style>