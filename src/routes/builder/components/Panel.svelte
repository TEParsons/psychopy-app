<script>
    import ComponentButton from './Button.svelte';
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
</script>


<div id="components">
    {#each [...sortedComponents] as [categ, components]}
    <ComponentSection id={categ} label={categ}>
        {#each components as comp}
        <ComponentButton component={comp}></ComponentButton>
        {/each}
    </ComponentSection>
    {/each}
</div>

<style>

</style>