<script>
    import { Notebook, NotebookPage } from "$lib/utils/notebook";
    import Frame from "$lib/utils/Frame.svelte";
    import Panel from "$lib/utils/Panel.svelte";
    import AlertsOutput from "./outputs/AlertsOutput.svelte";

    import { current } from "./globals.svelte";
    import { setContext } from "svelte";
    import StdoutOutput from "./outputs/StdoutOutput.svelte";
    import PavloviaOutput from "./outputs/PavloviaOutput.svelte";
    import { electron } from "$lib/globals.svelte";

    setContext("current", current)

    // listen for messages from other windows
    if (electron) {
        // for opening files via another window
        electron.windows.listen("fileOpen", (evt, file) => current.files.push(file))
    }

</script>

<title>PsychoPy Runner</title>
<Frame
    rows={1} 
    cols={3}
>
    {#snippet ribbon()}
        <div></div>
    {/snippet}
    <Panel
        title=Files
        hspan={1}
        vspan={1}
    >
        
    </Panel>

    <Panel
        title=Output 
        hspan={2}
        vspan={1}
    >
        <Notebook>
            <NotebookPage
                label=Alerts
                bind:selected={
                    () => current.tab === "alerts",
                    (val) => {
                        if (val) {
                            current.tab = "alerts"
                        }
                    }
                }
            >
                <AlertsOutput />
            </NotebookPage>
            <NotebookPage
                label=Stdout
                bind:selected={
                    () => current.tab === "stdout",
                    (val) => {
                        if (val) {
                            current.tab = "stdout"
                        }
                    }
                }
            >
                <StdoutOutput />
            </NotebookPage>
            <NotebookPage
                label=Pavlovia
                bind:selected={
                    () => current.tab === "pavlovia",
                    (val) => {
                        if (val) {
                            current.tab = "pavlovia"
                        }
                    }
                }
            >
                <PavloviaOutput />
            </NotebookPage>
        </Notebook>
    </Panel>
</Frame>
