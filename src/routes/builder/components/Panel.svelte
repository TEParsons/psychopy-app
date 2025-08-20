<script>
    import ComponentButton from './ComponentButton.svelte';
    import ComponentSection from './Section.svelte';

    import ComponentProfiles from '$lib/components.json';
    import RoutineButton from './RoutineButton.svelte';
    import FilterDialog from './FilterDialog.svelte';
    import { CompactButton } from "$lib/utils/buttons";

    let sortedComponents = new Map();
    for (let [name, profile] of Object.entries(ComponentProfiles)) {
        // skip anything that isn't a Component or Routine
        if (!profile['__class__'].match(/psychopy\.experiment\.(components|routines).*/)) {
            continue
        }
        // mark base components as hidden
        if ([
            "BaseComponent", "BaseVisualComponent", "BaseDeviceComponent", "BaseStandaloneRoutine",
            "BaseValidator"
        ].includes(profile['__name__'])) {
            profile.hidden = true
        }
        // iterate through categories
        for (let categ of profile.categories) {
            // make sure category exists
            if (!sortedComponents.has(categ)) {
                sortedComponents.set(categ, [])
            }
            // append Component to categ
            sortedComponents.get(categ).push(profile)
        }
    }
    // define categ order
    let firstCategs = [
        "Stimuli", "Responses"
    ]
    let lastCategs = [
        "I/O", "Custom", "Other"
    ]
    let categOrder = firstCategs
    for (let categ of sortedComponents.keys()) {
        if (!firstCategs.includes(categ) && !lastCategs.includes(categ)) {
            categOrder.push(categ)
        }
    }
    categOrder = categOrder.concat(lastCategs)

    let showFilterDlg = $state.raw(false);
    let filter = $state()
</script>


<div id="components">
    <div class=ctrls>
        <div class=gap></div>
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
        {#each categOrder as categ}
            <ComponentSection label={categ}>
                {#each sortedComponents.get(categ) as comp}
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
        {/each}
    </div>
</div>

<style>
    .gap {
        flex-grow: 1;
    }
    .ctrls {
        padding: .5rem;
        display: flex;
        gap: .5rem;
        border-bottom: 1px solid var(--overlay);
    }
</style>