<script>
    import { writable } from "svelte/store";
    import Panel from "../dialogs/component/Panel.svelte";
    import { sortParams } from "../experiment";

    export let component
    
    let tempParams = writable(sortParams(component.copyParams()))
</script>

<div class=standalone-routine-canvas>
	<Panel component={component} tempParams={tempParams} />
</div>