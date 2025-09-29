<script>
    import { CompactButton, Button } from "$lib/utils/buttons";
    import { getContext } from "svelte";
    import { python } from "$lib/globals.svelte";

    let {
        plugin,
        executable=$bindable()
    } = $props()

    let siblings = getContext("siblings")

    $effect(() => {
        if (siblings.selected === undefined) {
            siblings.selected = page
        }
    })

    function install(evt) {
        siblings.installed = python.install.package(plugin.pipname, executable.current).then(
            resp => python.install.getPackages(executable.current)
        );
    }
</script>

<div 
    class=plugin-item
    onclick={evt => siblings.selected = page}
    aria-role="button"
>
    <img class=plugin-avatar src={plugin.icon} alt={plugin.pipname} />
    <div class=plugin-name>{plugin.name}</div>
    <code class=plugin-pipname>{plugin.pipname}</code>
    {#await siblings.installed}
        ...
    {:then packages}
        {#if !Object.keys(packages).includes(plugin.pipname)}
            <CompactButton
                tooltip="Install"
                icon="icons/btn-download.svg"
                onclick={install}
            />
        {/if}
    {/await}
</div>

{#snippet page()}
    <div class=plugin-page>
        <div class=title>
            <img class=plugin-avatar src={plugin.icon} alt={plugin.pipname} />
            <a href="{plugin.homepage}" class=plugin-name>{plugin.name}</a>
            <code class=plugin-pipname>{plugin.pipname}</code>
            {#await siblings.installed}
                ...
            {:then packages}
                {#if !Object.keys(packages).includes(plugin.pipname)}
                    <Button
                        label="Install"
                        icon="icons/btn-download.svg"
                        onclick={install}
                        horizontal
                    />
                {/if}
            {/await}
        </div>
        {#each (plugin.description || "").split("\n") as line}
            <p>{line}</p>
        {/each}
    </div>
{/snippet}

<style>
    .plugin-item, .plugin-page .title {
        display: grid;
        grid-template-columns: [avatar] min-content [start] 1fr [button] min-content [end];
        grid-template-rows: [start] min-content 1fr [end];
        align-items: start;
        gap: 0 1rem;
        width: 100%;
    }

    .plugin-item {
        border: 1px solid var(--overlay);
        border-radius: .5rem;
        padding: 1rem;
        box-sizing: border-box;
    }

    .plugin-name {
        font-weight: bold;
        text-decoration: none;
        color: var(--text);
        font-size: 1.25rem;
        grid-column: start / end;
    }
    .plugin-item .plugin-name {
        font-size: 1.25rem;
    }
    .plugin-page .plugin-name {
        font-size: 2rem;
    }

    .plugin-pipname {
        grid-column: start / button;
    }

    .plugin-avatar {
        border-radius: .5rem;
        grid-row: start/ end;
    }
    .plugin-item .plugin-avatar {
        width: 4rem;
    }
    .plugin-page .plugin-avatar {
        width: 8rem;
    }

    .plugin-page {
        display: flex;
        flex-direction: column;
        align-items: start;
        gap: .5rem;
    }
</style>