<script>
    import { onMount } from 'svelte';

    function on_text() {
        // get text area element
        let textarea = document.getElementById("text-area");
        // update line numbers
        document.getElementById('line-numbers').innerHTML = Array.from({
            length: textarea.value.split('\n').length,
        }, (_, i) => `<div>${i + 1}</div>`).join('');
    }
    onMount(on_text);
</script>

<div class=code-ctrl>
    <div id=line-numbers></div>
    <textarea id=text-area class="python" on:input={on_text}> </textarea>
</div>

<style>
    .code-ctrl {
        display: grid;
        grid-template: 1fr / min-content 1fr;
        overflow-y: auto;
        overflow-x: hidden;
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        border-radius: .25rem;
        border: 1px solid var(--overlay);
    }
    #text-area, #line-numbers {
        color: var(--text);
        font-family: var(--mono);
        padding: 1rem;
        background-color: var(--mantle);
    }
    #text-area {
        border: none;
        outline: none;
        resize: none;
        background-color: var(--base);
    }
    #line-numbers {
        text-align: right;
    }
</style>