<script>
    import { Notebook, NotebookPage } from "$lib/utils/notebook";
    import { Dialog } from "$lib/utils/dialog";
    import Plugins from "./plugins/PluginsPanel.svelte"

    let {
        shown=$bindable()
    } = $props();

    let pages = $state({
        current: undefined
    });

</script>


<Dialog
    id=plugin-mgr
    title="Plugins & packages"
    buttons={{
        OK: evt => {}
    }}
    bind:shown={shown}
>
    <Notebook>
        <NotebookPage
            label="Plugins"
            bind:selected={
                () => pages.current === "plugins",
                value => pages.current = "plugins"
            }
        >
            <Plugins />
        </NotebookPage>
        <NotebookPage
            label="Packages"
            bind:selected={
                () => pages.current === "packages",
                value => pages.current = "packages"
            }
        >
            
        </NotebookPage>
    </Notebook>
</Dialog>