<script>
    import { theme } from "$lib/globals";
    import { writable } from "svelte/store";
    import Tooltip from "$lib/utils/tooltip/Tooltip.svelte";

    /** @prop @type {string} Label for this button */
    export var label;
    /** @prop @type {string|undefined} Hover text for this button, if any */
    export let tooltip = undefined;

    /** @public @type {import("svelte/store").Writable<boolean|undefined>} Whether this panel is open, store can be supplied or bound */
    export var open = writable(false)
</script>

<button
    class=panel-button
    class:active={open}
    on:click={() => open.set(!$open)}
>
    {#if tooltip}
    <Tooltip>
        {tooltip}
    </Tooltip>
    {/if}
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