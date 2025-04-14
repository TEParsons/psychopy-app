<script>
    import { writable } from 'svelte/store';
    import { theme } from "$lib/globals.js";
    import { experiment, currentRoutine } from '../globals.js';
    import { updateHistory } from '../history.js';
    import { currentPage } from '../routines/globals.js';
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
        $experiment.routines.set(
            component['__name__'],
            StandaloneRoutine.fromTemplate(component['__name__'])
        )
        // navigate to it
        currentPage.set(component['__name__'])
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