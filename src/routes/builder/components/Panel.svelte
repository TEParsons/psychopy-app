<script>
    import ComponentButton from './Button.svelte';
    import ComponentSection from './Section.svelte';
</script>


<div id="components">
    <ComponentSection id=stimuli label="Stimuli">
        <ComponentButton component=ImageComponent></ComponentButton>
        <ComponentButton component=SoundComponent></ComponentButton>
        <ComponentButton component=TextComponent></ComponentButton>
    </ComponentSection>
    <ComponentSection id=responses label="Responses">
        <ComponentButton component=SliderComponent></ComponentButton>
        <ComponentButton component=MouseComponent></ComponentButton>
    </ComponentSection>
</div>

<style>

</style>