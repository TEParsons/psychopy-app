<script>
    let {
        /** @prop @type {string} Text label for this button, if any */
        label="",
        /** @prop @type {string} Icon for this section, if any */
        icon=undefined,
        /** @prop @type {function} Function to call when this button is clicked */
        onclick=() => {},
        /** @prop @type {boolean} Disable this button */
        disabled=false
    } = $props()

</script>

<button 
    disabled={disabled} 
    onclick={onclick}
>
    <img src={icon} alt={label} />
</button>

<style>
    button {
        position: relative;
        background-color: transparent;
        padding: 0.25rem;
        margin: 0;
        grid-row-start: buttons;
        outline: none;
        border: 1px solid transparent;
        transition: border-color .2s, box-shadow .2s;
        border-radius: .5rem;
    }
    button:disabled {
        opacity: .5;
    }
    button:enabled:hover,
    button:enabled:focus {
        border-color: var(--overlay);
        box-shadow: 
            inset 1px 1px 10px rgba(0, 0, 0, 0.05)
        ;
    }
    button:enabled:focus {
        border-color: var(--blue);
    }

    button img {
        height: 2.25rem;
    }
</style>