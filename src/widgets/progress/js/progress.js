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

(function ($, window, undefined) {
	$.widget("todons.progress", $.mobile.widget, {
		options: {
			style: "circle",
			running: false
		},

		_show: function () {
			if ( !this.init ) {
				$(this.element).append(this.html);
				this.init = true;
			}
			var style = this.options.style;
			$(this.element).addClass("ui-progress-container-" + style+ "-bg");
			$(this.element).find(".ui-progress-"+style )
				.addClass( this.runningClass );
		},

		_hide: function () {
			$(this.element).find(".ui-progress-"+ this.options.style )
				.removeClass( this.runningClass );
		},

		running: function( newRunning ) {
			// get value
			if ( newRunning === undefined ) {
				return this.options.running;
			}

			// set value
			this._setOption( "running", newRunning );
			return this;
		},

		_setOption: function( key, value ) {
			if ( key === "running" ) {
				// normalize invalid value
				if ( typeof value !== "boolean" ) {
					alert("running value MUST be boolean type!");
					return;
				}
				this.options.running = value;
				this._refresh();
			}
		},

		_refresh: function() {
			if ( this.options.running )
				this._show();
			else
				this._hide();
		},

		_create: function () {
			var self = this,
			element = this.element,
			style = element.jqmData( "style" );

			if ( style )
				this.options.style = style;

			this.html = $('<div class="ui-progress-container-'+ style + '">' +
					'<div class="ui-progress-' + style + '"></div>' +
					'</div>');
			var runningClass = "ui-progress-" + style + "-running";

			$.extend( this, {
				init: false,
				runningClass: runningClass
			});
			this._refresh();
		},
	}); /* End of widget */

	// auto self-init widgets
	$(document).bind("pagecreate", function (e) {
		$(e.target).find(":jqmData(role='progress')").progress();
	});
})(jQuery, this);
