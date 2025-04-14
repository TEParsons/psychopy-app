<script>
    import { theme } from "$lib/globals.js";
    import { StandaloneRoutine, Routine } from '$lib/experiment.js';
    import { experiment } from '../../builder/globals.js';
    import Notebook from '$lib/utils/notebook/Notebook.svelte';
    import NotebookPage from '$lib/utils/notebook/Page.svelte';
    import { currentPage } from './globals.js';
    import { sortParams } from '$lib/experiment.js';
    import { writable } from 'svelte/store';
    import ParamCtrl from './ParamCtrl.svelte';

    export let component;
    export let tempParams;

    let notebook;
</script>

<Notebook id="{component.name}-params" handle={notebook}>
{#each [...$tempParams] as [categ, params]}
    <NotebookPage id="{categ}" title={categ} activeTracker={currentPage}>
    <div class=params-panel>
        {#each [...params] as [name, param]}
        <ParamCtrl name={name} param={param}></ParamCtrl>
        {/each}
    </div>
    </NotebookPage>
{/each}
</Notebook>


<style>
    .params-panel {
        display: grid;
        grid-auto-flow: row;
        grid-gap: 1rem;
        width: 45rem;
        padding: 1rem;
    }
    
    button.help-btn:enabled:hover {
        background-color: var(--crust);
    }
</style>