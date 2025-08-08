<script>
    import Tooltip from "$lib/utils/tooltip/Tooltip.svelte";

    let {
        value=$bindable(),
        /** @prop @type {string|undefined} Path to icon for this button, if any */
        icon = undefined,
        /** @prop @type {(evt: PointerEvent) => undefined} Function to call when this button is toggled */
        ontoggle = (evt) => {},
        /** @prop @type {string|undefined} Hover text for this button, if any */
        tooltip = undefined,
        /** @prop @type {boolean} Is this button the primary action? */
        primary = false,
        /** @prop @type {boolean} Is this button an affirmative response? */
        affirmative = false,
        /** @prop @type {boolean} Is this button a negative response? */
        negative = false,
        /** @prop @type {boolean} Disable this button */
        disabled = false
    } = $props()

    let showTooltip = $state(false)
</script>


<button
    class:primary
    class:affirmative
    class:negative
    disabled={disabled}
    onmouseenter={() => {showTooltip = true}}
    onmouseleave={() => {showTooltip = false}}
    onfocusin={() => {showTooltip = true}}
    onfocusout={() => {showTooltip = false}}
    onclick={(evt) => {
        value = !value;
        ontoggle($state.snapshot(value));
    }}
    class:active={value}
>
    {#if tooltip}
    <Tooltip
        bind:shown={showTooltip}
        position="bottom-right"
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
</button>

<style>
    @import url("./button.css");

    button {
        position: relative;
    }

    button .icon {
        height: 1rem;
    }

    button.active {
        background-color: var(--crust);
        box-shadow: 
        inset 1px 1px 5px rgba(0, 0, 0, 0.15)
    ;
    }
</style>