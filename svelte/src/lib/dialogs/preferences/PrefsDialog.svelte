<script>
    import { HasParams } from "$lib/experiment/experiment.svelte";
    import ParamsDialog from "$lib/paramCtrls/ParamsDialog.svelte";

    let {
        shown=$bindable()
    } = $props()

    let element = new HasParams("Preferences")
</script>

<ParamsDialog
    element={element}
    bind:shown={shown}
></ParamsDialog>