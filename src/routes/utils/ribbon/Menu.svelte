<script>
    import RibbonButton from './Button.svelte';
    import RibbonSection from './Section.svelte';
    import { theme } from '../../globals.js'
    import { passive } from 'svelte/legacy';

    export let disabled = false;

    function open_menu() {
        document.getElementById("frame-menu").hidden = false;
        document.getElementById("frame-menu-filter").style.display = "block";
    }
</script>
<RibbonSection id=ribbon-menu>
    <RibbonButton icon="/icons/{$theme}/btn-hamburger.svg" label="Menu" id="ribbon-menu" on:click={open_menu} disabled={disabled} />
</RibbonSection>