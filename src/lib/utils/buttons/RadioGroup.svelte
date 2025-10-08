<script>
    import { setContext } from "svelte";

    let {
        value=$bindable(),
        children
    } = $props();

    let buttons = $state({
        selected: {
            handle: undefined, 
            value: undefined
        },
        all: []
    })
    setContext("siblings", buttons)

    $effect(() => {
        value = buttons.selected.value
    })
</script>

{@render children?.()}
