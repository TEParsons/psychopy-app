<script>
    import { theme } from "$lib/globals.svelte";
    import { ToggleButton } from "$lib/utils/buttons";
    import { Dialog } from "$lib/utils/dialog"
    import { ParamsDialog } from "$lib/utils/paramCtrls";
    import Routine from "../../builder/flow/Routine.svelte";
    import { current } from "../../builder/globals.svelte";

    let {
        /** @bindable @type {Boolean} State dictating whether this dialog is shown */
        shown=$bindable(),
        /** @interface */
        children=undefined
    } = $props();

    let useRegex = $state(false)
    let caseSensitive = $state(false)
    let searchTerm = $state("");

    let results = $derived(
        current.experiment.search(searchTerm, useRegex, caseSensitive)
    )

    let dialog = $state({
        shown: false,
        element: undefined
    });

</script>

<Dialog
    id=find-in-experiment
    title="Find in experiment..."
    buttons={{
        OK: (evt) => {},
    }}
    bind:shown={shown}
>
    <div class=container>
        <div
            class=find-ctrls
        >
            <input 
                type=text 
                placeholder="Search..."
                class=search-bar
                bind:value={searchTerm}
            >
            <ToggleButton 
                bind:value={useRegex} 
                icon="/icons/{theme}/btn-regex.svg"
                tooltip="Use RegEx syntax"
            />
            <ToggleButton 
                bind:value={caseSensitive} 
                icon="/icons/{theme}/btn-case.svg"
                tooltip="Use case-sensitive searching"
            />
        </div>
        <div class=results-list>
            {#each results as result}
            <div
                class=result-item
            >
                <div class=item-breadcrumbs>
                    {#if result.breadcrumbs.loop}
                        <button 
                            class=breadcrumb
                            onclick={(evt) => {
                                // open loop dialog
                                dialog.element = result.breadcrumbs.loop
                                dialog.shown = true
                                // close this dialog
                                shown = false;
                            }}
                        >{result.breadcrumbs.loop.name}</button>
                    {/if}
                    {#if result.breadcrumbs.routine}
                        <button 
                            class=breadcrumb
                            onclick={(evt) => {
                                // navigate to routine
                                current.routine = result.breadcrumbs.routine
                                // close this dialog
                                shown = false;
                            }}
                        >{result.breadcrumbs.routine.name}</button>
                    {/if}
                    {#if result.breadcrumbs.component}
                        >
                        <button 
                            class=breadcrumb
                            onclick={(evt) => {
                                // navigate to routine
                                current.routine = result.breadcrumbs.component.routine
                                // open component dialog
                                dialog.element = result.breadcrumbs.component
                                dialog.shown = true
                                // close this dialog
                                shown = false;
                            }}
                        >{
                            ["RoutineSettingsComponent", "SettingsComponent"].includes(result.breadcrumbs.component.tag)
                            ? "settings"
                            : result.breadcrumbs.component.name
                        }</button>
                    {/if}
                    {#if result.breadcrumbs.param}
                        > {result.breadcrumbs.param.name}
                    {/if}
                </div>
                <div class=item-content>{result.text.before}<b>{result.text.text}</b>{result.text.after}</div>
            </div>
            {/each}
        </div>
    </div>
    {@render children?.()}
</Dialog>

<!-- dialog to view results -->
{#if dialog.element}
    <ParamsDialog 
        element={dialog.element}
        onclose={() => dialog.element = undefined}
        bind:shown={dialog.shown} 
    />
{/if}

<style>
    @import url("$lib/utils/buttons/button.css");

    .find-ctrls {
        display: flex;
        flex-wrap: nowrap;
        margin: 1rem;
        gap: .5rem;
    }
    .search-bar {
        flex-grow: 1;
        min-width: 30rem;
    }
    .results-list {
        display: flex;
        flex-direction: column;
        gap: .5rem;
        margin: 1rem;
    }
    .result-item {
        padding: .5rem 1rem;
        border-radius: .5rem;
        border: 1px solid var(--overlay);
        background-color: var(--base);
        display: grid;
        grid-template-columns: auto;
        grid-template-rows: [breadcrumbs] min-content [content] min-content [end];
    }
    .result-item .item-breadcrumbs {
        grid-row-start: breadcrumbs;

        display: flex;
        flex-direction: row;
        gap: .5rem;
        margin: .5rem 0;
        align-items: center;
    }

    .result-item .item-content {
        font-family: var(--mono);
        padding: .5rem;
        margin: .5rem;
        border-left: 1px solid var(--blue);
        text-align: left;
    }
    .result-item .item-content b {
        font-family: var(--mono);
    }

    .breadcrumb {
        padding: .25rem .5rem;
    }
</style>