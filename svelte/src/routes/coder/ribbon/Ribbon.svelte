<script>
    import {
        // file
        file_new,
        file_open,
        file_save,
        file_save_as,
        // experiment
    } from './callbacks.js'
    
    import { Ribbon, RibbonSection, RibbonGap } from '$lib/utils/ribbon';
    import { getContext } from "svelte";
    import { IconButton, } from '$lib/utils/buttons';
    import { UserCtrl } from '$lib/pavlovia/pavlovia.svelte';

    let current = getContext("current");

    let show = $state({
    })
</script>

<Ribbon>
    <RibbonSection label=File icon="icons/rbn-file.svg">
        <IconButton 
            icon="icons/btn-new.svg" 
            label="New file" 
            onclick={file_new}
            borderless
        /> 
        <IconButton 
            icon="icons/btn-open.svg" 
            label="Open file" 
            onclick={file_open} 
            borderless
        />
        <IconButton 
            icon="icons/btn-save.svg" 
            label="Save file" 
            onclick={file_save}
            borderless
        />
        <IconButton 
            icon="icons/btn-saveas.svg" 
            label="Save file as"
            onclick={file_save_as} 
            borderless
        />
    </RibbonSection>

    <RibbonSection label=Edit icon="icons/rbn-edit.svg">
        <IconButton 
            icon="icons/btn-undo.svg" 
            label="Undo"
            onclick={() => current.pages[current.tab].editor.getModel().undo()} 
            disabled={!(current.pages[current.tab] && current.pages[current.tab].canUndo)} 
            borderless
        />
        <IconButton 
            icon="icons/btn-redo.svg" 
            label="Redo" 
            onclick={() => current.pages[current.tab].editor.getModel().redo()} 
            disabled={!(current.pages[current.tab] && current.pages[current.tab].canRedo)} 
            borderless
        />
        <IconButton 
            icon="icons/btn-find.svg" 
            label="Find" 
            onclick={(evt) => current.pages[current.tab].editor.trigger(
                "find", 
                "editor.actions.findWithArgs", 
                { 
                    searchString: ""
                }
            )}
            borderless
        />
    </RibbonSection>

    <RibbonSection label=Pavlovia icon="icons/rbn-pavlovia.svg">
        <UserCtrl />
    </RibbonSection>

    <RibbonGap></RibbonGap>

    <RibbonSection label=Views icon="icons/rbn-windows.svg">
        <IconButton 
            icon="icons/btn-builder.svg" 
            label="Builder view" 
            onclick={(evt) => window.open("/builder")} 
            borderless
        />
        <IconButton 
            icon="icons/btn-coder.svg" 
            label="Coder view" 
            onclick={(evt) => window.open("/coder")} 
            borderless
        />
        <IconButton 
            icon="icons/btn-runner.svg" 
            label="Runner view" 
            onclick={(evt) => window.open("/runner")} 
            borderless
        />
    </RibbonSection>
</Ribbon>