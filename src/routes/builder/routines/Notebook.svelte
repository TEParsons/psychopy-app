<script>
    import Notebook from '../../utils/notebook/Notebook.svelte';
    import NotebookPage from '../../utils/notebook/Page.svelte';
    import RoutineCanvas from './Canvas.svelte';
    import { experiment } from '../globals.js';
    import { currentPage } from './globals.js';
    import { onMount, onDestroy } from 'svelte';

    onMount(() => {
        // get notebook object on mount
        let notebook = document.getElementById("routine-notebook")
        // set initial active tab to be first page
        if (notebook?.children[0]) {
            currentPage.set(notebook?.children[0].htmlFor);
        }
    })

</script>


<Notebook id=routine-notebook>
    {#if $experiment !== null}
    {#each Array.from($experiment.routines.keys()) as name}
    <NotebookPage id={name} title={name} activeTracker={currentPage}>
        <RoutineCanvas name={name} />
    </NotebookPage>
    {/each}
    {/if}
</Notebook>