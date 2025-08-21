<script>
    import ComponentButton from './ComponentButton.svelte';
    import ComponentSection from './Section.svelte';

    import ComponentProfiles from '$lib/components.json';
    import RoutineButton from './RoutineButton.svelte';
    import FilterDialog from './FilterDialog.svelte';
    import { CompactButton } from "$lib/utils/buttons";

    let components = $derived.by(() => {
        // object containing information derived from Components
        let output = {
            categs: {
                first: ["Stimuli", "Responses"],
                other: [],
                last: ["I/O", "Custom", "Other"]
            },
            sorted: {},
        };
        // iterate through all profiles
        for (let profile of Object.values(ComponentProfiles)) {
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
    });

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