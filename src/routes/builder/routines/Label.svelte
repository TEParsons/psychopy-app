<script>
    import { dragging, hoveredComponent } from './globals.js';
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
    on:mouseenter={() => hoveredComponent.set(component.name)}
    on:mouseleave={() => hoveredComponent.set(null)}
    role="none"
>    
    {component.name}
    <img 
        src="/icons/{$theme}/components/{component.tag}.svg" 
        alt="" 
    />
</label>
<Dialog 
    id="dlg-{component.name}"
    component={component} 
    bind:handle={dialog}
></Dialog>

<style>
    .comp-name {
        display: grid;
        grid-template-columns: [name] min-content [icon] 3rem;
        grid-gap: 1rem;
        
        align-items: center;
        justify-items: center;
        grid-column-start: name;
        font-size: 1.2rem;
        padding: .5rem;
        justify-self: right;
    }
</style>