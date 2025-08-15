<script>
    import { Param } from "$lib/experiment.svelte";
    import { theme } from "$lib/globals.svelte";
    import { CompactButton } from "$lib/utils/buttons";
    import { iterateName } from "./utils.js";
    import SingleLineCtrl from "./SingleLineCtrl.svelte";

    let {
        param,
        /** @prop @type {boolean} Controls whether this control is disabled */
        disabled=false,
        valid=$bindable()
    } = $props()
    
    // make sure param val is always an object rather than a string
    $effect(() => {
        if (typeof param.val === "string") {
            // sanitize value
            let value = String(param.val).replaceAll(
                // identify key:value pairs with single quotes
                /'(.*?)': *'(.*?)'/g, 
                (_, key, val) => {
                    // escape any double quotes inside the key and value
                    key = key.replaceAll(
                        /(?<!\\)"/g,
                        "\\\""
                    )
                    val = val.replaceAll(
                        /(?<!\\)"/g,
                        "\\\""
                    )
                    // return the key:value pair with double quotes (i.e. JSON friendly)
                    return `"${key}": "${val}"`
                }
            )
            // parse JSON
            try {
                param.val = JSON.parse(value)
            } catch {
                console.warn(`Failed to parse '${value}' as JSON`)
                param.val = {}
            }
        }
    })

    let entries = $derived.by(() => {
        let entries = []
        // make a param for each entry
        for (let [key, val] of Object.entries(param.val)) {
            entries[key] = new Param(`${key}:value`);
            entries[key].val = val;
            entries[key].valType = "code"
        }
        
        return Object.entries(entries)
    })
    

    let entriesValid = $state({})
    
    $effect(() => {
        for (let [key, val] of entries) {
            if (!(key in entriesValid)) {
                entriesValid[key] = {
                    state: true,
                    warning: undefined
                }
            }
        }
    })

    $effect(() => {
        valid.state = Object.values(entriesValid).every(
            (val) => val.state
        )
        valid.warning = Object.values(entriesValid).map(
            (val) => val.warning
        ).flat()[0]
    })

</script>

<div class=dict-ctrl-layout>
    {#each entries as [label, value]}
        <input
            bind:value={
                () => label,
                (value) => {
                    // iterate name to avoid duplication
                    while (value in param.val) {
                        value = iterateName(value)
                    }
                    // get keys and values in param val
                    let keys = Object.keys(param.val);
                    let values = Object.values(param.val)
                    // switch out name
                    keys[keys.indexOf(label)] = value;
                    // clear param val
                    param.val = {}
                    // apply new key:value pairs
                    for (let i in keys) {
                        param.val[keys[i]] = values[i]
                    };
                }
            }
            disabled={disabled}
        />
        <span
            class=dict-ctrl-label
        >
            :
        </span>
        <SingleLineCtrl
            param={value}
            codeIndicator={false}
            disabled={disabled}
            bind:valid={entriesValid[label]}
        />
        <CompactButton
            icon="/icons/{theme}/btn-delete.svg"
            onclick={(evt) => {
                delete param.val[label]
            }}
            disabled={disabled}
            tooltip="Remove item"
        />
    {/each}
    <div class=gap></div>
    <div class=gap></div>
    <div class=gap></div>
    <CompactButton
        icon="/icons/{theme}/btn-add.svg"
        onclick={(evt) => {
            // enumerate field name to avoid duplication
            let key = "field";
            while (key in param.val) {
                key = iterateName(key)
            }
            // add field
            param.val[key] = "\"default\"";
        }}
        tooltip="Add item"
        disabled={disabled}
    />
</div>

<style>
    .dict-ctrl-layout {
        flex-grow: 1;
        display: grid;
        grid-template-columns: [key] auto [colon] min-content [value] auto [delete] min-content;
        gap: .5rem;
    }
    .dict-ctrl-label {
        align-self: center;
        justify-self: end;
        font-family: var(--mono);
        color: var(--outline)
    }
</style>