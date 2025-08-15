<script>
    let {
        /** @prop @type {string} Text label for this button, if any */
        labels=["", ""],
        /** @prop @type {string} Starting  */
        state=$bindable(false),
        /** @prop @type {function} Function to call when this switch is toggled */
        onclick=() => {},
        /** @prop @type {boolean} Disable this button */
        disabled=false
    } = $props()

</script>

<button 
    class="switch-ctrl" 
    onclick={(evt) => {
        state = !state;
        onclick(evt)
    }}
    disabled={disabled}
>
    <span class="{state ? "active" : "inactive"}">{labels[0]}</span>
    <svg>
        <use xlink:href="/icons/ctrl-switch-{state ? "left" : "right"}.svg"></use>
    </svg>
    <span class="{state ? "inactive" : "active"}">{labels[1]}</span>
</button>

<style>
    button {
        background-color: transparent;
        padding: 0.25rem;
        margin: 0;
        grid-row-start: buttons;
        padding-bottom: 0.5rem;
        border: none;
        outline: none;
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