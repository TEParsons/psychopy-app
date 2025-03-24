<script>
    import { dragging } from './globals.js';
    import { theme } from '../../globals.js';
    import Dialog from '../dialogs/component/Dialog.svelte';

    export let component;

    function on_dragstart(evt) {
        dragging.set(component.index)
    }
    function on_dragend(evt) {
        dragging.set(null)
    }

    let dialog;
</script>

<label 
    class=comp-name 
    for={component.params.get('name').val} 
    style="opacity: {component.disabled ? 0.3 : 1}"
    draggable="true" 
    on:dragstart={on_dragstart} 
    on:dragend={on_dragend} 
    on:click={() => dialog.showModal()}
    role="none"
>
    <img class=edit src="/icons/{$theme}/btn-edit.svg" alt=✎ />
    {component.name}
    <img 
        src="/icons/{$theme}/components/{component.tag}.svg" 
        alt="" 
    />
</label>
<Dialog 
    id="dlg-{component.name}"
    component={component} 
    helpLink="" 
    bind:dialog
></Dialog>

<style>
    .comp-name {
        display: grid;
        grid-template-columns: [edit] 1.5rem [name] min-content [icon] 3rem;
        grid-gap: 1rem;
        
        align-items: center;
        justify-items: center;
        grid-column-start: name;
        font-size: 1.2rem;
        padding: .5rem 1rem;
        justify-self: right;
    }
    .edit {
        visibility: hidden;
        padding: 0;
        margin: 0;
        justify-items: center;
        align-items: center;
    }
    .edit img {
        width: 1.5rem;
    }
    .comp-name:hover .edit {
        visibility: visible;
    }
</style>