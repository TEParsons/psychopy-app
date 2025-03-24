<script>
    export let title;

    export let id;
    export let handle;

</script>

<dialog id={id} bind:this={handle} on:close>
    <div class="title">
        <label for={id}>Editing: {title}</label>
        <div class=gap></div>
        <div class=title-btns>
            <button id=close on:click={() => { handle.close() }}>x</button>
        </div>
    </div>
    <div class="content">
        <slot></slot>
    </div>
</dialog>

<style>
    :root {
        --panel-padding: .5rem;
    }
    dialog {
        padding: 0;
        position: relative;
        background-color: var(--mantle);
        border-radius: .25rem;
        overflow-x: hidden;
        overflow-y: hidden;
        outline: none;
        border: 2px solid var(--outline);
    }
    dialog .content {
        position: relative;
        padding: 1rem;
        height: 100%;
        overflow-y: auto;
    }
    dialog .title {
        display: grid;
        grid-template-columns: [title] max-content [gap] auto [close] min-content;
        align-items: center;
        justify-items: start;
        padding: .3em 1rem;
        background-color: var(--overlay);
        padding: 0;
    }
    dialog .title label {
        padding: .5rem;
    }
    .title-btns button {
        margin: 0;
        height: 100%;
        width: 100%;
        padding: .5rem 1rem;
        margin: 0;
        border-radius: 0;
        background-color: var(--overlay);
        color: var(--text);
    }
    .title-btns button:enabled:hover {
        background-color: var(--base);
        color: var(--text);
    }
    .title-btns button#close:enabled:hover {
        background-color: var(--primary);
        color: var(--primary-text);
    }
</style>