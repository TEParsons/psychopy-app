<script>
    import { theme } from "$lib/globals.svelte.js";
    import SingleLineCtrl from "./SingleLineCtrl.svelte"

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
</script>

<SingleLineCtrl 
    param={param} 
    validate={validate}
    checkCode={checkCode}
    codeIndicator={codeIndicator}
/>
<button 
    icon="/icons/{theme}/btn-open.svg" 
    on:click={getFile}
/>
