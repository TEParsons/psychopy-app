<script>
    import PluginItem from "./PluginItem.svelte";
    import { electron } from "$lib/globals.svelte";

    // todo: this will be a fetch call, but we need to setup cors on psychopy.org
    import plugins from "../plugins.json";
    import { setContext } from "svelte";
    import plugin from "@sveltejs/adapter-static";

    let children = $state({
        selected: undefined,
        installed: [],
        all: []
    });
    setContext("siblings", children)

    let searchterm = $state.raw("");
    let matches = $derived.by(() => {
        let output = [];
        for (let profile of plugins) {
            if (
                profile.name.includes(searchterm) ||
                profile.pipname.includes(searchterm) || 
                profile.description.includes(searchterm) || 
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
            <div class=plugins-list>
                {#each plugins as profile}
                    {#if matches.includes(profile.pipname)}
                        <PluginItem plugin={profile} />
                    {/if}
                {/each}
            </div>
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