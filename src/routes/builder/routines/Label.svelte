<script>
    import { dragging } from './dragging.js';
    import { theme } from '../../globals.js';

    export let component;

    function on_dragstart(evt) {
        dragging.set(component.index)
    }
    function on_dragend(evt) {
        dragging.set(null)
    }
</script>


<label 
    class=comp-name 
    for={component.params.get('name').val} 
    style="opacity: {component.disabled ? 0.3 : 1}"
    draggable="true" 
    on:dragstart={on_dragstart} 
    on:dragend={on_dragend} 
    role="none"
>
    {component.params.get('name').val}
    <img 
        src="/icons/{$theme}/components/{component.tag}.svg" 
        alt="" 
    />
</label>

<style>
    .comp-name {
        display: grid;
        grid-template-columns: [name] min-content [icon] 3rem;
        grid-gap: 1rem;
        
        align-items: center;
        justify-items: center;
        grid-column-start: name;
        font-size: 1.2rem;
        padding: .5rem 1rem;
        justify-self: right;
    }
    .comp-name img {
        height: 3.5rem;
    }
</style>