<script>
    import {
        // file
        file_new,
        file_open,
        file_save,
        file_save_as,
        // experiment
    } from './callbacks.js'
    
    import { Menu, MenuItem, MenuSeparator, SubMenu } from '$lib/utils/menu'
    import { Ribbon, RibbonSection, RibbonGap } from '$lib/utils/ribbon';
    import { getContext } from "svelte";
    import { IconButton, DropdownButton } from '$lib/utils/buttons';
    import { login, logout, PavloviaUsers } from '$lib/pavlovia/pavlovia.svelte';

    let current = getContext("current");

    let show = $state({
    })
</script>

<Ribbon>
    <RibbonSection label=File icon="icons/rbn-file.svg">
        <IconButton 
            icon="icons/btn-new.svg" 
            label="New file" 
            onclick={file_new}
            borderless
        /> 
        <IconButton 
            icon="icons/btn-open.svg" 
            label="Open file" 
            onclick={file_open} 
            borderless
        />
        <IconButton 
            icon="icons/btn-save.svg" 
            label="Save file" 
            onclick={file_save}
            borderless
        />
        <IconButton 
            icon="icons/btn-saveas.svg" 
            label="Save file as"
            onclick={file_save_as} 
            borderless
        />
    </RibbonSection>

    <RibbonSection label=Edit icon="icons/rbn-edit.svg">
        <IconButton 
            icon="icons/btn-find.svg" 
            label="Find" 
            onclick={(evt) => current.pages[current.tab].editor.trigger(
                "find", 
                "editor.actions.findWithArgs", 
                { 
                    searchString: ""
                }
            )}
            borderless
        />
    </RibbonSection>

    <RibbonSection label=Pavlovia icon="icons/rbn-pavlovia.svg">
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
                icon="icons/btn-edit.svg"
            ></MenuItem>
            <SubMenu
                label="Switch user..."
            >
                {#each Object.values(PavloviaUsers) as user}
                    <MenuItem
                        label={user.name}
                        icon={user.avatar_url}
                        onclick={(evt) => current.user = user}
                    ></MenuItem>
                {/each}
                <MenuSeparator/>
                <MenuItem
                    label="New user..."
                    icon="icons/btn-new.svg"
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
                        current.user = PavloviaUsers['ToddOST']
                    }}
                ></MenuItem>
            {/if}
        </DropdownButton>
    </RibbonSection>

    <RibbonGap></RibbonGap>

    <RibbonSection label=Views icon="icons/rbn-windows.svg">
        <IconButton 
            icon="icons/btn-builder.svg" 
            label="Builder view" 
            onclick={(evt) => window.open("/builder")} 
            borderless
        />
        <IconButton 
            icon="icons/btn-coder.svg" 
            label="Coder view" 
            onclick={(evt) => window.open("/coder")} 
            borderless
        />
        <IconButton 
            icon="icons/btn-runner.svg" 
            label="Runner view" 
            onclick={(evt) => window.open("/runner")} 
            borderless
        />
    </RibbonSection>
</Ribbon>