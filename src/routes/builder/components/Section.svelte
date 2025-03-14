<script>
    import { writable } from 'svelte/store';

    export let id;
    export let label;

    export var shown = writable(true)

    function toggle_shown() {
        shown.set(!$shown)
    }
</script>

<section id={id}>
    <button class=component-section-btn on:click={toggle_shown}>{label}</button>
    <div class=component-section-buttons>
    {#if $shown}
    <slot></slot>
    {/if}
    </div>
</section>

<style>
    button.component-section-btn {
        background-color: var(--crust);
        padding: .5rem;
        width: 100%;
        margin: 0;
    }
    button.component-section-btn:hover {
        background-color: var(--primary);
    }
    .component-section-buttons {
        display: flex;
        flex-wrap: wrap;
    }
</style>