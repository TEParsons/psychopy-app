<script>
    import SingleLineCtrl from "./SingleLineCtrl.svelte"
    import { Button, CompactButton } from "$lib/utils/buttons"
    import { mimeTypesFromParam } from "./utils";

    let {
        /** @prop @type {import("$lib/experiment/experiment.svelte.js").Param} Param object to which this ctrl pertains */
        param=$bindable(),
        /** @prop @type {boolean} Controls whether this control is disabled */
        disabled=false,
        /** @bindable State tracking whether this param's value is valid */
        valid=$bindable(),
        /** @interface */
        ...attachments
    } = $props()

    function validateFile(valid) {
        // check file extension
        if (this.allowedVals) {
            if (!param.allowedVals.some(
                val => String(this.val).endsWith(val)
            )) {
                valid.value = false
                valid.warning = `Did not match allowed filetypes: ${this.allowedVals}`
            }
        }
        // todo: Check if file exists
    }

    async function getFile(evt) {
        // do we have mime types from the param?
        let types = mimeTypesFromParam(param)
        // get file handle from system dialog
        let handle = await window.showOpenFilePicker({
            types: types
        });
        // get file blob from handle
        let file = await handle[0].getFile();
        // get name from blob
        param.val = file.name
    }
</script>

<SingleLineCtrl 
    bind:param={param} 
    bind:valid={valid}
    disabled={disabled}
    {@attach element => param.registerValidator("file", validateFile, 5)}
    {...attachments}
/>
<CompactButton 
    icon="/icons/btn-open.svg"
    tooltip="Browse for file..."
    onclick={getFile}
    disabled={disabled}
/>
