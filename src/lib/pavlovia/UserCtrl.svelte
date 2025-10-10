<script>
    import { DropdownButton } from "$lib/utils/buttons";
    import { getContext, onMount } from "svelte";
    import { login, logout, users } from "./pavlovia.svelte";
    import { MenuItem, MenuSeparator, SubMenu } from "$lib/utils/menu";
    import { electron } from "$lib/globals.svelte";

    let current = getContext("current")

    onMount(async () => {
        // no saved users if not in electron
        if (!electron) {
            return
        }
        // get file path
        let file = await electron.paths.pavlovia.users();
        let dir = await electron.paths.pavlovia.dir();
        // make sure pavlovia folder exists
        if (!(await electron.files.exists(dir))) {
            await electron.files.mkdir(dir);
        }
        // make sure users.json exists
        if (!(await electron.files.exists(file))) {
            await electron.files.save(file, "{}");
        }
        // get file contents
        let content = await electron.files.load(file);
        // parse JSON
        let data = JSON.parse(content);
        // apply
        Object.assign(users, data)
    })
</script>

<DropdownButton
    label={current.user ? current.user.name : "No user"}
    icon={current.user ? current.user.avatar_url : undefined}
    onclick={(evt) => {
        if (current.user) {
            window.open(current.user.web_url)
        }
    }}
>
    <MenuItem
        label="Edit user..."
        icon="/icons/btn-edit.svg"
    ></MenuItem>
    <SubMenu
        label="Switch user..."
    >
        {#each Object.values(users) as user}
            <MenuItem
                label={user.name}
                icon={user.avatar_url}
                onclick={(evt) => current.user = user}
            ></MenuItem>
        {/each}
        <MenuSeparator/>
        <MenuItem
            label="New user..."
            icon="/icons/btn-new.svg"
        ></MenuItem>
    </SubMenu>
    <MenuSeparator/>
    {#if current.user}
        <MenuItem
            label="Logout"
            onclick={(evt) => {
                logout()
                current.user = undefined
            }}
        ></MenuItem>
    {:else}
        <MenuItem
            label="Login"
            onclick={(evt) => {
                login()
                // placeholder: need to get username from autheticated session
                current.user = users['ToddOST']
            }}
        ></MenuItem>
    {/if}
</DropdownButton>