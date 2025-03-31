<script>
    import MenuPanel from '../utils/menu/Panel.svelte';
    import Menu from '../utils/menu/Menu.svelte';
    import MenuItem from '../utils/menu/Item.svelte';
    
    import { theme } from '../globals.js'
    import { experiment } from './globals.js';

    import { 
        // file
        file_open,
        // experiment
        toggle_pilot_mode,
        // views
        new_builder_frame,
        new_coder_frame,
        new_runner_frame,
    } from './callbacks.js'
</script>



<Menu id=menu-file label="File" icon="/icons/{$theme}/rbn-file.svg">
    <MenuItem icon="/icons/{$theme}/btn-new.svg" label="New file" />
    <MenuItem icon="/icons/{$theme}/btn-open.svg" label="Open file" on:click={file_open} />
    <MenuItem icon="/icons/{$theme}/btn-save.svg" label="Save file" disabled={$experiment === null} />
    <MenuItem icon="/icons/{$theme}/btn-saveas.svg" label="Save file as"/>   
</Menu>
<Menu id=edit label=Edit icon="/icons/{$theme}/rbn-edit.svg">
    <MenuItem icon="/icons/{$theme}/btn-undo.svg" label="Undo" />
    <MenuItem icon="/icons/{$theme}/btn-redo.svg" label="Redo" />
    <MenuItem icon="/icons/{$theme}/btn-find.svg" label="Find" />
</Menu>

<Menu id=experiment label=Experiment icon="/icons/{$theme}/rbn-experiment.svg">
    <MenuItem icon="/icons/{$theme}/btn-monitors.svg" label="Monitor centre" />        
    <MenuItem icon="/icons/{$theme}/btn-settings.svg" label="Experiment settings" />        
    {#if $experiment.pilotMode}
    <MenuItem icon="/icons/{$theme}/btn-sendpilot.svg" label="Send to runner" />
    {:else}
    <MenuItem icon="/icons/{$theme}/btn-sendrun.svg" label="Send to runner" />
    {/if}
</Menu>

<Menu id=desktop label=Desktop icon="/icons/{$theme}/rbn-desktop.svg">
    <MenuItem icon="/icons/{$theme}/btn-compilepy.svg" label="Compile to Python" />
    {#if $experiment.pilotMode}
    <MenuItem icon="/icons/{$theme}/btn-pilotpy.svg" label="Pilot in Python" />
    {:else}
    <MenuItem icon="/icons/{$theme}/btn-runpy.svg" label="Run in Python" />
    {/if}
</Menu>

<Menu id=browser label=Browser icon="/icons/{$theme}/rbn-browser.svg">
    <MenuItem icon="/icons/{$theme}/btn-compilejs.svg" label="Compile to JavaScript" />
    {#if $experiment.pilotMode}
    <MenuItem icon="/icons/{$theme}/btn-pilotjs.svg" label="Pilot in browser" />
    {:else}
    <MenuItem icon="/icons/{$theme}/btn-runjs.svg" label="Run in browser" />
    {/if}
    <MenuItem icon="/icons/{$theme}/btn-sync.svg" label="Sync to Pavlovia" />
</Menu>

<Menu id=views label=Views icon="/icons/{$theme}/rbn-windows.svg">
    <MenuItem  icon="/icons/{$theme}/btn-builder.svg" label="Builder view" on:click={new_builder_frame} />
    <MenuItem  icon="/icons/{$theme}/btn-coder.svg" label="Coder view" on:click={new_coder_frame} />
    <MenuItem icon="/icons/{$theme}/btn-runner.svg" label="Runner view" on:click={new_runner_frame} />
</Menu>


