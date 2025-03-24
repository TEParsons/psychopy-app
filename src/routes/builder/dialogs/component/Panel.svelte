<script>
    import { theme } from '../../../globals.js';
    import { StandaloneRoutine, Routine } from '../../experiment.js';
    import { experiment } from '../../globals.js';
    import Notebook from '../../../utils/notebook/Notebook.svelte';
    import NotebookPage from '../../../utils/notebook/Page.svelte';
    import { currentPage } from './globals.js';

    export let helpLink = undefined;
    export let component;


    function on_help() {
        window.open(helpLink, '_blank').focus();
    }

</script>

<Notebook id="{component.name}-params">
{#each [...component.sortedParams] as [categ, params]}
    <NotebookPage id="{component.name}-{categ}" title={categ} activeTracker={currentPage}>
    <div class=params-panel>
        {#each [...params] as [name, param]}
        <div class=param-ctrl id={name}>
            <label class=param-label for={name}>{name}</label>
            <div class=param-gap></div>
            <select class=param-updates id={name}-updates>
                <!-- todo: Get allowedUpdates from comp yaml -->
                <option>Constant</option>
                <option>Each repeat</option>
                <option>Each frame</option>
            </select>
            <input class=param-value type="text" value={param.value} />
        </div>
        {/each}
    </div>
    </NotebookPage>
{/each}
</Notebook>
{#if helpLink}
<button on:click={on_help} class=help-btn>Help</button>
{/if}


<style>
    .params-panel {
        display: grid;
        grid-auto-flow: row;
        grid-gap: 1rem;
        margin: auto;
        width: 45rem;
        padding: 1rem;
    }
    .param-ctrl {
        display: grid;
        grid-template-columns: [label] max-content [gap] auto [updates] min-content;
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
        grid-column-start: label;
        grid-row-start: label;
    }
    .param-ctrl .param-updates {
        grid-column-start: updates;
        grid-row-start: label;
    }
    .param-ctrl .param-value {
        grid-column-start: 0;
        grid-column-end: span 3;
        grid-row-start: ctrl;
    }
    button.help-btn:enabled:hover {
        background-color: var(--crust);
    }
</style>