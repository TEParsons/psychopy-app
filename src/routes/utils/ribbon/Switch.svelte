<script>
    import { theme } from '../../globals.js'

    export let id;
    export let state;
    export let left;
    export let right;
</script>

<button id={id} class="switch-ctrl" on:click>
    <span class="{$state ? "active" : "inactive"}">{left}</span>
    <img src="/icons/{$theme}/ctrl-switch-{$state ? "left" : "right"}.svg" alt="Toggle ({$state ? "left" : "right"})"/>
    <span class="{$state ? "inactive" : "active"}">{right}</span>
</button>

<style>
    button {
        background-color: transparent;
        padding: 0.25rem;
        margin: 0;
        grid-row-start: buttons;
        padding-bottom: 0.5rem;
    }

    button.switch-ctrl {
        display: grid;
        grid-template-columns: auto min-content auto;
        grid-gap: .5rem;
        align-items: center;
        color: var(--text);
    }
    button.switch-ctrl:hover {
        color: var(--text);
        background-color: transparent;
    }
    button.switch-ctrl .active {
        opacity: 100%;
    }
    button.switch-ctrl .inactive {
        opacity: 50%;
    }
</style>