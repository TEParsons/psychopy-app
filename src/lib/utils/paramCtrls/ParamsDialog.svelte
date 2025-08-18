<script>
    import Dialog from "$lib/utils/dialog/Dialog.svelte";
    import { ParamsNotebook } from "$lib/utils/paramCtrls/index.js";

    let {
        /** @prop @type {import("$lib/experiment.svelte.js")<Component|StandaloneRoutine|LoopInitiator>} Element which this dialog edits */
        element,
        /** @bindable State controlling this dialog's visibility */
        shown=$bindable(),
        /** @prop @type {function} Function to execute when this dialog closes */
        onclose=(evt) => {}
    } = $props()

    let notebook;
    let valid = $state({})

    let btnsDisabled = $derived({
        OK: Object.values(valid).some(
            (val) => !val.state
        ),
        APPLY: Object.values(valid).some(
            (val) => !val.state
        )
    })

</script>


<Dialog 
    id="{element.name}-parameters"
    title="Editing: {element.name || element.tag}"
    bind:shown={shown} 
    onclose={onclose}
    onopen={() => notebook.setRestorePoint()}
    buttons={{
        OK: () => {}, 
        APPLY: () => notebook.setRestorePoint(), 
        CANCEL: () => notebook.applyRestorePoint(), 
        HELP: element.helpLink,
    }}
    buttonsDisabled={btnsDisabled}
>
    <ParamsNotebook 
        bind:this={notebook} 
        bind:valid={valid}
        element={element}
    ></ParamsNotebook>
</Dialog>