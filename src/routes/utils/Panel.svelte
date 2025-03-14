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

<div class="panel" id={id} style="grid-column-end: span {hspan}; grid-row-end: span {vspan}" on:dragenter={ondrop}>
    <div class="pnl-title" draggable=true on:dragstart={ondrag}>
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
        position: relative;
        background-color: var(--mantle);
        border-radius: .25rem;
        overflow: hidden;
    }
    .panel .pnl-content {
        position: relative;
        width: 100%;
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
    }
    .panel .pnl-title {
        padding: .3em 1rem;
        background-color: var(--overlay);
    }
</style>