<script>
    import ParamCtrl from "./Ctrl.svelte";
    import StartStopCtrl from "./StartStopCtrl.svelte";
    import { Notebook, NotebookPage } from "$lib/utils/notebook"
    import { HasParams } from "$lib/experiment.svelte.js";
    import { getContext, onMount } from "svelte";

    let {
        element,
    } = $props();

    let temp = $state(new HasParams(element.tag));

    let current = getContext("current")

    export function discardChanges(evt) {
        // reset temp params from component to discard any live changes
        for (let key of Object.keys(element.params)) {
            // make sure temp array has this param
            if (!(key in temp.params)) {
                temp.params[key] = element.params[key].copy()
            }
            // assign values
            temp.params[key].val = element.params[key].val
            temp.params[key].updates = element.params[key].updates
        }
    }

    export function applyChanges(evt) {
        // update history
        current.experiment.history.update();
        // set component params from temp to apply any live changes
        for (let key of Object.keys(temp.params)) {
            // assign values
            element.params[key].val = temp.params[key].val
            element.params[key].updates = temp.params[key].updates
        }
    }

    onMount(discardChanges)

    let pageIndex = $state()

</script>

<div class=params-container>
    <Notebook>
        {#each Object.entries(temp.sortedParams) as [categ, params]}
            <NotebookPage
                label={categ}
                data={temp}
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
                            params={temp.startParams}
                        ></StartStopCtrl>
                    {/if}
                    <!-- stop ctrl, if needed -->
                    {#if "stopVal" in params}
                        <StartStopCtrl
                            name=Stop
                            params={temp.stopParams}
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
    .params-container {
        padding: 1rem;
        height: 100%;
        box-sizing: border-box;
    }
</style>
