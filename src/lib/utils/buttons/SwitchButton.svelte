<script>
    import Tooltip from "../tooltip/Tooltip.svelte";

    let {
        /** @prop @type {string} Text label for this button, if any */
        labels=["", ""],
        /** @prop @type {string|undefined} Hover text for this button, if any */
        tooltip=undefined,
        /** @prop @type {string} Starting  */
        value=$bindable(false),
        /** @prop @type {function} Function to call when this switch is toggled */
        onclick=() => {},
        /** @prop @type {boolean} Disable this button */
        disabled=false
    } = $props()

    let showTooltip = $state.raw(false)
</script>

<button 
    class="switch-ctrl" 
    onclick={(evt) => {
        value = !value;
        onclick(evt)
    }}
    onmouseenter={() => showTooltip = true}
    onmouseleave={() => showTooltip = false}
    onfocusin={() => showTooltip = true}
    onfocusout={() => showTooltip = false}
    disabled={disabled}
>
    {#if tooltip}
        <Tooltip
            position=bottom
            bind:shown={showTooltip}
        >
            {tooltip}
        </Tooltip>
    {/if}
    <span class="{value ? "active" : "inactive"}">{labels[0]}</span>
    <svg>
        <use xlink:href="icons/ctrl-switch-{value ? "left" : "right"}.svg"></use>
    </svg>
    <span class="{value ? "inactive" : "active"}">{labels[1]}</span>
</button>

<style>
    button {
        position: relative;
        background-color: transparent;
        padding: 0.25rem;
        margin: 0;
        grid-row-start: buttons;
        padding-bottom: 0.5rem;
        border: none;
        outline: none;
        z-index: 1;
    }
    button:disabled {
        opacity: .5;
    }
    button svg {
        width: 32px;
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
    button.switch-ctrl:enabled .active {
        opacity: 100%;
    }
    button.switch-ctrl:enabled .inactive {
        opacity: 50%;
    }
</style>