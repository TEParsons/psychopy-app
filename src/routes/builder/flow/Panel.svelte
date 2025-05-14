<script>
    import FlowCanvas from './Canvas.svelte';
    import FlowControls from './controls/Panel.svelte';

</script>

<div class=flow-panel>
    <FlowControls></FlowControls>
    <FlowCanvas></FlowCanvas>
</div>

<style>
    .flow-panel {
        display: grid;
        grid-template-columns: [buttons] min-content [canvas] 1fr;
    }
</style>