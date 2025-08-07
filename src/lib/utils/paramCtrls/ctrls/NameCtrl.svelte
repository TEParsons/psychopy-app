<script>
    import SingleLineCtrl from "./SingleLineCtrl.svelte";

    let {
        param
    } = $props()
</script>

<SingleLineCtrl
    param={param}
    checkCode={(param) => false}
    validate={(param) => !String(param.val).includes(" ")}
    codeIndicator={false}
/>