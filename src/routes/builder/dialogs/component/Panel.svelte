<script>
    import { theme } from '../../../globals.js';
    import { StandaloneRoutine, Routine } from '../../experiment.js';
    import { experiment } from '../../globals.js';
    import Notebook from '../../../utils/notebook/Notebook.svelte';
    import NotebookPage from '../../../utils/notebook/Page.svelte';
    import { currentPage } from './globals.js';
    import { sortParams } from '../../experiment.js';
    import { writable } from 'svelte/store';

    export let helpLink = undefined;
    export let component;

    let tempParams = writable(component.copyParams())

    function on_help() {
        window.open(helpLink, '_blank').focus();
    }

    function discardChanges() {
        // reset temp params from component to discard any live changes
        tempParams.set(component.copyParams())
    }

    function applyChanges() {
        // apply temporary params to component
        component.params = $tempParams
    }

    let notebook;
</script>

<Notebook id="{component.name}-params" handle={notebook}>

{#each [...sortParams($tempParams)] as [categ, params]}
    <NotebookPage id="{categ}" title={categ} activeTracker={currentPage}>
    <div class=params-panel>
        {#each [...params] as [name, param]}
        <div class=param-ctrl id={name}>
            <label class=param-label for={name}>{name}</label>
            <div class=param-gap></div>
            {#if param.allowedUpdates !== null && param.allowedUpdates.length > 0}
            <select class=param-updates id={name}-updates disabled={param.allowedUpdates.length == 1}>
                {#each param.allowedUpdates as ud}
                <option value={ud}>{ud}</option>
                {/each}
            </select>
            {/if}
            <input class=param-value type="text" bind:value={param.val} />
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
        padding: .5rem 0;
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