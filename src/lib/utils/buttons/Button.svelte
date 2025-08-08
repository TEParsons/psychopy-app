<script>
    import Tooltip from "../tooltip/Tooltip.svelte";

    let {
        /** @prop @type {string} Label for this button */
        label,
        /** @prop @type {string|undefined} Path to icon for this button, if any */
        icon = undefined,
        /** @prop @type {(evt: PointerEvent) => undefined} Function to call when this button is pressed */
        onclick,
        /** @prop @type {string|undefined} Hover text for this button, if any */
        tooltip = undefined,
        /** @prop @type {boolean} Is this button the primary action? */
        primary = false,
        /** @prop @type {boolean} Is this button an affirmative response? */
        affirmative = false,
        /** @prop @type {boolean} Is this button a negative response? */
        negative = false,
        /** @prop @type {boolean} Set the layout of this button to horizontal */
        horizontal = false,
        /** @prop @type {boolean} Set the layout of this button to vertical */
        vertical = false,
        /** @prop @type {boolean} Disable this button */
        disabled = false
    } = $props()

    let showTooltip = $state(false)
</script>

<button
    onclick={onclick}
    class:vertical
    class:horizontal
    class:primary
    class:affirmative
    class:negative
    disabled={disabled}
    onmouseenter={() => {showTooltip = true}}
    onmouseleave={() => {showTooltip = false}}
    onfocusin={() => {showTooltip = true}}
    onfocusout={() => {showTooltip = false}}
>
    {#if tooltip}
    <Tooltip
        bind:shown={showTooltip}
        position="right"
    >
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
    @import url("./button.css");
    
    button {
        display: grid;
        align-items: center;
        padding: .75em 1em;
        font-family: var(--body);
        max-width: 100%;
        max-height: 100%;
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
</style>
