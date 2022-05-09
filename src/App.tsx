import Blockly from 'blockly';
import '@blockly/block-plus-minus';
import { useEffect, useRef, useState } from 'react';
import './blocks/parentTooltipExtension.ts';
import './blocks/textLengthOf';
import './blocks/userInput';
import {
  setInputOptions,
  userInputsFlyoutCallback,
} from './blocks/userInput';

const App = () => {
  const hydratedRef = useRef(false);
  const blocklyRef = useRef(null);

  const [workspace, setWorkspace] = useState<Blockly.WorkspaceSvg>();

  const [options, setOptions] = useState<[string, string][]>([]);

  useEffect(() => {
    // An empty list is problematic when there's already a x_user_input block in the workspace, as Blockly will complain of an empty options list when that block is rendered.
    // Setting it 'Unknown' will force all x_user_input in the workspace to show 'Unknown'.
    setInputOptions(
      options.length ? options : [['Unknown', 'UNKNOWN']],
    );
  }, [options]);

  useEffect(() => {
    if (!workspace) return;

    if (options.length)
      workspace.getToolbox().getToolboxItemById('user-inputs').show();
    else
      workspace.getToolbox().getToolboxItemById('user-inputs').hide();
  }, [options, workspace]);

  useEffect(() => {
    var toolbox = {
      kind: 'categoryToolbox',
      contents: [
        {
          kind: 'category',
          toolboxitemid: 'standard', // Doesn't seem to do anything
          name: 'Standard',
          colour: '#ff9900',
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
        },
        {
          kind: 'category',
          toolboxitemid: 'user-inputs',
          name: 'User Inputs',
          colour: '#000',
          hidden: 'true',
          custom: 'USER_INPUTS',
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

    ws.registerToolboxCategoryCallback(
      'USER_INPUTS',
      userInputsFlyoutCallback,
    );

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
      console.log('Workspace changed');
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

  const handleOptions = () => {
    const options = window.prompt('Comma separated list of options');
    if (options === null) return;

    if (!options) setOptions([]);
    else
      setOptions(options.split(',').map(o => [o, o.toUpperCase()]));
  };

  const hideUserInputs = () => {
    workspace.getToolbox().getToolboxItemById('user-inputs').hide();
  };

  const showUserInputs = () => {
    workspace.getToolbox().getToolboxItemById('user-inputs').show();
  };

  return (
    <div>
      <div style={{ padding: '16px', background: '#a5a5e9' }}>
        <button type="button" onClick={printCode}>
          Code
        </button>
        <button type="button" onClick={handleOptions}>
          Options
        </button>
        <button type="button" onClick={hideUserInputs}>
          Hide User Inputs
        </button>
        <button type="button" onClick={showUserInputs}>
          Show User Inputs
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
