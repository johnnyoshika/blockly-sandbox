import Blockly from 'blockly';

// https://developers.google.com/blockly/guides/create-custom-blocks/extensions#extensions

// This extension sets the block's tooltip to be a function which displays
// the parent block's tooltip (if it exists).
Blockly.Extensions.register('parent_tooltip_extension', function () {
  // this refers to the block that the extension is being run on
  // @ts-ignore
  var thisBlock = this;
  // @ts-ignore
  this.setTooltip(function () {
    var parent = thisBlock.getParent();
    return (
      (parent && parent.getInputsInline() && parent.tooltip) ||
      Blockly.Msg.MATH_NUMBER_TOOLTIP
    );
  });
});
