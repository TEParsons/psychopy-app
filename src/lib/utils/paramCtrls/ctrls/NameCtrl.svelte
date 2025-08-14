<script>
    import SingleLineCtrl from "./SingleLineCtrl.svelte";

    let {
        param,
        valid=$bindable()
    } = $props()
</script>

<SingleLineCtrl
    param={param}
    checkCode={(param) => false}
    validate={(param) => !String(param.val).includes(" ")}
    bind:valid={valid}
    codeIndicator={false}
/>