// progress
(function ($, window, undefined) {
	$.widget("tizen.progress", $.mobile.widget, {
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
