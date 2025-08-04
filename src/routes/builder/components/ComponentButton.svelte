<script>
    import { theme } from "$lib/globals.svelte.js";
    import { StandaloneRoutine, Routine, Component } from '$lib/experiment.svelte.js';
    import { Button } from '$lib/utils/buttons';
    import { getContext } from "svelte";
    import Dialog from "$lib/utils/dialog/Dialog.svelte";
    import { ParamsNotebook } from "$lib/utils/paramCtrls";
    
    let current = getContext("current");
    let actions = getContext("actions");

    let {
        component
    } = $props()

    let notebook;

    let dlgComponent = $state(
        new Component(component['__name__'])
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
        dlgComponent = new Component(component['__name__'])
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
    id=new-loop 
    title="New loop"
    bind:shown={showDialog} 
    buttons={{
        OK: (evt) => {
            // apply changes to params
            notebook.applyChanges(evt)
            // add loop to experiment
            current.routine.addComponent(dlgComponent)
        }, 
        CANCEL: () => notebook.discardChanges(), 
        HELP: dlgComponent.helpLink,
    }}
>
    <ParamsNotebook bind:this={notebook} element={dlgComponent}></ParamsNotebook>
</Dialog>
{/if}