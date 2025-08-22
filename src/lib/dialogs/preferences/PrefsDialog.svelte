<script>
    import { HasParams } from "$lib/experiment.svelte";
    import ParamsDialog from "$lib/utils/paramCtrls/ParamsDialog.svelte";

    let {
        shown=$bindable()
    } = $props()

    let element = new HasParams("Preferences")
</script>

<ParamsDialog
    element={element}
    bind:shown={shown}
></ParamsDialog>