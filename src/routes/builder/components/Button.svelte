<script>
    import { writable } from 'svelte/store';
    import { theme } from '../../globals.js';
    import { experiment } from '../globals.js';
    import { currentPage } from '../routines/globals.js';
    import { StandaloneRoutine, Routine } from '../experiment.js';

    export let component;

    function title_case(name) {
        name = name.replace("Component", "")

        return name;
    }
    
    let enabled = writable(false);
    currentPage.subscribe((value) => {
        // if no experiment yet or no routine yet, skip
        if ($experiment === null) {
            enabled.set(false);
            return
        }
        if (!$experiment.routines.has(value)) {
            enabled.set(false);
            return
        }
        // get the current routine
        let currentRoutine = $experiment.routines.get(value);
        // disable Component buttons when on a StandaloneRoutine
        if (component.endsWith("Component")) {
            enabled.set(currentRoutine instanceof Routine);
        } else {
            enabled.set(true);
        }
    })
    
</script>

<button class="component-button vertical" id=add-{component}-btn disabled={!$enabled}>
    <img src="/icons/{$theme}/components/{component}.svg" alt="">
    <label for=add-{component}-btn>{title_case(component)}</label>
</button>

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
        
    }
</style>