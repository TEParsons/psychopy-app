<script>
    import { theme } from '../../globals.js';
    import { experiment, updateHistory } from '../globals.js';
    import { hoveredComponent } from './globals.js';

    export let component;
    export let routine;

    function removeComponent() {
        // update history
        updateHistory();
        // remove from Routine
        routine.removeComponent(component);
        // refresh
        experiment.set($experiment)
    }
</script>

<div 
    class=component-ctrls
    on:mouseenter={() => hoveredComponent.set(component.name)}
    on:mouseleave={() => hoveredComponent.set(null)}
    class:hidden={$hoveredComponent !== component.name}
>
    <button
        class=delete 
        on:click={removeComponent}
    >
        <img src="/icons/{$theme}/btn-delete.svg" alt=🗑 />
    </button>
</div>

<style>
    .hidden {
        opacity: 0;
    }
    .component-ctrls {
        display: grid;
        grid-auto-flow: column;
        z-index: 2;
    }
    button {
        opacity: 25%;
        background-color: transparent;
        padding: 0rem;
        margin: .25rem;
    }
    button:enabled:hover {
        opacity: 100%;
    }
    button img {
        height: 1rem;
        width: 1rem;
    }
</style>