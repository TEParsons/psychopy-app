<script>
    import { prefs } from "$lib/preferences.svelte";

    let {
        param=$bindable(),
        /** @prop @type {boolean} Controls whether this control is disabled */
        disabled=false,
        valid=$bindable()
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

    // check valid when param value changes
    $effect(() => {
        // start off valid
        valid.state = true
        valid.warning = undefined
        // if binding is blank, it's invalid
        if (!param.val.length) {
            valid.state = false
            valid.warning = "No binding set"
        }
        // iterate through existing key bindings
        for (let [name, prefParam] of Object.entries(prefs.shortcuts)) {
            // ignore this one (it will always match itself, duh)
            if (name === param.name) {
                continue
            }
            // if this keybinding matches on already in use, it's invalid
            if (prefParam.val.length && prefParam.val.every(val => param.val.includes(val)) && param.val.every(val => prefParam.val.includes(val))) {
                valid.state = false
                valid.warning = `Keybinding '${param.val.join("+")}' for ${param.name} is already in use by '${prefParam.label}'`
            }
        }
    })
</script>

<div 
    class=container
    class:selected={selected}
    onclick={evt => selected = !disabled}
    class:hovered={hovered}
    style:color={valid ? "inherit" : "var(--red)"}
    onmouseenter={evt => hovered = true}
    onmouseleave={evt => hovered = false}
    role=none
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
                if (!param.val.includes(evt.key)) {
                    param.val.push(evt.key)
                }
            }}
            onkeyup={evt => {
                // prevent usual effect
                evt.preventDefault()
                // if in value, remove it
                if (param.val.includes(evt.key)) {
                    param.val.splice(
                        param.val.indexOf(evt.key)
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