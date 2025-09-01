<script>
    import ParamCtrl from "./ParamCtrl.svelte";
    import StartStopCtrl from "./StartStopCtrl.svelte";
    import { Notebook, NotebookPage } from "$lib/utils/notebook"
    import { getContext } from "svelte";

    let {
        element,
        /** @prop @type {array<string>} List of param names not to show */
        hideParams=[],
        /** @bindable State keeping track of whether each param's value is valid */
        valid=$bindable(),
    } = $props();

    let pageIndex = $state()
</script>

<div class=params-container>
    <!-- pre-notebook params -->
    <div 
        class=uncategorised-params-panel
    >
        {#if element.sortedParams.uncategorised}
            {#each Object.entries(element.sortedParams.uncategorised) as [name, param]}
                {#if ![...hideParams].includes(name)}
                    <ParamCtrl 
                        name={name} 
                        param={param}
                        bind:valid={valid[name]}
                    ></ParamCtrl>
                {/if}
            {/each}
        {/if}
    </div>
    <!-- notebook -->
    <Notebook>
        {#each Object.entries(element.sortedParams) as [categ, params]}
            {#if !Object.keys(params).every(
                (value) => hideParams.includes(value)
            ) && categ !== "uncategorised"}
                <NotebookPage
                    label={categ}
                    data={element}
                    bind:selected={
                        () => {return pageIndex === categ},
                        (value) => {pageIndex = categ}
                    }
                >
                    <div class=params-panel>
                        <!-- start ctrl, if needed -->
                        {#if "startVal" in params}
                            <StartStopCtrl
                                name=Start
                                params={element.startParams}
                            ></StartStopCtrl>
                        {/if}
                        <!-- stop ctrl, if needed -->
                        {#if "stopVal" in params}
                            <StartStopCtrl
                                name=Stop
                                params={element.stopParams}
                            ></StartStopCtrl>
                        {/if}
                        <!-- other params -->
                        {#each Object.entries(params) as [name, param]}
                            {#if !["startVal", "startType", "startEstim", "stopVal", "stopType", "durationEstim", ...hideParams].includes(name)}
                                <ParamCtrl 
                                    name={name} 
                                    param={param}
                                    bind:valid={valid[name]}
                                ></ParamCtrl>
                            {/if}
                        {/each}
                    </div>
                </NotebookPage>
            {/if}
        {/each}
    </Notebook>
</div>

<style>
    .params-panel {
        display: grid;
        grid-auto-flow: row;
        align-content: start;
        gap: 1rem;
        width: 45rem;
        box-sizing: border-box;
        padding: 1rem;
    }
    .uncategorised-params-panel {
        display: grid;
        grid-auto-flow: row;
        align-content: start;
        gap: .5rem;
        width: 100%;
        z-index: 3;
    }
    .params-container {
        padding: 1rem;
        height: 100%;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
</style>
