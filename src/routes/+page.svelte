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
</script>

<div class=container>
    <button class=horizontal id="ribbon-btn-builder" onclick={new_builder_frame}>
        <img src="/icons/{$theme}/btn-builder.svg" alt="Builder view" />
        <label for="ribbon-btn-builder">Builder</label>
    </button>
    <button class=horizontal id="ribbon-btn-coder" onclick={new_coder_frame}>
        <img src="/icons/{$theme}/btn-coder.svg" alt="Builder view" />
        <label for="ribbon-btn-coder">Coder</label>
    </button>
    <button class=horizontal id="ribbon-btn-runner" onclick={new_runner_frame}>
        <img src="/icons/{$theme}/btn-runner.svg" alt="Builder view" />
        <label for="ribbon-btn-runner">Runner</label>
    </button>
</div>

<style>
.container {
    display: grid;
    grid-auto-flow: row;
    margin: 4rem auto;
    grid-gap: 2rem;
    width: 20rem;
}
</style>