<script>
    import { getContext, onDestroy } from "svelte";

    let {
        /** @prop @type {import("$lib/experiment/experiment.svelte.js").Param} Param object to which this ctrl pertains */
        param,
        /** @bindable State tracking whether the value of this ctrl is valid */
        valid=$bindable(),
        /** @prop @type {boolean} Controls whether this control is disabled */
        disabled=false,
        /** @prop @type {Function} Function to check whether this param's value is valid */
        validate = (param) => [true, undefined],
        /** @prop @type {Function} Function to check whether this param is code */
        checkCode = (param) => ["code", "extendedCode"].includes(param.valType) || String(param.val).startsWith("$"),
        /** @prop @type {Boolean} Should the code indicator ($) be shown? */
        codeIndicator = ["code", "extendedCode"].includes(param.valType)
    } = $props()

    let isCode = $derived(checkCode(param));


    $effect(() => {
        if (valid !== undefined) {
            [valid.state, valid.warning] = validate(param)
        }

        return param.val
    })
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
    class:valid={valid ? valid.state : true} 
    class:code={isCode} 
    disabled={disabled}
/>

<style>
    input {
        flex-grow: 1;
        color: var(--text);
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