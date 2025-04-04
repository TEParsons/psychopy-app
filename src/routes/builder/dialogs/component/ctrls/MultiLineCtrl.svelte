<script>
    export let param;
</script>

<textarea class=param-value bind:value={param.val}></textarea>

<style>
    @import url("paramCtrl.css");

    .param-value {
        resize: vertical;
        min-height: 5rem;
    }
</style>