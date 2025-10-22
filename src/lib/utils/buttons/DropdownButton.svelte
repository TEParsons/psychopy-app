<script>
    import Menu from "../menu/Menu.svelte";
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
        /** @prop @type {boolean} Disable this button */
        disabled = false,
        /** @interface Inner contents of menu to be shown when button is clicked */
        children=undefined
    } = $props()

    let showTooltip = $state(false)
    let showMenu = $state(false);
</script>

<div class=dropdown-button>
    <button
        class=action-btn
        onclick={onclick}
        disabled={disabled}
        onmouseenter={() => {showTooltip = true}}
        onmouseleave={() => {showTooltip = false}}
        onfocusin={() => {showTooltip = true}}
        onfocusout={() => {showTooltip = false}}
    >
        {#if icon && String(icon).endsWith(".svg")}
            <svg 
            class=icon
        >
            <use href={icon}></use>
        </svg>
        {:else if icon && String(icon).endsWith(".png")}
            <img 
                class=icon
                src={icon}
                alt={icon}
            />
        {/if}
        <span
            class=label
        >{label}</span>
        {#if tooltip}
            <Tooltip
                bind:shown={showTooltip}
            >
                {tooltip}
            </Tooltip>
        {/if}
    </button>
    <button
        class=more-btn
        onclick={(evt) => showMenu = !showMenu}
        aria-label="v"
    >
        <svg 
            class=chevron
        >
            <use href="/icons/sym-arrow-down.svg"></use>
        </svg>
    </button>
    <Menu
        bind:shown={showMenu}
    >
        {@render children?.()}
    </Menu>
</div>

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

    .dropdown-button {
        position: relative;
        display: flex;
        flex-direction: row;
        gap: 0;
        margin: .25rem;
    }

    button .icon {
        width: 2rem;
        border-radius: .5rem;
    }

    button .label {
        grid-column-start: label;
    }

    .chevron {
        width: .5rem;
    }

    button:hover {
        z-index: 2;
    }

    .action-btn {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        display: grid;
        grid-template-columns: [icon] min-content [label] max-content;
        align-items: center;
        gap: .5rem;
        padding: 0 .5rem;
    }
    .more-btn {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        margin-left: -1px;
    }
    
</style>