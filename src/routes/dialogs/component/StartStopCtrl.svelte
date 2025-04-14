<script>
    import ChoiceCtrl from "./ctrls/ChoiceCtrl.svelte";
    import SingleLineCtrl from "./ctrls/SingleLineCtrl.svelte";
    import Tooltip from "$lib/utils/tooltip/Tooltip.svelte";

    export let name;
    export let valueParam = null;
    export let typeParam = null;
    export let expectedParam = null;
</script>

<div class=start-stop-ctrl id={name}>
    <label class=param-label for={name}>
        {name}
        {#if valueParam !== null && valueParam.hint}
        <Tooltip>
            {valueParam.hint}
        </Tooltip>
        {/if}
    </label>
    <div class=param-gap></div>
    {#if typeParam !== null}
    <div class=param-type>
        {#if typeParam.hint}
        <Tooltip>
            {typeParam.hint}
        </Tooltip>
        {/if}
        <select disabled={typeParam.allowedVals.length == 1} bind:value={typeParam.val}>
            {#each typeParam.allowedVals as val}
            <option value={val} selected={typeParam.val === val}>{val}</option>
            {/each}
        </select>
    </div>
    {/if}
    {#if valueParam !== null}
    <input class=param-value type="text" bind:value={valueParam.val} />
    {/if}
    {#if expectedParam !== null}
    <label class=param-estim-label for="{name}-type">{expectedParam.label}</label>
    <input class=param-estim type="text" bind:value={expectedParam.val} id="{name}-type" />
    {/if}
</div>

<style>
    .start-stop-ctrl {
        display: grid;
        grid-template-columns: [before] min-content [label] min-content [ctrl] auto [end];
        grid-template-rows: [label] min-content [ctrl] auto [estim] auto;
        grid-gap: .5rem;
        align-items: end;
        min-width: 20rem;
    }

    .start-stop-ctrl .param-label {
        position: relative;
        grid-column-start: label;
        grid-row-start: label;
        align-content: end;
    }
    .start-stop-ctrl .param-gap {
        grid-column-start: ctrl;
        grid-column-end: end;
        grid-row-start: label;
    }
    .start-stop-ctrl .param-type {
        position: relative;
        grid-column-start: label;
        grid-row-start: ctrl;
    }
    .start-stop-ctrl .param-type select {
        width: 100%;
        min-width: 8rem;
    }
    .start-stop-ctrl .param-value {
        grid-column-start: ctrl;
        grid-row-start: ctrl;
    }
    .start-stop-ctrl .param-estim-label {
        position: relative;
        grid-column-start: label;
        grid-row-start: estim;
        align-self: center;
        justify-self: end;
        padding: 0 .5rem;
        white-space: nowrap;
        opacity: 50%;
    }
    .start-stop-ctrl .param-estim {
        grid-column-start: ctrl;
        grid-row-start: estim;
    }
</style>