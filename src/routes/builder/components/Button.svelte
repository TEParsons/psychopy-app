<script>
    import { theme } from '../../globals.js';

    export let component;

    function title_case(name) {
        name = name.replace("Component", "")

        return name;
    }
</script>

<button class=component-button id=add-{component}-btn>
    <img src="/icons/{$theme}/components/{component}.svg" alt="">
    <label for=add-{component}-btn>{title_case(component)}</label>
</button>

<style>
    button.component-button {
        background-color: var(--mantle);
        display: grid;
        grid-template-rows: [icon] 4rem [label] 1rem;
        align-items: center;
        justify-items: center;
        width: 4rem;
        box-sizing: content-box;
        margin: 0;
        padding: 1rem;
    }
    button.component-button:hover {
        background-color: var(--base);
        color: var(--text);
    }
    button.component-button img {
        width: 3.5rem;
    }
    button.component-button label {
        
    }
</style>