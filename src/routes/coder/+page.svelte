<script>
    import { theme } from '../globals.js';
    import { file, pilot_mode } from './globals.js';
    import Ribbon from './Ribbon.svelte';
    import Panel from '../utils/Panel.svelte';
    import Frame from '../utils/Frame.svelte';
    import CodeCtrl from '../utils/ctrls/Code.svelte';
</script>

<Frame rows=3 cols=4>
    <Ribbon slot=ribbon/>
    <Panel id=source-pnl title="Source" vspan=3></Panel>
    <Panel id=file-pnl title="File" hspan=3 vspan=2>
        <CodeCtrl lexer="python" />
    </Panel>
    <Panel id=output-pnl title="Output" hspan=3></Panel>
</Frame>

<style>

</style>