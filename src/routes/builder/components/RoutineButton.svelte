<script>
    import { writable } from 'svelte/store';
    import { theme } from "$lib/globals.js";
    import { experiment, currentRoutine } from '../globals.js';
    import { updateHistory } from '../history.js';
    import { StandaloneRoutine, Routine, Component } from '$lib/experiment.js';
    import { Button } from '$lib/utils/buttons';

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
<Button 
    label={titleCase(component['__name__'])}
    icon="/icons/{$theme}/components/{component['__name__']}.svg"
    vertical
    disabled={!$currentRoutine}
    on:click={newRoutine}
></Button>
{/if}