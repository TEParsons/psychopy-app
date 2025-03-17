<script>
    import Notebook from '../../utils/notebook/Notebook.svelte';
    import NotebookPage from '../../utils/notebook/Page.svelte';
    import RoutineCanvas from './Canvas.svelte';
    import { pilot_mode, experiment } from '../globals.js';

</script>


<Notebook id=routine-notebook>
    {#if $experiment !== null}
    {#each Array.from($experiment.routines.keys()) as name}
    <NotebookPage id={name} title={name}>
        <RoutineCanvas name={name} />
    </NotebookPage>
    {/each}
    {/if}
</Notebook>