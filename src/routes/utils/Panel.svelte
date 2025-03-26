<script>
    export let title;
    export let id;
    export let hspan=1;
    export let vspan=1;
    
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

<div class="panel" id={id} style="grid-column-end: span {hspan}; grid-row-end: span {vspan}">
    <div class="pnl-title" draggable=true>
        {title}
    </div>
    <div class="pnl-content">
        <slot></slot>
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