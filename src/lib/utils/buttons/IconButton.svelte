<script>
    import Tooltip from '../tooltip/Tooltip.svelte';

    let {
        /** @prop @type {string} Text label for this button, if any */
        label="",
        /** @prop @type {string} Icon for this button, if any */
        icon=undefined,
        /** @prop @type {function} Function to call when this button is clicked */
        onclick=(evt) => {},
        /** @prop @type {boolean} Disable this button */
        disabled=false,
        /** @prop @type {boolean} Only show border when hovered (looks better in the ribbon) */
        borderless=false,
        /** Are we awaiting execution of this button? */
        awaiting=$bindable(false),
        /** @interface */
        children=undefined,
    } = $props()

    let showTooltip = $state(false);
</script>


<button
    disabled={disabled} 
    onclick={evt => awaiting = onclick(evt)}
    onmouseenter={() => {showTooltip = true}}
    onmouseleave={() => {showTooltip = false}}
    onfocusin={() => {showTooltip = true}}
    onfocusout={() => {showTooltip = false}}
    class:borderless={borderless}
>
    <svg>
        {#await awaiting}
            <use xlink:href="/icons/sym-pending.svg#animation" ></use>
        {:then}
            <use xlink:href={icon}></use>
        {:catch}
            <use xlink:href={icon}></use>
        {/await}
    </svg>
    <Tooltip
        bind:shown={showTooltip}
        position="bottom"
    >
        {label}
    </Tooltip>

    {@render children?.()}
</button>


<style>
    button {
        position: relative;
        background-color: transparent;
        padding: 0.25rem;
        margin: 0;
        grid-row-start: buttons;
        outline: none;
        
        border-radius: .5rem;
        transition: border-color .2s, box-shadow .2s;
        display: grid;
        grid-auto-flow: column;
        align-items: center;
        gap: .2rem;
        z-index: 1;


        border: 1px solid var(--overlay);
        transition: border-color .2s, box-shadow .2s, background-color .2s, color .2s;
        box-shadow: 
            inset -1px -1px 2px rgba(0, 0, 0, 0.025)
        ;
    }
    button.borderless {
        box-shadow: none;
        border-color: transparent;
    }
    button:disabled {
        opacity: .5;
    }

    button:enabled:hover,
    button:enabled:focus {
        outline: none;
        border-color: var(--blue);
        box-shadow: 
            inset 1px 1px 10px rgba(0, 0, 0, 0.05)
        ;
    }

    button.borderless:enabled:hover,
    button.borderless:enabled:focus {
        border-color: var(--overlay);
        box-shadow: 
            inset 1px 1px 10px rgba(0, 0, 0, 0.05)
        ;
    }
    button.borderless:enabled:focus {
        border-color: var(--blue);
    }

    button svg {
        height: 2.25rem;
    }

</style>
