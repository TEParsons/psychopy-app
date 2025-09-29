<script>
    import ComponentButton from './ComponentButton.svelte';
    import ComponentSection from './Section.svelte';

    import ComponentProfiles from '$lib/experiment/components.json';
    import RoutineButton from './RoutineButton.svelte';
    import FilterDialog from './FilterDialog.svelte';
    import { CompactButton } from "$lib/utils/buttons";
    import { PluginManagerDlg } from "$lib/dialogs/pluginManager"
    import { electron, python } from "$lib/globals.svelte";

    let profiles = $state({
        promise: undefined,
        error: undefined,
        all: {},
    })

    function loadComponents(evt) {
        if (python) {
            // request profiles from Python
            profiles.promise = python.liaison.send({
                command: "run",
                args: ["psychopy.experiment:getElementProfiles"]
            }, 10000)
            // store response on success
            profiles.promise.then(
                data => profiles.all = data
            )
            // store error on fail
            profiles.promise.catch(
                err => profiles.error = err
            )
        } else {
            // if in web-only mode, use stored profiles
            profiles.all = ComponentProfiles
        }
    }
    // load once on init
    loadComponents()   

    let components = $derived.by(() => {
        let output = {
            categs: {
                first: ["Stimuli", "Responses"],
                other: [],
                last: ["I/O", "Custom", "Other"]
            },
            sorted: {}
        }
        // iterate through all profiles
        for (let profile of Object.values(profiles.all)) {
            // skip...
            if (
                // ...anything that isn't a Component or Routine
                !profile['__class__'].match(/psychopy\.experiment\.(components|routines).*/) ||
                // ...base elements
                profile['__class__'].match(/psychopy\.experiment\.(components|routines)\._?base:.*/) ||
                // ...hidden elements
                profile.hidden
            ) {
                continue
            }
            // iterate through categories
            for (let categ of profile.categories) {
                // make sure categ exists in order
                if (!Object.values(output.categs).flat().includes(categ)) {
                    output.categs.other.push(categ)
                }
                // make sure category exists in sorted comps object
                if (!(categ in output.sorted)) {
                    output.sorted[categ] = []
                }
                // append Component to categ
                output.sorted[categ].push(profile)
            }
        }

        return output
    })

    let showFilterDlg = $state.raw(false);
    let showPluginMgr = $state.raw(false);
    let filter = $state()
</script>
<div id="components">
    <div class=ctrls>
        <CompactButton
            icon="icons/btn-add.svg"
            tooltip="Get more..."
            onclick={evt => showPluginMgr = true}
        />
        <PluginManagerDlg 
            bind:shown={showPluginMgr}
        />
        <CompactButton
            icon="icons/btn-refresh.svg"
            tooltip="Reload Components"
            onclick={loadComponents}
        />
        <CompactButton
            icon="icons/btn-filter.svg"
            tooltip="Filter..."
            onclick={(evt) => showFilterDlg = true}
        />
        <FilterDialog
            bind:filter={filter}
            bind:shown={showFilterDlg}
        ></FilterDialog>
    </div>
    <div class=components>
        {#await profiles.promise}
            <div class=message>Loading Components...</div>
        {:then}
            {#each [components.categs.first, components.categs.other, components.categs.last].flat() as categ}
                {#if components.sorted[categ] && components.sorted[categ].length}
                    <ComponentSection label={categ}>
                        {#each components.sorted[categ] as comp}
                            {#if filter === undefined || filter.every((value) => comp.targets.includes(value))}
                                {#if comp['__class__'].startsWith("psychopy.experiment.components")}
                                    <ComponentButton 
                                        component={comp}
                                    ></ComponentButton>
                                {:else}
                                    <RoutineButton 
                                        component={comp}
                                    ></RoutineButton>
                                {/if}
                            {/if}
                        {/each}
                    </ComponentSection>
                {/if}
            {/each}
        {:catch}
            <div class="message error">
                <div>
                    Failed to load Components. 
                </div>
                <pre>
                    {#each String(profiles.error).split(",") as line}
                        <code>{line}</code>
                    {/each}
                </pre>
            </div>
        {/await}
    </div>
</div>



<style>
    .ctrls {
        padding: .5rem;
        display: flex;
        gap: .5rem;
        border-bottom: 1px solid var(--overlay);
        justify-content: end;
    }

    .message {
        margin: 1rem;
        white-space: wrap;
    }
    .error {
        color: var(--red);
    }

    pre {
        white-space: wrap;
        word-break: break-all;
        border: 1px solid var(--crust);
        background: var(--base);
        border-radius: .5rem;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: .5rem;
    }
</style>