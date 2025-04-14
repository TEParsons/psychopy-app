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
        padding-bottom: 0.5rem;
        margin: 0;
        grid-row-start: buttons;
    }
    button:enabled:hover {
        background-color: var(--mantle);
    }

    button img {
        height: 32px;
    }
</style>