<script>
    import { Button } from "$lib/utils/buttons";

    export let title;

    export let id;
    export let handle;
    export let buttons = {};

</script>

<dialog id={id} bind:this={handle} on:close>
    <div class="title">
        <label for={id}>{title}</label>
        <div class=gap></div>
        <div class=title-btns>
            <button id=close on:click={() => { handle.close() }}>x</button>
        </div>
    </div>
    <div class="content">
        <slot></slot>
    </div>
    <div class="buttons">
        <div class="btn-array extra">
                {#if "HELP" in buttons}
                <Button 
                    label=Help
                    on:click={() => {
                        window.open(buttons['HELP'], '_blank').focus();
                    }} 
                    horizontal
                    disabled={buttons['HELP'] ? true : false}
                ></Button>
                {/if}
        </div>
        <div class=gap></div>
        <div class="btn-array standard">
            {#if "OK" in buttons}
            <Button 
                label="Okay"
                on:click={(evt) => {
                    buttons['OK'](evt); 
                    handle.close();
                }} 
                primary
                horizontal
            ></Button>
            {/if}
            {#if "APPLY" in buttons}
            <Button 
                label="Apply"
                on:click={(evt) => {
                    buttons['APPLY'](evt); 
                }} 
                horizontal
            ></Button>
            {/if}
            {#if "CANCEL" in buttons}
            <Button 
                label="Cancel"
                on:click={(evt) => {
                    buttons['CANCEL'](evt); 
                    handle.close();
                }} 
                horizontal
            ></Button>
            {/if}
        </div>
    </div>
</dialog>

<style>
    :root {
        --panel-padding: .5rem;
    }
    dialog:modal {
        display: grid;
    }
    dialog {
        grid-template-rows: [title] min-content [content] 1fr;
        background-color: var(--mantle);
        border-radius: .25rem;
        outline: none;
        padding: 0;
        border: 1px solid var(--outline);
        width: fit-content;
        height: 80vh;
    }
    dialog .content {
        position: relative;
        height: 100%;
        width: 100%;
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
        background-color: var(--red);
        color: var(--text-on-red);
    }

    .buttons {
        display: grid;
        grid-template-columns: [extra] min-content [gap] auto [standard] min-content;
        padding: 0 1rem;
        padding-bottom: 2rem;
    }
    .btn-array {
        display: flex;
        flex-direction: row;
        gap: 1rem;
    }
</style>