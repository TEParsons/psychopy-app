<script>
    import { CompactButton } from "$lib/utils/buttons";
    import FileCtrl from "./FileCtrl.svelte";

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

    function openTable() {
        // placeholder: How do I open Excel from Svelte? 
    }

</script>


<FileCtrl
    param={param}
    validate={validate}
    bind:valid={valid}
    disabled={disabled}
></FileCtrl>
<CompactButton
    icon="/icons/btn-table.svg"
    tooltip="{param.val ? "Open" : "Create"} table"
    onclick={openTable}
    disabled={disabled || (
        param.val && (
            String(param.val).startsWith("$")
        )
    )}
></CompactButton>