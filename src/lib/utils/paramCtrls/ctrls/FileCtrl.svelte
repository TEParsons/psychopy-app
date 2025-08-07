<script>
    import { theme } from "$lib/globals.svelte.js";
    import SingleLineCtrl from "./SingleLineCtrl.svelte"
    import { Button, ParamCtrlButton } from "$lib/utils/buttons"

    let {
        /** @prop @type {import("$lib/experiment.svelte.js").Param} Param object to which this ctrl pertains */
        param,
        /** @prop @type {Function} Function to check whether this param's value is valid */
        validate = (param) => true,
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
/>
<ParamCtrlButton 
    icon="/icons/{theme}/btn-open.svg"
    tooltip="Browse for file..."
    onclick={getFile}
/>
