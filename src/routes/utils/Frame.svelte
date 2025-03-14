<script>
    export let rows = 4;
    export let cols = 4;

    var dragging_panel;
</script>

<div id=body>
    <slot name=ribbon></slot>
    <div id=frame style="--frame-rows: {rows}; --frame-cols: {cols}" on:drag={ondrag}>
        <slot></slot>
    </div>
</div>

<style>
#frame {
    display: grid;
    padding: .25rem;
    grid-gap: .25rem;
    grid-template-rows: repeat(var(--frame-rows), 1fr);
    grid-template-columns: repeat(var(--frame-cols), 1fr);
    background-color: var(--crust);
}
#body {
    display: grid;
    grid-template: min-content 1fr / 1fr;
    height: 100vh;
}
</style>