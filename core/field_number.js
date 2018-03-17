/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2016 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Number input field
 * @author fenichel@google.com (Rachel Fenichel)
 */
'use strict';

goog.provide('Blockly.FieldNumber');

goog.require('Blockly.FieldTextInput');
goog.require('goog.math');

/**
 * Class for an editable number field.
 * @param {(string|number)=} opt_value The initial content of the field. The value
 *     should cast to a number, and if it does not, '0' will be used.
 * @param {(string|number)=} opt_min Minimum value.
 * @param {(string|number)=} opt_max Maximum value.
 * @param {(string|number)=} opt_precision Precision for value.
 * @param {Function=} opt_validator An optional function that is called
 *     to validate any constraints on what the user entered.  Takes the new
 *     text as an argument and returns either the accepted text, a replacement
 *     text, or null to abort the change.
 * @extends {Blockly.FieldTextInput}
 * @constructor
 */
Blockly.FieldNumber = function(opt_value, opt_min, opt_max, opt_precision,
    opt_validator) {
  opt_value = (opt_value && !isNaN(opt_value)) ? String(opt_value) : '0';
  Blockly.FieldNumber.superClass_.constructor.call(
      this, opt_value, opt_validator);
  this.setConstraints(opt_min, opt_max, opt_precision);
};
goog.inherits(Blockly.FieldNumber, Blockly.FieldTextInput);
Blockly.FieldNumber.prototype.init = function() {
  Blockly.FieldNumber.superClass_.init.call(this);
  var radius=11;
  this.radius=radius;
  this.borderRect_ = Blockly.utils.createSvgElement('circle',
      {'cx': radius,
       'cy': radius,
       'r': radius+Blockly.BlockSvg.SEP_SPACE_Y/2-1}, this.fieldGroup_, this.sourceBlock_.workspace);
  this.borderRect_.style['fillOpacity'] = 0;
  //this.setValue(this.getValue());
  this.fieldGroup_.querySelector("rect").style['fillOpacity'] = 0;
  this.fieldGroup_.querySelector("text").style['fill'] = "white";

  this.fieldGroup_.querySelector("text").style.transform = "translate(0,"+(10)+")";
};

Blockly.FieldNumber.prototype.updateWidth = function() {
  var width = Blockly.Field.getCachedWidth(this.textElement_);
  if (this.borderRect_) {
    this.borderRect_.setAttribute('width',
        width + Blockly.BlockSvg.SEP_SPACE_X);
  }
  this.size_.width = width;
  this.size_.height = width+Blockly.BlockSvg.SEP_SPACE_Y;
  console.log(this.sourceBlock_.getSvgRoot().querySelector("text"));
//  console.log(this.sourceBlock_.getSvgRoot().querySelector("text").tran=10);
  //console.log(this.fieldGroup_.querySelector("text").style);
this.sourceBlock_.getSvgRoot().querySelector("text").setAttribute('y',Math.max(this.size_.height/2,12));//.style.transform = "translate(0,"+(this.size_.height/2)+")";
};

/**
 * Set the maximum, minimum and precision constraints on this field.
 * Any of these properties may be undefiend or NaN to be disabled.
 * Setting precision (usually a power of 10) enforces a minimum step between
 * values. That is, the user's value will rounded to the closest multiple of
 * precision. The least significant digit place is inferred from the precision.
 * Integers values can be enforces by choosing an integer precision.
 * @param {number|string|undefined} min Minimum value.
 * @param {number|string|undefined} max Maximum value.
 * @param {number|string|undefined} precision Precision for value.
 */
Blockly.FieldNumber.prototype.setConstraints = function(min, max, precision) {
  precision = parseFloat(precision);
  this.precision_ = isNaN(precision) ? 0 : precision;
  min = parseFloat(min);
  this.min_ = isNaN(min) ? -Infinity : min;
  max = parseFloat(max);
  this.max_ = isNaN(max) ? Infinity : max;
  this.setValue(this.callValidator(this.getValue()));
};

/**
 * Ensure that only a number in the correct range may be entered.
 * @param {string} text The user's text.
 * @return {?string} A string representing a valid number, or null if invalid.
 */
Blockly.FieldNumber.prototype.classValidator = function(text) {
  if (text === null) {
    return null;
  }
  text = String(text);
  // TODO: Handle cases like 'ten', '1.203,14', etc.
  // 'O' is sometimes mistaken for '0' by inexperienced users.
  text = text.replace(/O/ig, '0');
  // Strip out thousands separators.
  text = text.replace(/,/g, '');
  var n = parseFloat(text || 0);
  if (isNaN(n)) {
    // Invalid number.
    return null;
  }
  // Round to nearest multiple of precision.
  if (this.precision_ && isFinite(n)) {
    n = Math.round(n / this.precision_) * this.precision_;
  }
  // Get the value in range.
  n = goog.math.clamp(n, this.min_, this.max_);
  return String(n);
};
