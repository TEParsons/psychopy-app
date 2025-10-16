<script>
    import { prefs } from "$lib/preferences.svelte";
    
    let {
        callbacks
    } = $props();

    let held = $state([]);
</script>


<svelte:window 
    onkeydown={evt => {
        // mark key as held
        if (!held.includes(evt.key)) {
            held.push(evt.key)
        }
        // does it match any shortcut?
        for (let [name, param] of Object.entries(prefs.shortcuts)) {
            if (param.val.every(val => held.includes(val)) && held.every(val => param.val.includes(val))) {
                // clear held keys
                held.length = 0
                // if so, execute method
                callbacks[name]?.()
            }
        }
    }}
    onkeyup={evt => {
        // mark key as no longer held
        if (held.includes(evt.key)) {
            held.splice(
                held.indexOf(evt.key)
            )
        }
    }}
/>