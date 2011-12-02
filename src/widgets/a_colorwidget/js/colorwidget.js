/*
	Copyright (c) 2011 Samsung Electronics Co., Ltd All Rights Reserved

	Licensed under the Apache License, Version 2.0 (the "License");
	you may not use this file except in compliance with the License.
	You may obtain a copy of the License at

	http://www.apache.org/licenses/LICENSE-2.0

	Unless required by applicable law or agreed to in writing, software
	distributed under the License is distributed on an "AS IS" BASIS,
	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	See the License for the specific language governing permissions and
	limitations under the License.
*/

(function($, undefined) {

$.widget("todons.colorwidget", $.mobile.widget, {
  options: {
    color: "#ff0972"
  },

  _create: function() {
    $.extend (this, {
      isInput: this.element.is("input")
    });

    /* "value", if present, takes precedence over "data-color" */
    if (this.isInput)
      if (this.element.attr("value").match(/#[0-9A-Fa-f]{6}/))
        this.element.attr("data-color", this.element.attr("value"));

    $.mobile.todons.parseOptions(this, true);
  },

  _setOption: function(key, value, unconditional) {
    if (undefined === unconditional)
      unconditional = false;
    if (key === "color")
      this._setColor(value, unconditional);
  },

  _setColor: function(value, unconditional) {
    if (value.match(/#[0-9A-Fa-f]{6}/) && (value != this.options.color || unconditional)) {
      this.options.color = value;
      this.element.attr("data-color", value);
      if (this.isInput)
        this.element.attr("value", value);
      this.element.triggerHandler("colorchanged", value);
      return true;
    }
    return false;
  },
});

})(jQuery);
