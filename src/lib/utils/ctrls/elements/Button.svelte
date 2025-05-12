<script>
    export let icon;

</script>

<button class=param-ctrl-btn on:click>
    <img src={icon} alt="" />
</button>

<style>
    .param-ctrl-btn {
        height: 100%;
        margin: 0;
        padding: .25rem;
        border-radius: .25rem;
        border: 1px solid var(--overlay);
        background-color: var(--base);
    }
    .param-ctrl-btn:hover {
        background-color: var(--mantle);
    }
    .param-ctrl-btn img {
        height: 100%;
        width: auto;
    }
</style>