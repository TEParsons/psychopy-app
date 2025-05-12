<script>
    import Dialog from "$lib/utils/dialog/Dialog.svelte";
    import { Notebook, NotebookPage } from '$lib/utils/notebook';
    import { get, writable } from "svelte/store";

    import NamedPage from "./Named.svelte";

    export let id;

    function applyChanges() {
        value.set(get(current))
    }

    function discardChanges() {
        return
    }
    

    export let handle;
    let notebook;

    let currentPage = writable()
    export let current = writable();
    export let value = writable();
</script>

<Dialog
    id={id} 
    title="Color picker" 
    bind:handle={handle} 
    buttons={{
        OK: applyChanges, 
        CANCEL: discardChanges
    }}
>
    <Notebook
        id={id}-notebook 
        bind:handle={notebook} 
    >
        <NotebookPage
            id={id}-space-named 
            activeTracker={currentPage} 
            title="Named"
        >
            <NamedPage 
                bind:selected={current}
            ></NamedPage>
        </NotebookPage>
    </Notebook>
</Dialog>