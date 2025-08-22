<script>
    import SingleLineCtrl from "./SingleLineCtrl.svelte"
    import { Button, CompactButton } from "$lib/utils/buttons"

    let {
        /** @prop @type {import("$lib/experiment.svelte.js").Param} Param object to which this ctrl pertains */
        param,
        /** @prop @type {boolean} Controls whether this control is disabled */
        disabled=false,
        /** @bindable State tracking whether this param's value is valid */
        valid=$bindable(),
        /** @prop @type {Function} Function to check whether this param's value is valid */
        validate = (param) => [true, ""],
    } = $props()

    async function getFile(evt) {
        // do we have mime types from the param?
        let types = []
        if (Array.isArray(param.allowedVals) && Array.isArray(param.allowedLabels) && param.allowedVals.length === param.allowedLabels.length) {
            for (let i in param.allowedVals) {
                types.push({
                    description: param.allowedLabels[i],
                    accept: param.allowedVals[i]
                })
            }
        }
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
    param={param} 
    validate={validate}
    bind:valid={valid}
    disabled={disabled}
/>
<CompactButton 
    icon="icons/btn-open.svg"
    tooltip="Browse for file..."
    onclick={getFile}
    disabled={disabled}
/>
