<script>
    import { Param } from "$lib/experiment/experiment.svelte";
    import { CompactButton } from "$lib/utils/buttons";
    import { iterateName } from "./utils.js";
    import { sanitizeJSON } from "$lib/utils/transpiler"
    import FileCtrl from "./FileCtrl.svelte";

    let {
        param,
        /** @prop @type {boolean} Controls whether this control is disabled */
        disabled=false,
        valid=$bindable()
    } = $props()
    
    // make sure param val is always a list rather than a string
    $effect(() => {
        if (typeof param.val === "string") {
            // sanitize value
            let value = sanitizeJSON(param.val)
            // parse JSON
            try {
                param.val = JSON.parse(value)
            } catch {
                console.warn(`Failed to parse '${value}' as JSON`)
                param.val = []
            }
        }
    })

    let items = $derived.by(() => {
        let items = []
        // make a param for each entry
        for (let [i, val] of Object.entries(param.val)) {
            let item = new Param(`${param.name}:${i}`)
            item.val = val;
            item.valType = "str"
            items.push(item)
        }
        
        return items
    })
    

    let itemsValid = $state([])

    $effect(() => {
        valid.state = itemsValid.every(
            (val) => val.state
        )
        valid.warning = itemsValid.map(
            (val) => val.warning
        ).flat()[0]
    })

</script>

<div class=list-ctrl-layout>
    {#each Object.entries(items) as [i, item]}
        <FileCtrl
            param={item}
            disabled={disabled}
            bind:valid={itemsValid[i]}
        />
        <CompactButton
            icon="icons/btn-delete.svg"
            onclick={(evt) => {
                param.val.splice(i, 1)
            }}
            disabled={disabled}
            tooltip="Remove item"
        />
    {/each}
    <div class=gap></div>
    <div class=gap></div>
    <CompactButton
        icon="icons/btn-add.svg"
        onclick={(evt) => {
            // add item
            param.val.push("");
        }}
        tooltip="Add item"
        disabled={disabled}
    />
</div>

<style>
    .list-ctrl-layout {
        flex-grow: 1;
        display: grid;
        grid-template-columns: [value] auto [browse] min-content [delete] min-content;
        gap: .5rem;
    }
</style>