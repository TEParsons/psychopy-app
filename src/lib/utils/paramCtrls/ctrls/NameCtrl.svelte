<script>
    import SingleLineCtrl from "./SingleLineCtrl.svelte";

    let {
        param,
        /** @prop @type {boolean} Controls whether this control is disabled */
        disabled=false,
        valid=$bindable()
    } = $props()
</script>

<SingleLineCtrl
    param={param}
    checkCode={(param) => false}
    validate={(param) => {
        if (String(param.val).includes(" ")) {
            return [false, "Names cannot include spaces"]
        }
        if (String(param.val).length === 0) {
            return [false, "Must have a name"]
        }

        return [true, undefined]
    }}
    bind:valid={valid}
    codeIndicator={false}
    disabled={disabled}
/>