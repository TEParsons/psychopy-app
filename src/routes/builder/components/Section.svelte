<script>
    import { writable } from 'svelte/store';

    export let id;
    export let label;

    export var shown = writable(false)

    function toggle_shown() {
        shown.set(!$shown)
    }
</script>

<section id={id}>
    <button 
        class=component-section-btn 
        on:click={toggle_shown}
        class:active={$shown}
    >{label}</button>
    <div class=component-section-buttons>
    {#if $shown}
    <slot></slot>
    {/if}
    </div>
</section>

<style>
    section {
        margin: .5rem 0;
    }
    button {
        background-color: var(--crust);
    }
    button.component-section-btn {
        border-radius: 0;
        padding: .5rem;
        width: 100%;
        margin: 0;
    }
    .component-section-buttons {
        display: flex;
        flex-wrap: wrap;
    }
</style>