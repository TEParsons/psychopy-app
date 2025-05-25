<script>
    import Tooltip from "../tooltip/Tooltip.svelte";

    /** @prop @type {string} Label for this button */
    export let label;
    /** @prop @type {string|undefined} Path to icon for this button, if any */
    export let icon = undefined;
    /** @prop @type {string|undefined} Hover text for this button, if any */
    export let tooltip = undefined;
    /** @prop @type {boolean} Is this button the primary action? */
    export let primary = false;
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
    class:primary
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
        padding: .75em 1em;
        font-family: var(--body);
        background-color: transparent;
        border: 1px solid var(--overlay);
        border-radius: .5rem;
        max-width: 100%;
        max-height: 100%;
        transition: border-color .2s, box-shadow .2s;
        box-shadow: 
            inset -1px -1px 2px rgba(0, 0, 0, 0.025)
        ;
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

    button.primary {
        color: var(--text-on-blue);
        background-color: var(--blue);
        border-width: 0;
    }
    button:enabled:hover.primary,
    button:enabled:focus.primary {
        box-shadow: 
            inset 1px 1px 10px rgba(0, 0, 0, 0.1)
        ;
    }


    button:disabled {
        opacity: 50%;
    }
    button:enabled:hover,
    button:enabled:focus {
        outline: none;
        border-color: var(--blue);
        box-shadow: 
            inset 1px 1px 10px rgba(0, 0, 0, 0.05)
        ;
    }    
</style>
