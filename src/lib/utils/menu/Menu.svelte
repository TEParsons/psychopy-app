<script>
    import { getContext, setContext } from 'svelte';
    import { writable } from 'svelte/store';

    /** @prop @type {any} Arbitrary data associated with this menu */
    export const data = {};

    /** @public @type {import("svelte/store").Writable<boolean|undefined>} Whether this menu is open, store can be supplied or bound */
    export let open = writable(false)
    /**
     * @public 
     * Open this menu
     * 
     * @param value {boolean} Whether or not this menu should be open (default is true)
    */
    export function setOpen(value=true) {
        // open/close this menu
        open.set(value)
        // open/close parent menu
        if (parent) {
            parent.setOpen(value)
        }
    }

    /** @public @type {Array<object>} Arbitrary data to associated with each item, array can be supplied or bound */
    export let itemData = [];
    setContext("itemData", itemData)
    /** @private @type {{container: HTMLDivElement|undefined, menu: import("@smui/menu").default|undefined, setOpen: function}} If this menu has a parent menu, its handles will appear here */
    let parent = getContext("handles")
    /** @public @type {{menu: import("@smui/menu").default|undefined, setOpen: function}} Handles of the HTML elements corresponding to this component, object can be supplied or bound */
    export let handles = {
        menu: undefined,
        setOpen: setOpen,
    };
    setContext("handles", handles)
</script>

<div 
    class=menu
    style:display={$open ? "block" : "none"}
    bind:this={handles.menu}
    on:focusout={(evt) => setOpen(handles.menu.contains(evt.relatedTarget))}
>
    <slot></slot>
</div>

<style>
    div {
        position: absolute;
        top: 0;
        left: 100%;
        background: var(--base);
        border: 1px solid var(--overlay);
        border-radius: .1rem;
        z-index: 100;
        list-style-type: none;
        padding: 0;
    }
    div:focus {
        border-color: var(--blue)
    }

</style>