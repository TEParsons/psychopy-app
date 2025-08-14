<script>
    import { mapping } from "./ctrls";
    import Tooltip from "$lib/utils/tooltip/Tooltip.svelte";
    import { setContext } from "svelte";

    let {
        name,
        param,
        /** @bindable State keeping track of whether this param's value is valid */
        valid=$bindable()
    } = $props();

    let ValueCtrl = $state.raw();
    if (param.inputType in mapping) {
        ValueCtrl = mapping[param.inputType]
    } else {
        ValueCtrl = mapping["single"]
    }

    // some ctrls need to be inline rather than underneath the label
    let inline = $derived(
        ["bool"].includes(param.inputType)
    )

    setContext("valid", valid)
</script>


<div 
    class=param-ctrl 
    id={name}
    style:grid-template-rows={inline ? "[label] min-content [ctrl]" : "[label] min-content [ctrl] auto"}
>
    <label 
        class=param-label 
        for={name}
        style:grid-column-start={inline ? "gap" : "label"}
        style:align-self={inline ? "center" : "end"}
    >
        {param.label ? param.label : name}
        {#if param.hint}
            <Tooltip>
                {param.hint}
            </Tooltip>
        {/if}
    </label>
    {#if param.allowedUpdates && param.allowedUpdates.length > 0}
        <select 
            class=param-updates 
            id="{name}-updates" 
            disabled={param.allowedUpdates.length == 1} 
            bind:value={param.updates}
        >
            {#each param.allowedUpdates as ud}
                <option value={ud}>{ud}</option>
            {/each}
        </select>
    {/if}
    <div 
        class="param-value"
        style:grid-row-start={inline ? "label" : "ctrl"}
        style:grid-column-end={inline ? "gap" : "end"}
    >
        <ValueCtrl 
            param={param}
        ></ValueCtrl>
    </div>
</div>

<style>
    .param-ctrl {
        display: grid;
        grid-template-columns: [label] max-content [gap] 1fr [updates] min-content [end];
        grid-gap: .5rem;
        align-items: center;
        min-width: 20rem;
        box-sizing: border-box;
    }
    .param-ctrl .param-label {
        position: relative;
        grid-row-start: label;
    }
    .param-ctrl .param-updates {
        grid-column-start: updates;
        grid-row-start: label;
    }

    .param-ctrl#name {
        grid-row-start: 1;
    }

    .param-value {
        grid-column-start: label;

        display: flex;
        gap: .5rem;
        flex-direction: row;
    }
</style>