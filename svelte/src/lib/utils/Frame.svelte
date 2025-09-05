<script>
    let {
        /** @prop @type {integer} Number of rows in this frame's layout */
        rows=4,
        /** @prop @type {integer} Number of columns in this frame's layout */
        cols=4,
        /** @prop @type {import("svelte").Snippet} Number of rows in this frame's layout */
        ribbon=undefined,
        /** @interface */
        children
    } = $props()

    var dragging_panel;
</script>

<div id=frame>
    {#if ribbon}
        {@render ribbon()}
    {/if}
    <div id=content>
        <div id=panel-sizer style="--frame-rows: {rows}; --frame-cols: {cols}">
            {@render children()}
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