<script>
    let {
        /** @prop @type {import("$lib/experiment.svelte.js").Param} Param object to which this ctrl pertains */
        param,
        /** @prop @type {Function} Function to check whether this param's value is valid */
        validate = (param) => true,
        /** @prop @type {Function} Function to check whether this param is code */
        checkCode = (param) => ["code", "extendedCode"].includes(param.valType) || String(param.val).startsWith("$"),
        /** @prop @type {Boolean} Should the code indicator ($) be shown? */
        codeIndicator = ["code", "extendedCode"].includes(param.valType)
    } = $props()

    let isCode = $derived(checkCode(param));
    let isValid = $derived(validate(param));
</script>

{#if codeIndicator}
<span 
    class=code-indicator
>
    $
</span>
{/if}
<input 
    class=param-text-input-single 
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
        flex-grow: 1;
    }
    input:not(.valid) {
        color: var(--red);
    }
    input.code {
        font-family: var(--mono);
        font-weight: bold;
    }

    .code-indicator {
        align-self: center;
    }
</style>