<script>
    import PluginItem from "./PluginItem.svelte";
    import { electron, python } from "$lib/globals.svelte";

    // todo: this will be a fetch call, but we need to setup cors on psychopy.org
    import plugins from "../plugins.json";
    import { setContext, untrack } from "svelte";

    let {
        executable=$bindable()
    } = $props()

    let children = $state({
        selected: undefined,
        installed: {},
        all: []
    });
    setContext("siblings", children)

    $effect(() => {
        if (executable.current) {
            children.installed = python.install.getPackages(executable.current)
        }
    })

    let searchterm = $state.raw("");
    let matches = $derived.by(() => {
        let output = [];
        for (let profile of plugins) {
            if (
                profile.name.toLowerCase().includes(searchterm.toLowerCase()) ||
                profile.pipname.toLowerCase().includes(searchterm.toLowerCase()) || 
                profile.description.toLowerCase().includes(searchterm.toLowerCase()) || 
                profile.keywords.includes(searchterm) ||
                searchterm === ""
            ) {
                output.push(profile.pipname)
            }
        }
        return output

    })
</script>


{#await plugins}
    <div class=message>
        Loading plugins...
    </div>
{:then plugins}
    <div class=plugins-ctrl>
        <div class=plugin-list-ctrl>
            <input type=search bind:value={searchterm} />
            {#await python.install.getPackages(executable.current)}
                Scanning...
            {:then installed}
                <div class=plugins-list>
                    {#each plugins.sort(
                        // installed packages at the top
                        (x, y) => +Object.keys(installed).includes(y.pipname) - +Object.keys(installed).includes(x.pipname)
                    ) as profile}
                        {#if matches.includes(profile.pipname)}
                            <PluginItem 
                                plugin={profile} 
                                installed={Object.keys(installed).includes(profile.pipname)}
                                bind:executable={executable} 
                            />
                        {/if}
                    {/each}
                </div>
            {:catch}
                Failed
            {/await}
    
            
        </div>
        <div class=selected-plugin>
            {@render children.selected?.()}
        </div>
    </div>
{:catch err}
    <div class=message>
        Failed to load plugins:
        <pre>
            {#each String(err).split("\n") as line}
            <code>{line}</code>
            {/each}
        </pre>
    </div>
{/await}


<style>
    .message {
        width: 45rem;
        padding: 1rem;
    }

    .plugins-ctrl {
        position: relative;
        display: grid;
        grid-template-columns: 25rem 45rem;
        height: 100%;
        gap: 1rem;
        padding: 1rem;
        box-sizing: border-box;
    }

    .plugin-list-ctrl {
        display: grid;
        grid-template-rows: min-content 1fr;
        gap: 1rem;
        height: 100%;
        overflow-y: auto;
    }

    .plugins-list, .selected-plugin {
        padding: .5rem;
        box-sizing: border-box;
        overflow-y: auto;
    }

    .plugins-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
</style>