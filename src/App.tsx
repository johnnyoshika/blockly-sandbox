import Blockly from 'blockly';
import { useEffect, useRef, useState } from 'react';

const App = () => {
  const hydratedRef = useRef(false);
  const blocklyRef = useRef(null);

  const [workspace, setWorkspace] = useState<Blockly.WorkspaceSvg>();

  useEffect(() => {
    var toolbox = {
      kind: 'flyoutToolbox',
      contents: [
        {
          kind: 'block',
          type: 'controls_if',
        },
        {
          kind: 'block',
          type: 'controls_repeat_ext',
        },
        {
          kind: 'block',
          type: 'logic_compare',
        },
        {
          kind: 'block',
          type: 'math_number',
        },
        {
          kind: 'block',
          type: 'math_arithmetic',
        },
        {
          kind: 'block',
          type: 'text',
        },
        {
          kind: 'block',
          type: 'text_print',
        },
      ],
    };

    const ws = Blockly.inject(blocklyRef.current, {
      toolbox,
      zoom: {
        wheel: true,
      },
      move: {
        scrollbars: true,
        drag: true,
        wheel: true,
      },
    });
    setWorkspace(ws);

    return () => {
      ws.dispose();
    };
  }, [setWorkspace]);

  useEffect(() => {
    if (!workspace || hydratedRef.current) return;

    const workspaceXml = localStorage.getItem('workspaceXml');
    if (!workspaceXml) return;

    Blockly.Xml.domToWorkspace(
      Blockly.Xml.textToDom(workspaceXml),
      workspace,
    );

    hydratedRef.current = true;
  }, [workspace]);

  useEffect(() => {
    if (!workspace) return;

    const listener = (event: any) => {
      const workspaceXml = Blockly.Xml.domToText(
        Blockly.Xml.workspaceToDom(workspace),
      );

      localStorage.setItem('workspaceXml', workspaceXml);
    };

    workspace.addChangeListener(listener);

    return () => {
      workspace.removeChangeListener(listener);
    };
  }, [workspace]);

  const printCode = () => {
    const code = Blockly.JavaScript.workspaceToCode(workspace!);
    console.log(code);
  };

  return (
    <div>
      <div style={{ padding: '16px', background: '#a5a5e9' }}>
        <button type="button" onClick={printCode}>
          Code
        </button>
      </div>
      <div
        ref={blocklyRef}
        style={{ height: 'calc(100vh - 56px)' }}
      ></div>
    </div>
  );
};

export default App;
