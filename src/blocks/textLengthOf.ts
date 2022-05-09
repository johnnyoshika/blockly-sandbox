import Blockly from 'blockly';

// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#eqbbxk

Blockly.Blocks['x_text_length_of'] = {
  init: function () {
    this.jsonInit({
      type: 'x_text_length_of',
      message0: 'length of %1 %2',
      args0: [
        {
          type: 'input_value',
          name: 'INPUT',
          check: ['String', 'Array'],
        },
        {
          type: 'field_dropdown',
          name: 'COLOR',
          options: [
            ['red', 'RED'],
            ['green', 'GREEN'],
            ['blue', 'BLUE'],
          ],
        },
      ],
      inputsInline: false,
      output: 'Number',
      colour: 120,
      tooltip: '',
      helpUrl: '',
      extensions: ['parent_tooltip_extension'],
    });

    // If we didn't use arrow function, we would have to assign 'this' to a variable for use a closure

    // Commented out so this.setTooltip() on parent_tooltip_extension will be used
    // this.setTooltip(() => {
    //   return 'Selection is "%1".'.replace(
    //     '%1',
    //     this.getFieldValue('COLOR'),
    //   );
    // });

    // This gets called on every change (not just this block's change)
    this.setOnChange((e: any) => {
      // A whole bunch of auto-events are triggered on workspace load, including BLOCK_MOVE, so ignore those
      if (!e.isUiEvent) return;
      if (e.type !== Blockly.Events.SELECTED) return;

      if (e.oldElementId === this.id) this.setColour(120);

      if (e.newElementId === this.id) this.setColour(60);
    });
  },
};

Blockly.JavaScript['x_text_length_of'] = function (block: any) {
  console.log(
    this.getFieldValue('INPUT'), // Always null, but this.getInput('INPUT') is defined
    this.getFieldValue('COLOR'),
  );
  var input =
    Blockly.JavaScript.valueToCode(
      block,
      'INPUT',
      Blockly.JavaScript.ORDER_ATOMIC,
    ) || "''";

  var code = `${input}.length`;
  return [code, Blockly.JavaScript.ORDER_NONE];
};
