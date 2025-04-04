<script>
    export let param;
</script>

<input class=param-value type="checkbox" bind:checked={param.val} />

<style>
    @import url("paramCtrl.css");

    .param-value {
        grid-row-start: label;
        grid-column-start: before;
        grid-column-end: before;
    }
</style>