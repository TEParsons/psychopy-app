<script>
    import { writable } from 'svelte/store';
    import { theme } from "$lib/globals.js";
    import { experiment, currentRoutine } from '../globals.js';
    import { StandaloneRoutine, Routine, Component } from '$lib/experiment.js';
    import Dialog from '../../dialogs/component/Dialog.svelte';

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
<button 
    class="component-button vertical" 
    id="add-{component['__name__']}-btn" 
    disabled={!($currentRoutine instanceof Routine)}
    on:click={newComponent}
>
    <img src="/icons/{$theme}/components/{component['__name__']}.svg" alt="">
    <label for="add-{component['__name__']}-btn">{titleCase(component['__name__'])}</label>
</button>
<Dialog 
    id="dlg-{dlgComponent.name}"
    component={$dlgComponent} 
    bind:handle={dialog}
></Dialog>
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