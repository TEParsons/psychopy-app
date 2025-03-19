<script>
    import MenuItem from './Item.svelte';
    export let id;
    export let label;
    export let icon = undefined;

    function show_menu(evt) {
        // get button
        let emt = evt.srcElement;
        while (emt.tagName !== "BUTTON") {
            emt = emt.parentNode;
        }
        // get submenu
        let submenu = evt.__root.parentNode.querySelector(".submenu-container")
        // show submenu
        submenu.hidden = false;
    }
    function hide_menu(evt) {
        let submenu = evt.__root.parentNode.querySelector(".submenu-container")
        submenu.hidden = true;
    }
</script>

<MenuItem id={id} label={label} icon={icon} on:click={show_menu} submenu>    
    <ul slot=submenu class=menu>
        <slot></slot>
    </ul>
</MenuItem>

<style>
    ul {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        padding: 0;
    }
</style>