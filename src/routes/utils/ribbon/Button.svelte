<script>
    export let id;
    export let icon;
    export let label;
    export let disabled;
</script>

<button id={id} disabled={disabled} on:click>
    <img src={icon} alt={label} />
</button>

<style>
    button {
        background-color: transparent;
        padding: 0.25rem;
        margin: 0;
        grid-row-start: buttons;
    }
    button:enabled:hover {
        background-color: var(--mantle);
    }
</style>