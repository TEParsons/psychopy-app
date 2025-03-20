<script>
    import { theme } from '../../globals.js';

    export let component;
</script>


<label 
    class=comp-name 
    for={component.params.get('name').val} 
    style="opacity: {component.disabled ? 0.3 : 1}"
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