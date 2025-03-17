<script>

</script>

<div class=flow-panel>
    <div class=flow-buttons>
        <button class=horizontal id=add-routine>
            <img src="/icons/light/btn-loop.svg" alt="" />
            <label for=add-routine>Add Routine</label>
        </button>
        <button class=horizontal id=add-loop>
            <img src="/icons/light/btn-routine.svg" alt="" />
            <label for=add-loop>Add Loop</label>
        </button>
    </div>
    <div class=flow-canvas>
        
    </div>
</div>

<style>
    .flow-panel {
        display: grid;
        grid-template-columns: [buttons] min-content ;
    }
    .flow-buttons {
        padding: 1rem;
        display: grid;
        grid-auto-flow: row;
    }
</style>