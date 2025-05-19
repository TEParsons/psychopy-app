<script>
    import ParamCtrl from "./Ctrl.svelte";
    import StartStopCtrl from "./StartStopCtrl.svelte";
    /** @prop @type {import("$lib/experiment.js").ParamsArray} Params to represent*/
    export let params;
</script>

<div class=params-panel>
    <!-- start ctrl, if needed -->
    {#if Object.values(params.startParams).some((val) => val !== null)}
    <StartStopCtrl
        name=Start
        params={params.startParams}
    ></StartStopCtrl>
    {/if}
    <!-- stop ctrl, if needed -->
    {#if Object.values(params.stopParams).some((val) => val !== null)}
    <StartStopCtrl
        name=Stop
        params={params.stopParams}
    ></StartStopCtrl>
    {/if}
    <!-- other params -->
    {#each [...params] as [name, param]}
    {#if !["startVal", "startType", "startEstim", "stopVal", "stopType", "durationEstim"].includes(name)}
    <ParamCtrl 
        name={name} 
        param={param}
    ></ParamCtrl>
    {/if}
    {/each}
</div>

<style>
    .params-panel {
        display: grid;
        grid-auto-flow: row;
        align-content: start;
        grid-gap: .5rem;
        width: 45rem;
        box-sizing: border-box;
        padding: 1rem;
    }
</style>
