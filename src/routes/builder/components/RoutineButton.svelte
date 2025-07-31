<script>
    import { writable } from 'svelte/store';
    import { theme } from "$lib/globals.js";
    import { experiment, currentRoutine } from '../globals.js';
    import { StandaloneRoutine, Routine, Component } from '$lib/experiment.svelte.js';
    import { Button } from '$lib/utils/buttons';
    import { getContext } from 'svelte';

    let {
        component
    } = $props()

    let history = getContext("history")

    function titleCase(name) {
        name = name.replace("Component", "");
        name = name.replace("Routine", "");

        name = name.replace(/(\w)([A-Z])/g, "$1 $2")

        return name;
    }

    function newRoutine() {
        // update history
        history.update()
        // create a new StandaloneRoutine
        let rt = StandaloneRoutine.fromTemplate(component['__name__'])
        // add it to the experiment
        $experiment.routines.set(
            rt.name,
            rt
        )
        // navigate to it
        currentRoutine.set(rt)
    }
    
</script>

{#if !component.hidden}
<Button 
    label={titleCase(component['__name__'])}
    icon="/icons/{$theme}/components/{component['__name__']}.svg"
    vertical
    disabled={!$currentRoutine}
    onclick={newRoutine}
></Button>
{/if}