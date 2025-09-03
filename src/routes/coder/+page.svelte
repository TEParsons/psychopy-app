<script>
    import { Notebook, NotebookPage } from "$lib/utils/notebook";
    import CodeEditor from "$lib/utils/code/CodeEditor.svelte";

    let pages = $state({
        current: undefined,
        all: {
            "untitled.py": "for n in y:\n    print(n)"
        }
    })

</script>

<Notebook>
    {#each Object.keys(pages.all) as name}
        <NotebookPage
            label={name}
        >
            <CodeEditor
                theme=psychopy-light
                bind:value={pages.all[name]}
            ></CodeEditor>
        </NotebookPage>
    {/each}
</Notebook>