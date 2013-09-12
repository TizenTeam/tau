/*
* Module Name : widgets/jquery.mobile.tizen.progress
* Copyright (c) 2010 - 2013 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
//>>description: Shows progressbar or progress circle
//>>label: Progress
//>>group: Tizen:Widgets

define( [ 
	'license/MIT',
	'jquery',
	'../jquery.mobile.tizen.core'
	], function ( jQuery ) {

//>>excludeEnd("jqmBuildExclude");

/*
 * Progress widget
 *
 * HTML Attributes
 *
 *  data-role: set to 'progress'.
 *  data-style: 'circle' or 'pending'.
 *
 * APIs
 *
 *  show(): show the progress.
 *  hide(): hide the progress.
 *  running(boolean): start or stop the running.
 *
 * Events
 *
 *  N/A
 *
 * Examples
 *
 * <li data-role="list-divider">Progress Pending</li>
 * <li>
 *	<div data-role="progress" data-style="pending" id="pending"></div>
 * </li>
 * <li data-role="list-divider">Progress ~ing</li>
 * <li>
 *	<div data-role="progress" data-style="circle" id="progress"></div>Loading..
 * </li>
 *
 * $("#pending").progress( "running", true );
 * $("#progress").progress( "running", true );
 *
 */

/**
	@class Progress
	The progress widget shows that an operation is in progress. <br/>To add a progress widget to the application, use the following code:

		<div data-role="progress" data-style="circle"></div>
*/
/**
	@property {String} data-style
	Sets the style of the progress widget. The style options are pending (pending progress style) and circle (circular progress status style).
*/
/**
	@method running
	The running method is used to set the current running state of the pending or circular progress widget:

		<div id="foo" data-role="progress" data-style="pending"></div>
		$("#foo").progress("running", true);
*/
/**
	@method show
	The show method is used to show the pending or circular progress widget:

		<div id="foo" data-role="progress" data-style="pending"></div>
		$("#foo").progress("show");
*/
/**
	@method hide
	The show method is used to hide the pending or circular progress widget:

		<div id="foo" data-role="progress" data-style="pending"></div>
		$("#foo").progress("hide");
*/

(function ( $, window, undefined ) {
	$.widget( "tizen.progress", $.mobile.widget, {
		options: {
			style: "circle",
			running: false
		},

		show: function () {
			$( this.element ).show();
		},

		hide: function () {
			$( this.element ).hide();
		},

		_start: function () {
			if ( !this.init ) {
				$( this.element ).append( this.html );
				this.init = true;
			}

			this.show();

			$( this.element )
				.find( ".ui-progress-" + this.options.style )
				.addClass( this.runningClass );
		},

		_stop: function () {
			$( this.element )
				.find( ".ui-progress-" + this.options.style )
				.removeClass( this.runningClass );
		},

		running: function ( running ) {
			if ( running === undefined ) {
				return this.options.running;
			}

			this._setOption( "running", running );
		},

		_setOption: function ( key, value ) {
			if ( key === "running" ) {
				if ( typeof value !== "boolean" ) {
					window.alert( "running value MUST be boolean type!" );
					return;
				}

				this.options.running = value;
				this._refresh();
			}
		},

		_refresh: function () {
			if ( this.options.running ) {
				this._start();
			} else {
				this._stop();
			}
		},

		_create: function () {
			var self = this,
				element = this.element,
				style = element.jqmData( "style" ),
				_html,
				runningClass;

			if ( style ) {
				this.options.style = style;
			} else {
				style = this.options.style;
			}

			if ( style == "circle" ) {
				$( this.element ).addClass("ui-progress-container-circle");

				_html =	'<div class="ui-progress-circle"></div>';
			} else if ( style === "pending" ) {
				$( this.element ).addClass("ui-progressbar");

				_html = '<div class="ui-progressbar-bg">' +
						'<div class="ui-progress-pending"></div>' +
					'</div>';
			}

			this.html = $( _html );

			runningClass = "ui-progress-" + style + "-running";

			$.extend( this, {
				init: false,
				runningClass: runningClass
			} );

			if ( style === "pending" ) {
				$( this.element ).append( this.html );
				this.init = true;
			}

			this._refresh();
		}
	} ); /* End of widget */

	$( document ).bind( "pagecreate create", function ( e ) {
		$( e.target ).find( ":jqmData(role='progress')" ).progress();
	} );
}( jQuery, this ));

//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
} );
//>>excludeEnd("jqmBuildExclude");
