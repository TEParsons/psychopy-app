<script>
    import { prefs } from "$lib/preferences.svelte";
    import ParamsDialog from "$lib/paramCtrls/ParamsDialog.svelte";

    let {
        shown=$bindable()
    } = $props()
</script>

{#await prefs.ready}
    Loading...
{:then}
    <ParamsDialog
        element={prefs}
        onapply={evt => prefs.save()}
        bind:shown={shown}
    />
{/await}