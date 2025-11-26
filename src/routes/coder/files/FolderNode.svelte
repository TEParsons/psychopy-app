<script>
    import FolderNode from "./FolderNode.svelte"
    import { TreeBranch, TreeNode } from "$lib/utils/tree"
    import { parsePath } from "$lib/utils/files"
    import path from "path-browserify"
    import { getContext } from "svelte";

    let {
        value
    } = $props();

    let fileIcons = {
        // todo: file icons
    }

    let current = getContext("current")

    function selectFile(evt, data) {
        // iterate through open pages
        for (let [i, page] of Object.entries(current.pages)) {
            // if page shows the given file...
            if (page.file === data) {
                // ...navigate to it
                current.tab = parseInt(i)
                // return true so we know we hit something
                return true
            }
        }
    }

    function openFile(evt, data) {
        // if file is already open, navigate to it
        if (selectFile(evt, data)) {
            return
        }
        // otherwise, open it
        current.openFile(data)
    }
    
    
</script>

<TreeBranch
    label={parsePath(value || "").name}
>
    {#await electron.files.scandir(value)}
        Scanning...
    {:then files}
        {#each files as file}
            {#await electron.files.stat(
                path.join(value, file)
            ) then stat}
                {#if stat.isDirectory}
                    <FolderNode
                        value={path.join(value, file)}
                    />
                {:else}
                    <TreeNode 
                        label={file}
                        icon={fileIcons[parsePath(file || "").ext] || "/icons/btn-new.svg"}
                        data={path.join(value, file)}
                        onselect={selectFile}
                        onactivate={openFile}
                    />
                {/if}
            {:catch err}
                <TreeNode 
                    label="Protected file"
                    disabled
                />
            {/await}
        {/each}
    {:catch err}
        <TreeNode 
            label="Could not access files"
            disabled
        />
    {/await}
</TreeBranch>