<script>
    import { marked } from "marked";
    import { getContext } from "svelte";
    var decoder = new TextDecoder();

    let {
        name,
        installed=$bindable()
    } = $props()

    let siblings = getContext("siblings");

    $effect(() => {
        if (siblings.selected === undefined) {
            siblings.selected = page
        }
    })
</script>

{#snippet page()}
    {#await fetch(`https://pypi.org/pypi/${name}/json`).then(resp => resp.json())}
        Loading...
    {:then profile}
        <h2><code>{name}</code></h2>
        <div class=package-desc>
            {@html marked(profile.info.description)}
        </div>
        {console.log(profile)}
    {:catch err}
        Failed to fetch information about {name}: {err}
    {/await}
{/snippet}

<button 
    class=package-item
    class:installed={installed}
    class:selected={siblings.selected === page}
    onclick={evt => siblings.selected = page}
>
    {name}
</button>

<style>
    .package-item {
        border: 1px solid var(--overlay);
        border-radius: .5rem;
        padding: .5rem;
        text-align: left;
        box-sizing: border-box;
        background-color: var(--mantle);
    }
    .package-item.selected {
        border: 1px solid var(--blue);
    }
    .package-item.installed {
        background-color: var(--base)
    }

    .package-desc {
        position: relative;
        border: 1px solid var(--overlay);
        padding: 1rem;
        border-radius: .5rem;
        overflow-x: hidden;
        word-wrap: break-word;
    }
</style>
