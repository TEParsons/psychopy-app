<script>
    import { theme } from "$lib/globals.svelte.js";
    import { StandaloneRoutine, Routine, Component } from '$lib/experiment.svelte.js';
    import Dialog from '../../dialogs/ComponentDialog.svelte';
    import { Button } from '$lib/utils/buttons';
    import { getContext } from "svelte";
    
    let current = getContext("current");

    let {
        component
    } = $props()

    let dlgComponent = $state(
        Component.fromTemplate(component['__name__'])
    );
    let showDialog = $state()

    function titleCase(name) {
        name = name.replace("Component", "");
        name = name.replace("Routine", "");

        name = name.replace(/(\w)([A-Z])/g, "$1 $2")

        return name;
    }

    function newComponent() {
        // create a new Component for the dialog
        dlgComponent = Component.fromTemplate(component['__name__'])
        // show dialog
        showDialog = true
    }
        
</script>

{#if !component.hidden}
<Button 
    label={titleCase(component['__name__'])}
    icon="/icons/{theme}/components/{component['__name__']}.svg"
    vertical
    disabled={!(current.routine instanceof Routine)}
    onclick={newComponent}
></Button>
<Dialog 
    component={dlgComponent} 
    bind:shown={showDialog}
></Dialog>
{/if}