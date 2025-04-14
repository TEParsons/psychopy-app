<script>
    import { mapping } from "./ctrls/inputTypes.js";
    import Tooltip from "$lib/utils/tooltip/Tooltip.svelte";
    import { theme } from "$lib/globals.js";
    export let name
    export let param

    let ValueCtrl;
    if (param.inputType in mapping) {
        ValueCtrl = mapping[param.inputType]
    } else {
        ValueCtrl = mapping["single"]
    }
</script>


<div class=param-ctrl id={name}>
    <label class=param-label for={name}>
        {param.label ? param.label : name}
        {#if param.hint}
        <Tooltip>
            {param.hint}
        </Tooltip>
        {/if}
    </label>
    
    <div class=param-gap></div>
    {#if param.allowedUpdates !== null && param.allowedUpdates.length > 0}
    <select class=param-updates id={name}-updates disabled={param.allowedUpdates.length == 1} bind:value={param.updates}>
        {#each param.allowedUpdates as ud}
        <option value={ud}>{ud}</option>
        {/each}
    </select>
    {/if}
    <ValueCtrl param={param}></ValueCtrl>
</div>

<style>
    .param-ctrl {
        display: grid;
        grid-template-columns: [before] min-content [label] max-content [gap] auto [updates] min-content [end];
        grid-template-rows: [label] min-content [ctrl] auto;
        grid-gap: .5rem;
        align-items: end;
        min-width: 20rem;
    }
    .param-ctrl .param-gap {
        grid-column-start: gap;
        grid-row-start: label;
    }
    .param-ctrl .param-label {
        position: relative;
        grid-column-start: label;
        grid-row-start: label;
        align-content: end;
    }
    .param-ctrl .param-updates {
        grid-column-start: updates;
        grid-row-start: label;
    }
</style>