<script>
    import { theme } from '../globals.js'
    import { pilot_mode, experiment, modified } from './globals.js';
    import { ExperimentFile } from './utils.js'
    import Ribbon from '../utils/ribbon/Ribbon.svelte'
    import RibbonSection from '../utils/ribbon/Section.svelte'
    import RibbonButton from '../utils/ribbon/Button.svelte'
    import RibbonSwitchButton from '../utils/ribbon/Switch.svelte'

    /* File */

    async function file_open() {
        // get file handle from system dialog
        let handle = await window.showOpenFilePicker({
            types: [{
                description: "PsychoPy Experiments",
                accept: {
                    "application/xml": [".psyexp"]
                }
            }]
        });
        // get file blob from handle
        let file = await handle[0].getFile();
        // load xml
        let xml_parser = new DOMParser()
        let document = xml_parser.parseFromString(await file.text(), "application/xml");
        // construct an Experiment object from the file
        let exp = new ExperimentFile(document)
        experiment.set(exp);
    }

    /* Edit */

    /* Experiment */

    function toggle_pilot_mode() {
        pilot_mode.set(!$pilot_mode)
    }

    /* Views */

    function new_builder_frame() {
        window.open("/builder");
    }
    function new_coder_frame() {
        window.open("/coder");
    }
    function new_runner_frame() {
        window.open("/runner");
    }

    
</script>

<Ribbon>
    <RibbonSection id=file label=File icon="/icons/{$theme}/rbn-file.png">
        <RibbonButton id="ribbon-btn-new" icon="/icons/{$theme}/btn-new.png" label="New file" />
        <RibbonButton id="ribbon-btn-open" icon="/icons/{$theme}/btn-open.png" label="Open file"on:click={file_open} />
        <RibbonButton id="ribbon-btn-save" icon="/icons/{$theme}/btn-save.png" label="Save file" disabled={$experiment === null} />
        <RibbonButton id="ribbon-btn-saveas" icon="/icons/{$theme}/btn-saveas.png" label="Save file as"/>        
    </RibbonSection>

    <RibbonSection id=edit label=Edit icon="/icons/{$theme}/rbn-edit.png">
        <RibbonButton id="ribbon-btn-undo" icon="/icons/{$theme}/btn-undo.png" label="Undo" disabled={!$modified} />
        <RibbonButton id="ribbon-btn-redo" icon="/icons/{$theme}/btn-redo.png" label="Redo" />
        <RibbonButton id="ribbon-btn-find" icon="/icons/{$theme}/btn-find.png" label="Find" />
    </RibbonSection>
    
    <RibbonSection id=experiment label=Experiment icon="/icons/{$theme}/rbn-experiment.png">
        <RibbonButton id="ribbon-btn-monitors" icon="/icons/{$theme}/btn-monitors.png" label="Monitor centre" />        
        <RibbonButton id="ribbon-btn-settings" icon="/icons/{$theme}/btn-settings.png" label="Experiment settings" />        
        <RibbonSwitchButton id="ribbon-btn-pilot-toggle" left=Pilot right=Run state={pilot_mode} on:click={toggle_pilot_mode} />        
        {#if $pilot_mode}
        <RibbonButton id="ribbon-btn-sendpilot" icon="/icons/{$theme}/btn-sendpilot.png" label="Send to runner" />
        {:else}
        <RibbonButton id="ribbon-btn-sendrun" icon="/icons/{$theme}/btn-sendrun.png" label="Send to runner" />
        {/if}
    </RibbonSection>

    <RibbonSection id=desktop label=Desktop icon="/icons/{$theme}/rbn-desktop.png">
        <RibbonButton id="ribbon-btn-compilepy" icon="/icons/{$theme}/btn-compilepy.png" label="Compile to Python" />
        {#if $pilot_mode}
        <RibbonButton id="ribbon-btn-pilotpy" icon="/icons/{$theme}/btn-pilotpy.png" label="Pilot in Python" />
        {:else}
        <RibbonButton id="ribbon-btn-runpy" icon="/icons/{$theme}/btn-runpy.png" label="Run in Python" />
        {/if}
    </RibbonSection>

    <RibbonSection id=browser label=Browser icon="/icons/{$theme}/rbn-browser.png">
        <RibbonButton id="ribbon-btn-compilejs" icon="/icons/{$theme}/btn-compilejs.png" label="Compile to JavaScript" />
        {#if $pilot_mode}
        <RibbonButton id="ribbon-btn-pilotjs" icon="/icons/{$theme}/btn-pilotjs.png" label="Pilot in browser" />
        {:else}
        <RibbonButton id="ribbon-btn-runjs" icon="/icons/{$theme}/btn-runjs.png" label="Run in browser" />
        {/if}
        <RibbonButton id="ribbon-btn-sync" icon="/icons/{$theme}/btn-sync.png" label="Sync to Pavlovia" />
    </RibbonSection>

    <RibbonSection id=pavlovia label=Pavlovia icon="/icons/{$theme}/rbn-pavlovia.png">
        ToddOST
        No project
    </RibbonSection>

    <RibbonSection gap></RibbonSection>

    <RibbonSection id=views label=Views icon="/icons/{$theme}/rbn-windows.png">
        <RibbonButton id="ribbon-btn-builder"  icon="/icons/{$theme}/btn-builder.png" label="Builder view" on:click={new_builder_frame} />
        <RibbonButton id="ribbon-btn-coder"  icon="/icons/{$theme}/btn-coder.png" label="Coder view" on:click={new_coder_frame} />
        <RibbonButton id="ribbon-btn-runner" icon="/icons/{$theme}/btn-runner.png" label="Runner view" on:click={new_runner_frame} />
    </RibbonSection>
</Ribbon>