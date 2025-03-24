<script>
    export let title;

    export let id;
    export let dialog;

</script>

<dialog id={id} bind:this={dialog} on:close>
    <div class="title" draggable=true>
        <label for={id}>Editing: {title}</label>
        <div class=gap></div>
        <button id=close on:click={() => { dialog.close() }}>x</button>
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
        grid-template-columns: [title] max-content [gap] auto [close] 2rem;
        align-items: center;
        justify-items: start;
        padding: .3em 1rem;
        background-color: var(--overlay);
        padding: 0;
    }
    dialog .title label {
        padding: .5rem;
    }
    button#close {
        margin: 0;
        height: 100%;
        width: 100%;
        padding: .5rem;
        margin: 0;
        border-radius: 0;
    }
</style>