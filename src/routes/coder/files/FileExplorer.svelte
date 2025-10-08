<script>
    import { TreeCtrl } from "$lib/utils/tree";
    import { electron } from "$lib/globals.svelte";
    import { getContext } from "svelte";
    import DirCtrl from "./DirCtrl.svelte";

    let current = getContext("current")

    let directory = $state({
        promise: undefined,
        error: undefined,
        path: undefined,
        files: []
    })

    function transformTree(files) {
        let nodes = {
            folders: [],
            files: []
        }
        // iterate through files
        for (let file of files) {
            // process into a tree node
            let node = {
                label: file.relpath,
                data: file
            }
            // if file has children (i.e. is a directory), recur
            if ("children" in file) {
                node.children = transformTree(file.children)
            }
            // append
            nodes["children" in file ? "folders" : "files"].push(node)
        }

        return [...nodes.folders, ...nodes.files]
    }

    let tree = $derived(transformTree(directory.files))

    // start off with home directory
    electron.paths.documents().then(
        resp => setPath(resp)
    )

    function setPath(value) {
        directory.path = value;
        directory.promise = electron.files.scandir(value);
        directory.promise.then(
            resp => directory.files = resp
        ).catch(
            err => directory.error = err
        )
    }
</script>

<div class=file-explorer>
    <DirCtrl 
        onchange={setPath}
        bind:value={directory.path}
    />

    {#await directory.promise}
        <div>Scanning files...</div>
    {:then}
        <TreeCtrl 
            data={tree} 
            onactivate={(evt, handle, data) => current.openFile(data.abspath, data.relpath)}
        />
    {:catch}
        <div>Failed to scan files: {directory.error}</div>
    {/await}
</div>

<style>
    .file-explorer {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        height: 100%;
        background-color: var(--base);
    }
</style>