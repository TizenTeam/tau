/*
 * jQuery Mobile Widget @VERSION
 *
 * This software is licensed under the MIT licence (as defined by the OSI at
 * http://www.opensource.org/licenses/mit-license.php)
 *
 * ***************************************************************************
 * Copyright (c) 2000 - 2011 Samsung Electronics Co., Ltd.
 * Copyright (C) 2011 by Intel Corporation Ltd.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 * ***************************************************************************
 *
 * Authors: Gabriel Schulhof <gabriel.schulhof@intel.com>
 *          Daehyeon Jung <darrenh.jung@samsung.com>
 */

// Displays a simple two-state switch.
//
// To apply, add the attribute data-role="switch" to a <div>
// element inside a page. Alternatively, call switch()
// on an element, like this :
//
//     $("#myswitch").toggleswitch();
// where the html might be :
//     <div id="myswitch"></div>
//
// Options:
//     checked: Boolean; the state of the switch.(default: true)
//     texton: String; "On";
//     textoff: String; "Off";
//
// Events:
//     change: Emitted when the switch is changed.

(function ( $, undefined ) {

	$.widget( "tizen.toggleswitch", $.tizen.widgetex, {
		options: {
			texton			: "On",
			textoff			: "Off",
			checked			: true,
			initSelector	: ":jqmData(role='toggleswitch')"
		},

		_htmlProto: {
			ui: {
				container: "#container",
				mover: "#mover",
				on: "#on-span",
				off: "#off-span"
			}
		},

		destroy: function () {
			this._ui.container.remove();
			// restore original element
			this.element.show();
		},

		_value: {
			attr: "data-" + ($.mobile.ns || "") + "checked",
			signal: "change"
		},

		_setTexton: function ( text ) {
			this._ui.on.text( text );
			this.options.texton = text;
			this.element.attr( "data-" + ($.mobile.ns || "") + "texton", text );
		},

		_setTextoff: function ( text ) {
			this._ui.off.text( text );
			this.options.textoff = text;
			this.element.attr( "data-" + ($.mobile.ns || "") + "textoff", text );
		},

		_setChecked: function ( checked ) {
			if ( checked == this.options.checked ) {
				return;
			}

			this.options.checked = checked;
			this._setValue( checked );
			if ( checked ) {
				this._ui.container.addClass("ui-toggleswitch-state-checked");
			} else {
				this._ui.container.removeClass("ui-toggleswitch-state-checked");
			}
		},

		_setDisabled: function ( value ) {
			$.tizen.widgetex.prototype._setDisabled.call( this, value );
			this._ui.container[value ? "addClass" : "removeClass"]( "ui-disabled" );
		},

		_create: function () {
			var self = this;
			this.element.hide().after( this._ui.container );
			if ( this.element.jqmData("icon") ) {
				this._ui.container.addClass("ui-toggleswitch-image-style");
				this._ui.container.find(".ui-toggleswitch-text").hide();
				this._ui.container.find(".ui-toggleswitch-reed").hide();
				this._ui.container.find(".ui-toggleswitch-img").show();
			} else {
				this._ui.container.find(".ui-toggleswitch-img").hide();
			}

			$( this._ui.mover ).bind( "vclick", function () {
				self._setChecked( !self.options.checked );
				return false;
			});
		},

	});

	$( document ).bind( "pagecreate create", function ( e ) {
		$( $.tizen.toggleswitch.prototype.options.initSelector, e.target )
			.not( ":jqmData(role='none'), :jqmData(role='nojs')" )
			.toggleswitch();
	});


}( jQuery ));
