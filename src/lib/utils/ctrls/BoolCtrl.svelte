<script>
    export let param;

    import { Checkbox } from "./elements";
</script>

<Checkbox param={param}></Checkbox>

<style>
    @import url("paramCtrl.css");

    .param-value {
        grid-row-start: label;
        grid-column-start: before;
        grid-column-end: before;
    }
</style>