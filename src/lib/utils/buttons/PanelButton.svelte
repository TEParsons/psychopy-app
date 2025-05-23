<script>
    import { theme } from "$lib/globals";
    import { writable } from "svelte/store";

    export var label;
    export var icon = undefined;

    export var open = writable(false)

    function toggle_shown() {
        open.set(!$open)
    }
</script>

<button
    class=panel-button
    class:active={open}
    on:click={() => open.set(!$open)}
>
    {label}
    {#if $open}
    <img 
        class="panel-indicator open"
        src="/icons/{$theme}/sym-arrow-down.svg"
        alt="^"
    />
    {:else}
    <img 
        class="panel-indicator closed"
        src="/icons/{$theme}/sym-arrow-right.svg"
        alt="v"
    />
    {/if}
</button>
{#if $open}
<div 
    class="toggled-panel"
>
    <slot></slot>
</div>
{/if}

<style>
    button {
        position: relative;
        width: 100%;
        background-color: transparent;
        margin: .5rem 0;
        margin-bottom: .5rem;
        outline: none;
        border: none;
        padding: .5rem;
        border-bottom: 1px solid var(--overlay);
        transition: border-color .2s;
    }
    button:hover {
        border-color: var(--blue)
    }
    .panel-indicator {
        position: absolute;
        left: 1rem;
        bottom: 1rem;
    }
    .panel-indicator.open {
        height: .5rem;
    }
    .panel-indicator.closed {
        width: .5rem;
    }
</style>