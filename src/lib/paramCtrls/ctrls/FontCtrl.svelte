<script>
    import SingleLineCtrl from "./SingleLineCtrl.svelte";
    import { python } from "$lib/globals.svelte";
    import path from "path-browserify";
    import { getContext } from "svelte";
    import { CompactButton } from "$lib/utils/buttons";

    let {
        /** @prop @type {import("$lib/experiment/experiment.svelte.js").Param} Param object to which this ctrl pertains */
        param=$bindable(),
        /** @prop @type {boolean} Controls whether this control is disabled */
        disabled=false,
        /** @interface */
        ...attachments
    } = $props()

    let current = getContext("current");
    $inspect(param.valid)

    // if Python is available, initialise a font manager
    let manager = Promise.withResolvers();
    if (python) {
        // setup manager
        python.liaison.send({
            command: "init",
            args: [
                "fontManager", "psychopy.tools.fontmanager:FontManager"
            ]
        }, 10000)
        .then(
            name => manager.resolve(name)
        ).catch(
            err => manager.reject(err)
        )
        // get font families from manager
        manager.promise.then(
            name => {
                python.liaison.send({
                    command: "run",
                    args: [
                        `${name}.getFontFamilyNames`
                    ]
                }, 5000).then(
                    resp => families = resp.map(val => val.toLowerCase().replace(" ", ""))
                ).catch(
                    err => families = undefined
                )
            }
        )
    } else {
        // if not, reject promise
        manager.reject(undefined)
    }

    let families = $state.raw(undefined)

    function validateFont(valid) {
        if (families === undefined) {
            // do nothing if we don't have family information
            return
        }
        // is the current value known to PsychoPy?
        console.log(families)
        if (!families.includes(String(param.val).toLowerCase().replace(" ", ""))) {
            valid.value = false
            valid.warning = `Font '${param.val}' is not installed. Click the download button to try to install it.`
        }
        
    }
</script>

<SingleLineCtrl
    bind:param={param}
    disabled={disabled}
    {@attach element => param.registerValidator("font", validateFont, 5)}
    {...attachments}
/>
<CompactButton 
    icon="/icons/btn-download.svg"
    tooltip="Open font manager"
    awaiting={manager.promise}
/>