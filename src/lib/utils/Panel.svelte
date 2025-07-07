<script>
    let {
        /** @prop @type {string} Text to display in this panel's sash */
        title,
        /** @prop @type {integer} Number of columns to span within the frame */
        hspan=1,
        /** @prop @type {integer} Number of rows to span within the frame */
        vspan=1,
        /** @interface */
        children
    } = $props()
    
    function ondrag(evt) {
        let panel = this.parentElement
        let frame = panel.parentElement

        frame.dragging_panel = panel
    }
    function ondrop(evt) {
        let frame = this.parentElement

        this.parentElement.insertBefore(frame.dragging_panel, this);
    }
</script>

<div class="panel" style="grid-column-end: span {hspan}; grid-row-end: span {vspan}">
    <div class="pnl-title" draggable=true>
        {title}
    </div>
    <div class="pnl-content">
        {@render children()}
    </div>
</div>

<style>
    :root {
        --panel-padding: .5rem;
    }
    .panel {
        display: grid;
        position: relative;
        background-color: var(--mantle);
        border-radius: .25rem;
        overflow: hidden;
        grid-template: min-content 1fr / 1fr;
    }
    .panel .pnl-content {
        position: relative;
        height: stretch;
        width: stretch;
        overflow-y: auto;
        overflow-x: auto;
    }
    .panel .pnl-title {
        padding: .3em 1rem;
        background-color: var(--overlay);
        width: stretch;
        overflow: hidden;
    }
</style>