<script>
    export let icon;
    export let label;
    export let disabled = false;
</script>

<button 
    disabled={disabled} 
    on:click
>
    <img src={icon} alt={label} />
    <slot></slot>
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