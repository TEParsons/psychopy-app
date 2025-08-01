<script>
    let {
        param,
        validate = (param) => true
    } = $props()

    function checkCode(param) {
        // is valType is code, always true
        if (param.valType === "code") {
            return true;
        }
        // if starts with a $, true
        if (String(param.val).startsWith("$")) {
            return true;
        }

        return false;
    }

    let isCode = $derived(checkCode(param));
    let isValid = $derived(validate(param));
</script>

<input 
    class=param-text-input 
    type="text" 
    bind:value={param.val} 
    class:valid={isValid} 
    class:code={isCode} 
/>

<style>
    input {
        font-family: inherit;
        font-size: inherit;
        font-weight: inherit;
        color: inherit;
    }
    :not(.valid) {
        color: var(--red);
    }
    .code {
        font-family: var(--mono);
        font-weight: bold;
    }
</style>