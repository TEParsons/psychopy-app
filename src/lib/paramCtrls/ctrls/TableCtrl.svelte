<script>
    import { CompactButton } from "$lib/utils/buttons";
    import FileCtrl from "./FileCtrl.svelte";

    let {
        /** @prop @type {import("$lib/experiment/experiment.svelte.js").Param} Param object to which this ctrl pertains */
        param,
        /** @prop @type {boolean} Controls whether this control is disabled */
        disabled=false,
        /** @interface */
        ...attachments
    } = $props()

    function validateTable(valid) {}

    function openTable() {
        // placeholder: How do I open Excel from Svelte? 
    }

</script>


<FileCtrl
    param={param}
    disabled={disabled}
    {@attach element => param.registerValidator("table", validateTable, -5)}
    {...attachments}
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