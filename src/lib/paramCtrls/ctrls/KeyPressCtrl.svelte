<script>
    let {
        param=$bindable(),
        /** @prop @type {boolean} Controls whether this control is disabled */
        disabled=false,
        valid=$bindable()
    } = $props()

    let selected = $state.raw(false);
    let hovered = $state.raw(false);
    let handle = $state.raw()

    $effect(() => {
        if (selected) {
            param.val.length = 0;
            handle.focus();
        }
    })
</script>

<div 
    class=container
    class:selected={selected}
    onclick={evt => selected = !disabled}
    class:hovered={hovered}
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