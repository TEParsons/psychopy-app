<script>
    import ComponentButton from './ComponentButton.svelte';
    import ComponentSection from './Section.svelte';

    import ComponentProfiles from '$lib/components.json';

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
</script>


<div id="components">
    {#each categOrder as categ}
    <ComponentSection id={categ} label={categ}>
        {#each sortedComponents.get(categ) as comp}
        {#if comp['__class__'].startsWith("psychopy.experiment.components")}
        <ComponentButton component={comp}></ComponentButton>
        {/if}
        {/each}
    </ComponentSection>
    {/each}
</div>

<style>

</style>