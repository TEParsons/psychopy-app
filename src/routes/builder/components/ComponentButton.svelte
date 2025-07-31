<script>
    import { writable } from 'svelte/store';
    import { theme } from "$lib/globals.js";
    import { experiment, currentRoutine } from '../globals.js';
    import { StandaloneRoutine, Routine, Component } from '$lib/experiment.svelte.js';
    import Dialog from '../../dialogs/component/Dialog.svelte';
    import { Button } from '$lib/utils/buttons';

    let dialog;
    export let component;
    let dlgComponent = writable(
        Component.fromTemplate(component['__name__'])
    );

    function titleCase(name) {
        name = name.replace("Component", "");
        name = name.replace("Routine", "");

        name = name.replace(/(\w)([A-Z])/g, "$1 $2")

        return name;
    }

    function newComponent() {
        // create a new Component for the dialog
        dlgComponent.set(
            Component.fromTemplate(component['__name__'])
        )
        // show dialog
        dialog.showModal()
    }
        
</script>

{#if !component.hidden}
<Button 
    label={titleCase(component['__name__'])}
    icon="/icons/{$theme}/components/{component['__name__']}.svg"
    vertical
    disabled={!($currentRoutine instanceof Routine)}
    onclick={newComponent}
></Button>
<Dialog 
    id="dlg-{dlgComponent.name}"
    component={$dlgComponent} 
    bind:handle={dialog}
></Dialog>
{/if}