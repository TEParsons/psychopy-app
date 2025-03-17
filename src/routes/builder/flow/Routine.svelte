<script>
    export let element;
</script>

<div class=routine id=flow-{element.name}>{element.name}</div>

<style>
    .routine {
        background-color: var(--secondary);
        color: var(--secondary-text);
        padding: 1rem;
        line-height: 1rem;
        border-radius: 1rem;
        margin-top: -1.5rem;
        z-index: 1;
    }
</style>