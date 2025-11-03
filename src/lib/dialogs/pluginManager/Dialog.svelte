<script>
    import { Notebook, NotebookPage } from "$lib/utils/notebook";
    import { Dialog } from "$lib/utils/dialog";
    import PluginsPanel from "./plugins/PluginsPanel.svelte";
    import PackagesPanel from "./packages/PackagesPanel.svelte";
    import { python } from "$lib/globals.svelte"

    let {
        shown=$bindable()
    } = $props();

    let pages = $state({
        current: undefined
    });

    let executable = $state({
        default: undefined,
        current: undefined
    })
    python.details().then(resp => {
        executable.default = resp.executable;
        executable.current = resp.executable;
    })
</script>


<Dialog
    id=plugin-mgr
    title="Plugins & packages"
    buttons={{
        OK: evt => {}
    }}
    bind:shown={shown}
>
    <div class=container>
        <div class=environment-ctrl>
            Python environment:
            <select bind:value={executable.current}>
                {#await python.uv.getEnvironments()}
                    <option>
                        Scanning Python environments...
                    </option>
                {:then environments}
                    {#each Object.entries(environments) as [label, details]}
                        <option value={details.executable}>
                            {label}
                            {#if details.executable === executable.default}
                            (default)
                            {/if}
                        </option>
                    {/each}
                {:catch err}
                    <option>{err}</option>
                {/await}
                
            </select>
        </div>
        <Notebook>
            <NotebookPage
                label="Plugins"
                bind:selected={
                    () => pages.current === "plugins",
                    value => pages.current = "plugins"
                }
            >
                <PluginsPanel bind:executable={executable} />
            </NotebookPage>
            <NotebookPage
                label="Packages"
                bind:selected={
                    () => pages.current === "packages",
                    value => pages.current = "packages"
                }
            >
                <PackagesPanel bind:executable={executable} />
            </NotebookPage>
        </Notebook>
    </div>
</Dialog>

<style>
    .container {
        display: grid;
        grid-template-rows: min-content 1fr;
        height: 100%;
        gap: 1rem;
        padding: 1rem;
        box-sizing: border-box;
        align-items: stretch;
    }
    .environment-ctrl {
        display: flex;
        flex-direction: column;
    }
</style>