<script>
    import { Notebook, NotebookPage } from "$lib/utils/notebook"
    import Panel from "./Panel.svelte"

    /** @prop @type {import("$lib/experiment").Component|import("$lib/experiment").StandaloneRoutine|import("$lib/experiment").LoopInitiator} Element whose params to represent */
    export let element;
    /** @public @type {import("$lib/experiment").ParamsArray} Temporary params linked to each ctrl */
    export let params = element.params.copy()

    export function discardChanges(evt) {
        // reset params from component to discard any live changes
        params = element.params.copy()
    }

    export function applyChanges(evt) {
        // apply params to component
        element.params = params.unsorted
    }

</script>

<Notebook
    data={element}
>
    {#each [...element.params.sorted] as [categ, params]}
    <NotebookPage
        label={categ}
        data={element}
    >
        <Panel
            params={params}
        ></Panel>
    </NotebookPage>
    {/each}
</Notebook>
