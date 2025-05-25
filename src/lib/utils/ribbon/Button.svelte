<script>
    export let id;
    export let icon;
    export let label;
    export let disabled = false;
</script>

<button id={id} disabled={disabled} on:click>
    <img src={icon} alt={label} />
    <slot></slot>
</button>

<style>
    button {
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
    button:enabled:hover {
        border-color: var(--overlay);
        box-shadow: 
            inset 1px 1px 10px rgba(0, 0, 0, 0.05)
        ;
    }

    button img {
        height: 2.25rem;
    }
</style>