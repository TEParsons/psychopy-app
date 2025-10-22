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
        /** @prop @type {boolean} Are we awaiting execution of this button? */
        awaiting=$bindable(),
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
        <svg 
            class=icon
        >
            {#await awaiting}
                <use xlink:href="/icons/sym-pending.svg#animation" ></use>
            {:then}
                {#if String(icon).match(/.*\.svg/g)}
                    <use xlink:href={icon}></use>
                {:else}
                    {@html icon}
                {/if}
            {:catch}
                <use xlink:href="/icons/sym-error.svg" ></use>
            {/await}
        </svg>
    {/if}
    <span
        class=label
    >{label}</span>
</button>

<style>
    button {
        position: relative;
        background-color: transparent;
        border: 1px solid var(--overlay);
        border-radius: .5rem;
        transition: border-color .2s, box-shadow .2s, background-color .2s, color .2s;
        box-shadow: 
            inset -1px -1px 2px rgba(0, 0, 0, 0.025)
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

    button.primary {
        color: var(--text-on-blue);
        background-color: var(--blue);
        border-width: 0;
    }
    button:enabled:hover.primary, button:enabled:focus.primary,
    button:enabled:hover.affirmative, button:enabled:focus.affirmative,
    button:enabled:hover.negative, button:enabled:focus.negative {
        box-shadow: 
            inset 1px 1px 10px rgba(0, 0, 0, 0.1)
        ;
    }

    button:enabled:hover.affirmative,
    button:enabled:focus.affirmative {
        color: var(--text-on-blue);
        background-color: var(--blue);
        border-color: var(--blue);
    }

    button:enabled:hover.negative,
    button:enabled:focus.negative {
        color: var(--text-on-red);
        background-color: var(--red);
        border-color: var(--red);
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

    button .icon {
        width: 100%;
        aspect-ratio: 1/1;
    }
    
    button {
        display: grid;
        align-items: center;
        padding: .75em 1em;
        font-family: var(--body);
        max-width: 100%;
        max-height: 100%;
    }
    button svg {
        height: 2.25rem;
        aspect-ratio: 1 / 1;
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
