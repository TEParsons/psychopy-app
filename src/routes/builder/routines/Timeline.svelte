<script>
    export let ticks;
</script>

<div class=comp-name></div>
<div class=comp-overshoot-timeline></div>
<div class=comp-timeline style="grid-template-columns: repeat({ticks.labels.length}, 1fr) {ticks.remainder}fr;">
    {#each ticks.labels as tick}
    <div class=comp-timeline-tick id=timeline-label-{tick.label}>
        <label for=timeline-labels>{tick.label}s</label>
    </div>
    {/each}
    <div class=comp-timeline-tick id=timeline-label-remainder></div>
</div>
<div class=comp-overshoot-timeline></div>

<style>
    @import url(./timeline.css);
</style>