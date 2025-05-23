<script>
    import Tooltip from "../tooltip/Tooltip.svelte";

    /** @prop @type {string} Label for this button */
    export let label;
    /** @prop @type {string|undefined} Path to icon for this button, if any */
    export let icon = undefined;
    /** @prop @type {string|undefined} Hover text for this button, if any */
    export let tooltip = undefined;
    /** @prop @type {boolean} Set the layout of this button to horizontal */
    export let horizontal = false;
    /** @prop @type {boolean} Set the layout of this button to vertical */
    export let vertical = false;
    /** @prop @type {boolean} Disable this button */
    export let disabled = false;
</script>

<button
    on:click
    class:vertical
    class:horizontal
    disabled={disabled}
>
    {#if tooltip}
    <Tooltip>
        {tooltip}
    </Tooltip>
    {/if}
    {#if icon}
    <img 
        class=icon
        src={icon} 
        alt=""
    />
    {/if}
    <span
        class=label
    >{label}</span>
</button>

<style>
    button {
        display: grid;
        position: relative;
        align-items: center;
        padding: 1em;
        font-family: var(--body);
        background-color: transparent;
        border: 1px solid var(--overlay);
        border-radius: .5rem;
        max-width: 100%;
        max-height: 100%;
        transition: border-color .2s;
    }

    button.horizontal {
        grid-template-columns: [icon] min-content [label] max-content;
        justify-content: start;
    }
    button.horizontal .icon {
        width: 2rem;
        margin-right: .5rem;
        grid-column-start: icon;
    }
    button.horizontal .label {
        grid-column-start: label;
    }

    button.vertical {
        grid-template-rows: [icon] min-content [label] min-content;
        justify-items: center;
    }
    button.vertical .icon {
        height: 3rem;
        margin-bottom: .5rem;
        grid-row-start: icon;
    }
    button.vertical .label {
        grid-row-start: label;
        hyphens: auto;
    }

    button:disabled {
        opacity: 50%;
    }
    button:enabled:hover,
    button:enabled:focus {
        outline: none;
        border-color: var(--blue);
    }    
</style>