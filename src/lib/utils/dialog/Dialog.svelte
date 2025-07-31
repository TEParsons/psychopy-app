<script>
    import { Button } from "$lib/utils/buttons";
    import { onMount } from "svelte";

    let {
        id,
        /** @prop @type {string} Text to display in the title bar of this dialog */
        title,
        /** @prop @type {OK: function|undefined, APPLY: function|undefined, CANCEL: function|undefined, HELP: string|undefined} Standard dialog buttons to display, with additional callback functions (or navigation link, in the case of HELP) */
        buttons={
            OK: undefined,
            APPLY: undefined,
            CANCEL: undefined,
            HELP: undefined
        },
        /** @prop @type {function} Function to call when dialog is closed */
        onclose=(evt) => {},
        /** @returns @type {HTMLElement} Handle of this dialog's HTML Element */
        shown=$bindable(),
        /** @interface */
        children
    } = $props();

    let handle;

    $effect(() => {
        if (shown) {
            handle.showModal()
        } else {
            handle.close()
        }
    })

</script>

<dialog id={id} bind:this={handle} onclose={() => {shown = false}}>
    <div class="title">
        <label for={id}>{title}</label>
        <div class=gap></div>
        <div class=title-btns>
            <button id=close onclick={() => { shown = false; }}>x</button>
        </div>
    </div>
    <div class="content">
        {@render children()}
    </div>
    <div class="buttons">
        <div class="btn-array extra">
                {#if buttons.HELP}
                <Button 
                    label=Help
                    onclick={() => {
                        window.open(buttons.HELP, '_blank').focus();
                    }} 
                    horizontal
                    disabled={buttons.HELP ? true : false}
                ></Button>
                {/if}
        </div>
        <div class=gap></div>
        <div class="btn-array standard">
            {#if buttons.OK}
            <Button 
                label="Okay"
                onclick={(evt) => {
                    buttons['OK'](evt); 
                    shown = false;
                }} 
                primary
                horizontal
            ></Button>
            {/if}
            {#if buttons.APPLY}
            <Button 
                label="Apply"
                onclick={(evt) => {
                    buttons['APPLY'](evt); 
                }} 
                horizontal
            ></Button>
            {/if}
            {#if buttons.CANCEL}
            <Button 
                label="Cancel"
                onclick={(evt) => {
                    buttons['CANCEL'](evt); 
                    shown = false;
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