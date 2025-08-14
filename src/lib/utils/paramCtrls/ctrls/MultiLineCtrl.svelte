<script>
    let {
        /** @prop @type {import("$lib/experiment.svelte.js").Param} Param object to which this ctrl pertains */
        param,
        /** @bindable State tracking whether this param's value is valid */
        valid=$bindable(),
        /** @prop @type {Function} Function to check whether this param's value is valid */
        validate = (param) => true,
        /** @prop @type {Function} Function to check whether this param is code */
        checkCode = (param) => ["code", "extendedCode"].includes(param.valType) || String(param.val).startsWith("$"),
        /** @prop @type {Boolean} Should the code indicator ($) be shown? */
        codeIndicator = ["code", "extendedCode"].includes(param.valType)
    } = $props()

    let isCode = $derived(checkCode(param));

    $effect(() => {
        if (valid !== undefined) {
            valid.state = validate(param)
        }
    })
</script>

{#if codeIndicator}
<span 
    class=code-indicator
>
    $
</span>
{/if}
<textarea 
    class=param-text-input-multi
    bind:value={param.val} 
    class:valid={valid.state} 
    class:code={isCode} 
>
<textarea></textarea>

<style>
    textarea {
        font-family: inherit;
        font-size: inherit;
        font-weight: inherit;
        color: inherit;
        flex-grow: 1;
        min-height: 10rem;
        resize: vertical;
    }
    textarea:not(.valid) {
        color: var(--red);
    }
    textarea.code {
        font-family: var(--mono);
        font-weight: bold;
    }

    .code-indicator {
        align-self: center;
    }
</style>