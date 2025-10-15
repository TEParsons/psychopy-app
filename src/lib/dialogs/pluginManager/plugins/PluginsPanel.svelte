<script>
    import PluginItem from "./PluginItem.svelte";
    import { electron, python } from "$lib/globals.svelte";
    import { onMount, setContext, untrack } from "svelte";

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

    function matches(term, profile) {
        return (
            profile.name.toLowerCase().includes(term.toLowerCase()) ||
            profile.pipname.toLowerCase().includes(term.toLowerCase()) || 
            profile.description.toLowerCase().includes(term.toLowerCase()) || 
            profile.keywords.includes(term) ||
            term === ""
        )
    }

</script>


{#await fetch("/api/plugins").then(resp => resp.json())}
    Getting plugins...
{:then plugins}
    <div class=plugins-ctrl>
        <div class=plugin-list-ctrl>
            <input type=search bind:value={searchterm} />
            {#await python.install.getPackages(executable.current)}
                <div class=message>Checking installed...</div>
            {:then installed}
                <div class=plugins-list>
                    {#each plugins.sort(
                        // installed packages at the top
                        (x, y) => +Object.keys(installed).includes(y.pipname) - +Object.keys(installed).includes(x.pipname)
                    ) as profile}
                        {#if matches(searchterm, profile)}
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
{:catch}
    <div class=message>Failed</div>
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