<script>
    import { CodeEditor } from "$lib/utils/code";

    let {
        /** @prop @type {import("$lib/experiment/experiment.svelte.js").Param} Param object to which this ctrl pertains */
        param=$bindable(),
        /** @bindable State tracking whether this param's value is valid */
        valid=$bindable(),
        /** @prop @type {boolean} Controls whether this control is disabled */
        disabled=false,
        /** @prop @type {Function} Function to check whether this param's value is valid */
        validate = (param) => true
    } = $props()


    $effect(() => {
        if (valid !== undefined) {
            valid.state = validate(param)
        }
    })

    let language = $derived(
        param.allowedVals ? param.allowedVals : "python"
    )

</script>
<div class=param-code-input-multi>
    <CodeEditor 
        bind:value={param.value}
        resize=vertical
        language={language}
        readonly={disabled}
    />
</div>

<style>
    .param-code-input-multi {
        position: relative;
        width: 100%;
        border: 1px solid var(--overlay);
        padding: .5rem;
    }
</style>