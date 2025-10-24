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

    // stores lists of found fonts from Python
    let fonts = $state({
        system: [],
        packaged: [],
        user: [],
        experiment: []
    })
    // stores promises which resolve when a source has been scanned
    let scanning = $state({
        system: Promise.resolve(true),
        packaged: Promise.resolve(true),
        user: Promise.resolve(true),
        experiment: Promise.resolve(true)
    });

    if (python) {
        // iterate through different font sources
        for (let [key, method] of [
            ["system", "getSystemFonts"],
            ["packaged", "getPackagedFonts"],
            ["user", "getUserFonts"]
        ]) {
            // scan for fonts
            scanning[key] = python.liaison.send(
                {
                    command: "run",
                    args: [
                        `psychopy.tools.fontmanager:FontFinder.${method}`
                    ]
                }, 
                1000
            ).then(
                resp => fonts[key].push(...Object.keys(resp))
            ).catch(
                err => console.error(err)
            )
        }
    }

    // scan for fonts in experiment folder whenever it changes
    $effect(() => {
        // clear experiment fonts
        fonts.experiment.length = 0
        // get folder
        let expFolder = path.dirname(current.experiment.filename.replaceAll("\\", "/"))
        console.log(expFolder)
        // search in fonts and assets/fonts subfolders
        if (expFolder) {
            scanning.experiment = python.liaison.send(
                {
                    command: "run",
                    args: [
                        `psychopy.tools.fontmanager:FontFinder.getFolderFonts`,
                        [
                            path.join(expFolder, "fonts"),
                            path.join(expFolder, "assets", "fonts")
                        ],
                        false
                    ]
                }, 
                1000
            ).then(
                resp => fonts.experiment.push(...Object.keys(resp))
            ).catch(
                err => console.error(err)
            ) 
        }
    })
    

    let installed = $derived.by(() => {
        let found = false
        // iterate through sources
        for (let source of Object.values(fonts)) {
            // check each name
            for (let name of source) {
                // does it (in lowercase with no spaces) match the param (in the same)?
                if (
                    name.toLowerCase().replaceAll(" ", "") === String(param.val).toLowerCase().replaceAll(" ", "")
                ) {
                    found = true
                }
            }
        }

        return found
    })

    function validateFont(valid) {
        // vary the warning according to whether we're on local
        if (!installed) {
            if (python) {
                valid.warning = `Font '${param.val}' is not installed. Try installing it via the Font Manager.`
            } else {
                valid.warning = `Font '${param.val}' is not web safe.`
            }
        }
        
    }
</script>

<SingleLineCtrl
    bind:param={param}
    disabled={disabled}
    {@attach element => param.registerValidator("font", validateFont, 5)}
    {...attachments}
/>
{#if python}
    <CompactButton 
        icon="/icons/btn-download.svg"
        tooltip="Open font manager"
        awaiting={Promise.all(Object.values(scanning))}
    />
    <!-- todo: Add font manager dialog -->
{/if}