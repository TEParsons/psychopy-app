<script>
    export let rows = 4;
    export let cols = 4;

    var dragging_panel;
</script>

<div id=frame>
    <slot name=ribbon></slot>
    <div id=content>
        <div id=panel-sizer style="--frame-rows: {rows}; --frame-cols: {cols}">
            <slot></slot>
        </div>
    </div>
</div>

<style>
#frame {
    display: grid;
    grid-template: min-content 1fr / 1fr;
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
}
#content {
    position: relative;
}
#panel-sizer {
    display: grid;
    grid-gap: .25rem;
    grid-template-rows: repeat(var(--frame-rows), 1fr);
    grid-template-columns: repeat(var(--frame-cols), 1fr);
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    padding: .25rem;
    background-color: var(--crust);
}
</style>