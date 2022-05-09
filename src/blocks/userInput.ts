import Blockly from 'blockly';

window.Blockly = Blockly;

// Blockly.mainWorkspace.getAllBlocks().find(b => b.type === 'x_user_input').getField('ID').getOptions()
// Blockly.mainWorkspace.getAllBlocks().find(b => b.type === 'x_user_input').getField('ID').getValue()

// To change individual dropdown of a specific block instance:
// Blockly.mainWorkspace.getAllBlocks().find(b => b.type === 'x_user_input').getInput('INPUT').removeField('ID')
// Blockly.mainWorkspace.getAllBlocks().find(b => b.type === 'x_user_input').getInput('INPUT').appendField(new Blockly.FieldDropdown(() => [['foo', 'FOO'], ['bar', 'BAR']]), 'ID');
// Blockly.mainWorkspace.getAllBlocks().find(b => b.type === 'x_user_input').getField('ID').setValue('BAR')
// OR
// Blockly.mainWorkspace.getAllBlocks().find(b => b.type === 'x_user_input').setFieldValue('BAR', 'ID')
// While this will be set:
// <block type="x_user_input" id="ma;Q*J+s~_:]nzP.qZw5">
//   <field name="ID">BAR</field>
// </block>
// ...next time the workspace loads, the dropdown will be replaced with what's defined in set_user_input_options

// Blockly doesn't allow empty dropdown fields, so make sure to set them before dropdowns are rendered in the workspace
const INPUT_OPTIONS: [string, string][] = [];

export const getInputOptions = () => INPUT_OPTIONS;

export const setInputOptions = (options: [string, string][]) => {
  // Empty array: https://stackoverflow.com/a/1232046/188740
  INPUT_OPTIONS.splice(0, INPUT_OPTIONS.length);
  INPUT_OPTIONS.push(...options);
};

export const userInputsFlyoutCallback = (
  workspace: Blockly.Workspace,
) =>
  INPUT_OPTIONS.map(([_label, value]) => ({
    kind: 'block',
    type: 'x_user_input',
    fields: {
      ID: value,
    },
  }));

Blockly.Extensions.register('set_user_input_options', function () {
  // this refers to the block that the extension is being run on
  // @ts-ignore
  this.getInput('INPUT').appendField(
    new Blockly.FieldDropdown(() => INPUT_OPTIONS),
    'ID',
  );
});

Blockly.Blocks['x_user_input'] = {
  init: function () {
    this.jsonInit({
      type: 'x_user_input',
      message0: '%1 of type %2',
      args0: [
        {
          type: 'input_dummy',
          name: 'INPUT',
        },
        {
          type: 'field_dropdown',
          name: 'TYPE',
          options: [
            ['number', 'NUMBER'],
            ['text', 'TEXT'],
          ],
        },
      ],
      inputsInline: true,
      output: null,
      colour: '#000',
      tooltip: '',
      helpUrl: '',
      extensions: ['set_user_input_options'],
    });

    this.setTooltip(() => {
      return 'Block ID is "%1".'.replace('%1', this.id);
    });
  },
};

Blockly.JavaScript['x_user_input'] = function (block: any) {
  var id = block.getFieldValue('ID');
  var type = block.getFieldValue('TYPE');

  var functionName = Blockly.JavaScript.provideFunction_(
    'xUserInput',
    [
      'function ' +
        Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_ +
        `(id, type) {
          return id + ':' + type;
     }`,
    ],
  );

  var code = `${functionName}('${id}', '${type}')`;

  return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};
