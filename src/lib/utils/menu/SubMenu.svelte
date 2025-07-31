<script>
    import { theme } from "$lib/globals.svelte.js";
    import Menu from "./Menu.svelte";
    import Item from "./Item.svelte";

    let {
        /** @prop @type {string} Label for this menu item */
        label,
        /** @prop @type {String|undefined} Path to an icon for this page's tab */
        icon=undefined,
        /** @prop @type {any} Arbitrary data associated with this menu item  */
        data={},
        /** @prop @type {boolean} Is this item able to be clicked on? */
        disabled=$bindable(),
        children
    } = $props()

    let shown = $state()
</script>

<Item 
    label={label} 
    icon={icon} 
    onclick={() => {
        shown = true
    }}
    data={data}
    close={false}
    disabled={disabled}
>
    {#snippet submenu()}
        <img class=menu-item-chevron src="/icons/{$theme}/sym-arrow-right.svg" alt=">" />
        <Menu 
            bind:shown={shown}
        >
            <div class=menu>
                {@render children()}
            </div>
        </Menu>
    {/snippet}
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