<script>
    import Menu from "./Menu.svelte";
    import Item from "./Item.svelte";

    export let icon;
    export let label;

    let menu;
</script>

<Item 
    icon={icon} 
    label={label} 
    action={() => menu.setOpen(true)} 
    submenu
/>
<Menu bind:menu={menu}>
    <div class=menu>
        <slot></slot>
    </div>
</Menu>

<style>
    .menu {
        display: flex;
        flex-direction: column;
    }
</style>