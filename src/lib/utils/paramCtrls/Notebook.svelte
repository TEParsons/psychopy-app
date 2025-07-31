<script>
    import ParamCtrl from "./Ctrl.svelte";
    import StartStopCtrl from "./StartStopCtrl.svelte";
    import { Notebook, NotebookPage } from "$lib/utils/notebook"

    let {
        element,
    } = $props();

    let tempParams = $state(
        $state.snapshot(element.sortedParams)
    );

    export function discardChanges(evt) {
        // reset params from component to discard any live changes
        tempParams = $state.snapshot(element.sortedParams);
    }

    export function applyChanges(evt) {
        for (let categ in tempParams) {
            for (let [name, param] of Object.entries(tempParams[categ])) {
                element.params[name] = param
            }
        }
    }

</script>

<Notebook
    data={element}
>
    {#each [...Object.entries(tempParams)] as [categ, params]}
        <NotebookPage
            label={categ}
            data={element}
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
                {#each [...Object.entries(params)] as [name, param]}
                    {#if !["startVal", "startType", "startEstim", "stopVal", "stopType", "durationEstim"].includes(name)}
                        <ParamCtrl 
                            name={name} 
                            param={param}
                        ></ParamCtrl>
                    {/if}
                {/each}
            </div>
        </NotebookPage>
    {/each}
</Notebook>

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
