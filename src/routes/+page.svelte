<script>
    import { theme } from "$lib/globals.js"

    function new_builder_frame() {
        window.open("../builder");
    }
    function new_coder_frame() {
        window.open("/coder");
    }
    function new_runner_frame() {
        window.open("/runner");
    }

    import { writable } from "svelte/store";
    let scratchOutput = writable("")
    function scratch(evt) {
        let output = "";

        scratchOutput.set(String(output))
    }
</script>

<div class=container>
    <nav>
        <button class=horizontal id="ribbon-btn-builder" on:click={new_builder_frame}>
            <img src="/icons/{$theme}/btn-builder.svg" alt="Builder view" />
            <label for="ribbon-btn-builder">Builder</label>
        </button>
        <button class=horizontal id="ribbon-btn-coder" on:click={new_coder_frame}>
            <img src="/icons/{$theme}/btn-coder.svg" alt="Builder view" />
            <label for="ribbon-btn-coder">Coder</label>
        </button>
        <button class=horizontal id="ribbon-btn-runner" on:click={new_runner_frame}>
            <img src="/icons/{$theme}/btn-runner.svg" alt="Builder view" />
            <label for="ribbon-btn-runner">Runner</label>
        </button>
    </nav>
    <div class=scratch>
        <textarea
            class=scratch-output
            readonly
            bind:value={$scratchOutput}
        ></textarea>
        <button
            class=scratch-btn
            on:click={scratch}
        >Scratch</button>
    </div>
</div>

<style>
.container {
    position: relative;
    width: 100%;
    height: 100%;
}
nav {
    position: relative;
    display: flex;
    flex-direction: row;
    margin: 4rem auto;
    gap: 2rem;
    justify-content: center;
}
nav button {
    position: relative;
    width: 8rem;
}
.scratch {
    position: relative;
    width: 1000px;
    margin: auto;
}
.scratch * {
    width: 100%;
}
.scratch-output {
    height: 600px;
}
</style>