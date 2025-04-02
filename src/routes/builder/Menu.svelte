<script>  
    import { theme } from '../globals.js'
    import { experiment } from './globals.js';
    import RibbonButton from '../utils/ribbon/Button.svelte';
    import Menu from '../utils/menu/Menu.svelte';
    import Item from '../utils/menu/Item.svelte';
    import SubMenu from '../utils/menu/SubMenu.svelte';

    let menu;

    import { 
        // file
        file_new,
        file_open,
        file_save,
        file_save_as,
        // experiment
        toggle_pilot_mode,
        // views
        new_builder_frame,
        new_coder_frame,
        new_runner_frame,
        
    } from './callbacks.js'
    import { changeHistory } from './history.js';
</script>

<RibbonButton 
    id=ribbon-menu 
    icon="/icons/{$theme}/btn-hamburger.svg"
    label="Menu"
    on:click={() => menu.setOpen(true)} 
/>
<Menu 
    bind:menu={menu}
>
    <SubMenu label="File" icon="/icons/{$theme}/rbn-file.svg">
        <Item 
            id="ribbon-btn-new" 
            icon="/icons/{$theme}/btn-new.svg" 
            label="New file" 
            action={file_new}
            closemenu={menu} 
        />
        <Item 
            id="ribbon-btn-open" 
            icon="/icons/{$theme}/btn-open.svg" 
            label="Open file" 
            action={file_open} 
            closemenu={menu} 
        />
        <Item 
            id="ribbon-btn-save" 
            icon="/icons/{$theme}/btn-save.svg" 
            label="Save file" 
            action={file_save} 
            closemenu={menu} 
            disabled={!$changeHistory.length} 
        />
        <Item 
            id="ribbon-btn-saveas" 
            icon="/icons/{$theme}/btn-saveas.svg" 
            label="Save file as"
            action={file_save_as} 
            closemenu={menu} 
        />
    </SubMenu>

    
</Menu>
