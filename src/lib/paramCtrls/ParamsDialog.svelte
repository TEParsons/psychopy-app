<script>
    import Dialog from "$lib/utils/dialog/Dialog.svelte";
    import { ParamsNotebook } from "$lib/paramCtrls/index.js";

    let {
        /** @prop @type {import("$lib/experiment.svelte.js")<Component|StandaloneRoutine|LoopInitiator>} Element which this dialog edits */
        element,
        /** @bindable State controlling this dialog's visibility */
        shown=$bindable(),
        /** @prop @type {function} Function to execute when this dialog closes */
        onclose=(evt) => {}
    } = $props()

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
    onopen={() => element.restore.set()}
    buttons={{
        OK: () => {}, 
        APPLY: () => element.restore.set(), 
        CANCEL: () => element.restore.apply(), 
        HELP: element.helpLink,
    }}
    buttonsDisabled={btnsDisabled}
>
    <ParamsNotebook 
        bind:valid={valid}
        element={element}
    ></ParamsNotebook>
</Dialog>