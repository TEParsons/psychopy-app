<script>
    import { prefs } from "$lib/preferences.svelte";

    let {
        param=$bindable(),
        /** @prop @type {boolean} Controls whether this control is disabled */
        disabled=false,
        /** @interface */
        ...attachments
    } = $props()

    let selected = $state.raw(false);
    let hovered = $state.raw(false);
    let handle = $state.raw()

    // reset param and focus ctrl when selected
    $effect(() => {
        if (selected) {
            param.val.length = 0;
            handle.focus();
        }
    })

    function validateKeypress(param, valid) {
        // if binding is blank, it's invalid
        if (!param.val.length) {
            valid.value = false
            valid.warning = "No binding set"
        }
        // iterate through existing key bindings
        for (let [name, prefParam] of Object.entries(prefs.shortcuts)) {
            // ignore the current binding (it will always match itself, duh)
            if (name === param.name) {
                continue
            }
            // if this keybinding matches on already in use, it's invalid
            if (prefParam.val.length && prefParam.val.every(val => param.val.includes(val.toUpperCase())) && param.val.every(val => prefParam.val.includes(val.toUpperCase()))) {
                valid.value = false
                valid.warning = `Keybinding '${param.val.join("+")}' for ${param.name} is already in use by '${prefParam.label}'`
            }
        }
    }
</script>

<div 
    class=container
    class:selected={selected}
    onclick={evt => selected = !disabled}
    class:hovered={hovered}
    style:color={param.valid.value ? "inherit" : "var(--red)"}
    onmouseenter={evt => hovered = true}
    onmouseleave={evt => hovered = false}
    role=none
    {@attach element => param.registerValidator("keypress", validateKeypress, -5)}
    {...attachments}
>
    {#if selected}
        <input 
            type=text
            bind:this={handle}
            onfocusout={evt => selected = false}
            onkeydown={evt => {
                // prevent usual effect
                evt.preventDefault()
                // if ENTER, accept value
                if (evt.key === "Enter") {
                    selected = false;
                    hovered = false;
                    return
                }
                // if not in value, add it
                if (!param.val.includes(evt.key.toUpperCase())) {
                    param.val.push(evt.key.toUpperCase())
                }
            }}
            onkeyup={evt => {
                // prevent usual effect
                evt.preventDefault()
                // if in value, remove it
                if (param.val.includes(evt.key.toUpperCase())) {
                    param.val.splice(
                        param.val.indexOf(evt.key.toUpperCase())
                    )
                }
            }}
            style:color={param.val.length ? "inherit" : "var(--outline)" }
            value={param.val.length ? param.val.join?.(" + ") : "Press keys, then press ENTER to accept"}
        />
    {:else}
        <input 
            type=text
            style:color={hovered ? "var(--outline)" : "inherit"}
            value={hovered ? "Click to set" : param.val.join?.(" + ")}
        />
    {/if}
</div>


<style>
    .container {
        display: flex;
        position: relative;
        flex-grow: 1;
    }
    input {
        width: 100%;
    }
</style>