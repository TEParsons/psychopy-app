<script>
    import TableCtrl from "./TableCtrl.svelte";

    let {
        /** @prop @type {import("$lib/experiment/experiment.svelte.js").Param} Param object to which this ctrl pertains */
        param,
        /** @prop @type {boolean} Controls whether this control is disabled */
        disabled=false,
        /** @bindable State controlling whether this param's value is valid */
        valid=$bindable(),
        /** @prop @type {Function} Function to check whether this param's value is valid */
        validate = (param) => [true, undefined],
    } = $props()

    let conditions = $derived.by(() => {
        // placeholder: Conditions should be read in by Python for consistency
        return ""
    })
</script>

<div class=wrapper>
    <TableCtrl
        param={param}
        disabled={disabled}
        validate={validate}
        bind:valid={valid}
    ></TableCtrl>
    <div class=output>
        {conditions}
    </div>
</div>

<style>
    .wrapper {
        flex-grow: 1;
        display: grid;
        grid-template-columns: 1fr min-content min-content;
        grid-template-rows: min-content min-content;
        gap: .5rem;
    }
</style>