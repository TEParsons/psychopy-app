<script>
    import { theme } from "$lib/globals.js";
    import Menu from "./Menu.svelte";
    import Item from "./Item.svelte";

    /** @prop @type {string} Label for this menu item */
    export let label;
    /** @prop @type {String|undefined} Path to an icon for this page's tab */
    export let icon = undefined;
    /** @prop @type {boolean} Is this item able to be clicked on? */
    export let disabled = false;
    /** @prop @type {any} Arbitrary data associated with this menu item  */
    export let data = {};

    /** @public @type {{item: import('./Item.svelte').default|undefined, menu: import('./Menu.svelte').default|undefined}} Handles of the HTML elements corresponding to this component, object can be supplied or bound */
    export let handles = {
        item: undefined, 
        menu: undefined,
    };
</script>

<Item 
    bind:this={handles.item}
    icon={icon} 
    label={label} 
    action={() => {
        if (handles.menu) {
            handles.menu.setOpen(true);
        }
    }}
    disabled={disabled}
    close={false}
    data={data}
>
<img class=menu-item-chevron src="/icons/{$theme}/sym-arrow-right.svg" alt=">" slot=chevron/>
<Menu 
    slot=submenu
    bind:this={handles.menu}
>
    <div class=menu>
        <slot></slot>
    </div>
</Menu>
</Item>


<style>
    .menu {
        display: flex;
        flex-direction: column;
    }
    .menu-item-chevron {
        width: .4rem;
        margin-left: auto;
    }
</style>