<script>
    import { theme } from './globals.js'

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

<button id="ribbon-btn-builder" onclick={new_builder_frame}>
    <img src="/icons/{$theme}/btn-builder.svg" alt="Builder view" />
</button>
<button id="ribbon-btn-coder" onclick={new_coder_frame}>
    <img src="/icons/{$theme}/btn-coder.svg" alt="Coder view" />
</button>
<button id="ribbon-btn-runner" onclick={new_runner_frame}>
    <img src="/icons/{$theme}/btn-runner.svg" alt="Runner view" />
</button>