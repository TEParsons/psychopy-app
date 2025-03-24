<script>
    import RibbonButton from './Button.svelte';
    import RibbonSection from './Section.svelte';
    import MenuPanel from '../menu/Panel.svelte'
    import { theme } from '../../globals.js'
    import { passive } from 'svelte/legacy';

    export let disabled = false;

    export let menu;
    
    function open_menu() {
        menu.showModal()
    }

    
</script>
<RibbonSection id=ribbon-menu>
    <RibbonButton icon="/icons/{$theme}/btn-hamburger.svg" label="Menu" id="ribbon-menu" on:click={open_menu} disabled={disabled} />
    <MenuPanel bind:menu>
        <slot></slot>
    </MenuPanel>
</RibbonSection>