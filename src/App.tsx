import Blockly from 'blockly';
import '@blockly/block-plus-minus';
import { useEffect, useRef, useState } from 'react';
import './blocks/textLengthOf';

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
        {
          kind: 'block',
          type: 'text_join',
        },
        {
          kind: 'block',
          type: 'x_text_length_of',
        },
        {
          kind: 'block',
          blockxml: `<block type="x_text_length_of">
          <value name="INPUT">
            <shadow type="text">
              <field name="TEXT"></field>
            </shadow>
          </value>
        </block>`,
          type: 'x_text_length_of',
        },
        {
          kind: 'block',
          blockxml: `<block type="x_text_length_of">
          <value name="INPUT">
            <block type="lists_create_with">
              <mutation items="0"></mutation>
            </block>
          </value>
        </block>`,
          type: 'x_text_length_of',
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
