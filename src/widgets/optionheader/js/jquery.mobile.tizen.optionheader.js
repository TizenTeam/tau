/*
 * jQuery Mobile Widget @VERSION
 *
 * This software is licensed under the MIT licence (as defined by the OSI at
 * http://www.opensource.org/licenses/mit-license.php)
 *
 * ***************************************************************************
 * Copyright (c) 2000 - 2011 Samsung Electronics Co., Ltd.
 * Copyright (c) 2011 by Intel Corporation Ltd.
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
 * Authors: Elliot Smith <elliot.smith@intel.com>
 */

// optionheader provides a collapsible toolbar for buttons and
// segmented controls directly under the title bar. It
// wraps a jQuery Mobile grid in a collapsible container; clicking
// on the container, or on one of the buttons inside the container,
// will collapse it.
//
// To add an option header to a page, mark up the header with a
// data-role="optionheader" attribute, as shown in this example:
//
// <div data-role="header">
//     <h1>Option header - 3 buttons example</h1>
//     <div data-role="optionheader">
//        <div class="ui-grid-b">
//             <div class="ui-block-a"><a data-role="button">Previous</a></div>
//             <div class="ui-block-b"><a data-role="button">Cancel</a></div>
//             <div class="ui-block-c"><a data-role="button">Next</a></div>
//        </div>
//     </div>
// </div>
//
// The optionheader can also be used inline (e.g. in a content block or
// a widget).
//
// Alternatively, use $('...').optionheader() to apply programmatically.
//
// The grid inside the optionheader should be marked up as for
// a standard jQuery Mobile grid. (The widget has been tested with one
// or two rows of 2-4 columns each.)
//
// Note that if you use this with fixed headers, you may find that
// expanding the option header increases the page size so that scrollbars
// appear (jQuery Mobile's own collapsible content areas cause the
// same issue). You can alleviate this somewhat by calling the show() method
// on the page toolbars each time the size of the header changes.
//
// The widget is configurable via a data-options attribute on the same
// div as the data-role="optionheader" attribute, e.g.
//
// <div data-role="header">
//     <h1>Option header - configured</h1>
//     <div data-role="optionheader" data-options='{"collapsed":true, "duration":1.5}'>
//        <div class="ui-grid-b">
//             <div class="ui-block-a"><a data-role="button">Previous</a></div>
//             <div class="ui-block-b"><a data-role="button">Cancel</a></div>
//             <div class="ui-block-c"><a data-role="button">Next</a></div>
//        </div>
//     </div>
// </div>
//
// Options can also be set with $(...).optionheader('option', 'name', value).
// However, if you do this, you'll need to call $(...).optionheader('refresh')
// afterwards for the new values to take effect (note that optionheader()
// can be applied multiple times to an element without side effects).
//
// See below for the available options.
//
// Theme: by default, gets a 'b' swatch; override with data-theme="X"
// as per usual
//
// Options (can be set with a data-options attribute):
//
//   {Boolean} [showIndicator=true] Set to true (the default) to show
//   the upward-pointing arrow indicator on top of the title bar.
//   {Boolean} [startCollapsed=false] Sets the appearance when the option
//   header is first displayed; defaults to false (i.e. show the header
//   expanded on first draw). NB setting this option later has no
//   effect: use collapse() to collapse a widget which is already
//   drawn.
//   {Boolean} [expandable=true] Sets whether the header will expand
//   in response to clicks; default = true.
//   {Float} [duration=0.25] Duration of the expand/collapse animation.
//
// Methods (see below for docs):
//
//   toggle(options)
//   expand(options)
//   collapse(options)
//
// Events:
//
//   expand: Triggered when the option header is expanded
//   collapse: Triggered when the option header is collapsed
//


(function($, undefined) {
$.widget("tizen.optionheader", $.mobile.widget, {
//$.widget("todons.optionheader", $.todons.widgetex, {
	options: {
		initSelector: ":jqmData(role='optionheader')",
		showIndicator: true,
		theme: 's',
		startCollapsed: false,
		expandable: true,
		duration: 0.25,
		collapseOnInit : true
	},
	collapsedHeight: '5px',

	_create: function () {
		var options,
			theme,
			self = this,
			elementHeight = 106,
			parentPage,
			dataOptions = this.element.jqmData( 'options' );

		// parse data-options
		$.extend( this.options, dataOptions );

		this.isCollapsed = this.options.collapseOnInit;
		this.expandedHeight = null;

		// parse data-theme and reset options.theme if it's present
		theme = this.element.jqmData( 'theme' ) || this.options.theme;
		this.options.theme = theme;

		this.element.closest( ':jqmData(role="header")' ).addClass( "ui-option-header-resizing" );

		// set up the click handler; it's done here so it can
		// easily be removed, as there should only be one instance
		// of the handler function for each class instance
		this.clickHandler = function () {
			self.toggle();
		};

		if( this.element.height() < elementHeight ){
			this.element.css( "height", elementHeight );
		}

		// get the element's dimensions
		// and to set its initial collapse state;
		// either do it now (if the page is visible already)
		// or on pageshow
		page = this.element.closest( ':jqmData(role="page")' );

		if ( page.is(":visible") ){
			self.refresh();
			self._realize();
		} else {
			self.refresh();

		page.bind( "pagebeforeshow", function() {
			self._setArrowLeft();
			self._realize();
			});
		}
		self._setArrowLeft();
//        this.refresh();
	},

	_realize: function () {
		if ( !this.expandedHeight ) {
			this.expandedHeight = this.element.height();
		}

		if ( this.isCollapsed ) {
//        if (this.options.startCollapsed) {
			this.collapse( {duration: 0} );
		}
	},

	_setArrowLeft: function () {
		var matchingBtn = $( this.element ).jqmData( "for" ),
			arrowCenter = 14,
			btn2Position = 10,
			btn3Position = 144;

		if( $(this.element).parents(".ui-page").find("#"+matchingBtn).length != 0 ){
			matchBtn = $( this.element ).parents( ".ui-page" ).find( "#" + matchingBtn );
 			

			if ( this.options.expandable ) {
				matchBtn.bind( 'vclick', this.clickHandler );
			} else {
				matchBtn.unbind( 'vclick', this.clickHandler );
			}

 			// decide arrow Button position
			if( matchBtn.css( "left" ) && matchBtn.css( "left" ) != "auto" ){
				$( ".ui-triangle-image" ).css( "left", matchBtn.width()/2 + parseInt(matchBtn.css("left")) - arrowCenter + "px" );
			} else if( matchBtn.css("right") ){
				buttonRight = matchBtn.nextAll().is( "a" ) ? btn3Position : btn2Position;
				$( ".ui-triangle-image" ).css( "left", document.documentElement.clientWidth - matchBtn.width()/2 - buttonRight - arrowCenter + "px" );
			}
		} else {
			$( ".ui-triangle-image" ).css( "left", document.documentElement.clientWidth/2 - arrowCenter + "px" );
		}
	},
	// Draw the option header, according to current options
	refresh: function () {
		var el = this.element,
			arrow = $( '<div class="ui-option-header-triangle-arrow"></div>' ),
			optionHeaderClass = 'ui-option-header',
			self = this,
			gridRowSelector = '.ui-grid-a,.ui-grid-b,.ui-grid-c,.ui-grid-d,.ui-grid-e',
			theme = this.options.theme,
			numRows,
			rowsClass,
			themeClass;

		var $this = $( this ),
			o = $.extend({
				grid: null
			}),
			$kids = el.find( "div" ).eq( 0 ).children().children(),
			gridCols = {solo:1, a:2, b:3, c:4, d:5},
			grid = o.grid,
			iterator;

		if ( !grid ) {
			if ( $kids.length <= 5 ) {
				for ( var letter in gridCols ) {
					if ( gridCols[ letter ] === $kids.length ) {
						grid = letter;
					}
				}
				numRows = $kids.length / gridCols[grid];
			} else {
				numRows = 2;
			}
		}

        // count ui-grid-* elements to get number of rows
//        numRows = el.find(gridRowSelector).length;

        // ...at least one row
//        numRows = Math.max(1, numRows);

        // add classes to outer div:
        //   ui-option-header-N-row, where N = options.rows
        //   ui-bar-X, where X = options.theme (defaults to 'c')
        //   ui-option-header
		rowsClass = 'ui-option-header-' + numRows + '-row';
		themeClass = 'ui-body-' + this.options.theme;

		el.removeClass( rowsClass ).addClass( rowsClass );
		el.removeClass( themeClass ).addClass( themeClass );
		el.removeClass( optionHeaderClass ).addClass( optionHeaderClass );

		// remove any arrow currently visible
		el.prev( '.ui-option-header-triangle-arrow' ).remove();
//        el.prev('.ui-triangle-container').remove();

		// if there are elements inside the option header
		// and this.options.showIndicator,
		// insert a triangle arrow as the first element inside the
		// optionheader div to show the header has hidden content
		if( this.options.showIndicator ) {
			el.before( arrow );
			arrow.append("<div class='ui-triangle-image'></div>");
//            arrow.triangle({"color": el.css('background-color'), offset: "50%"});
		}

        // if expandable, bind clicks to the toggle() method
		if( this.options.expandable ) {
//            el.unbind('vclick', this.clickHandler).bind('vclick', this.clickHandler);
//            arrow.unbind('vclick', this.clickHandler).bind('vclick', this.clickHandler);
			el.bind( 'vclick', this.clickHandler );
			arrow.bind( 'vclick', this.clickHandler );

		} else {
			el.unbind( 'vclick', this.clickHandler );
			arrow.unbind( 'vclick', this.clickHandler );
		}

		// for each ui-grid-a element, add a class ui-option-header-row-M
		// to it, where M is the xpath position() of the div
/*        el.find(gridRowSelector).each(function (index) {
            var klass = 'ui-option-header-row-' + (index + 1);
            $(this).removeClass(klass).addClass(klass);
        });*/
		var klass = 'ui-option-header-row-' + ( numRows );
		el.find( "div" ).eq( 0 ).removeClass( klass ).addClass( klass );

		// redraw the buttons (now that the optionheader has the right
		// swatch)
		el.find( '.ui-btn' ).each(function () {
			$( this ).attr( 'data-' + $.mobile.ns + 'theme', theme );

			// hack the class of the button to remove the old swatch
			var klass = $( this ).attr( 'class' );
			klass = klass.replace(/ui-btn-up-\w{1}\s*/, '');
			klass = klass + ' ui-btn-up-' + theme;
			$( this ).attr( 'class', klass );
		});
	},

	_setHeight: function ( height, isCollapsed, options ) {
		var self = this,
			duration,
			commonCallback,
			callback;

		options = options || {};

		// set default duration if not specified
		duration = options.duration;
		if ( typeof duration == 'undefined' ) {
			duration = this.options.duration;
		}

		// the callback to always call after expanding or collapsing
		commonCallback = function () {
			self.isCollapsed = isCollapsed;

			if ( isCollapsed ) {
				self.element.trigger( 'collapse' );
			} else {
				self.element.trigger( 'expand' );
			}
		};

		// combine commonCallback with any user-specified callback
		if ( options.callback ) {
			callback = function () {
				options.callback();
				commonCallback();
			};
		} else {
			callback = function () {
				commonCallback();
			}
		}

		// apply the animation
		if( duration > 0 && $.support.cssTransitions ) {
			// add a handler to invoke a callback when the animation is done
			var elt = this.element.get( 0 );

			var handler = {
				handleEvent: function ( e ) {
					elt.removeEventListener( 'webkitTransitionEnd', this );
					self.element.css( '-webkit-transition', null );
					callback();
				}
			};

			elt.addEventListener( 'webkitTransitionEnd', handler, false );

			// apply the transition
			this.element.css( '-webkit-transition', 'height ' + duration + 's ease-out' );
			this.element.css( 'height', height );
		}
		// make sure the callback gets called even when there's no
		// animation
		else {
			this.element.css( 'height', height );
			callback();
		}
	},

	/**
	* Toggle the expanded/collapsed state of the widget.
	* {Object} [options] Configuration for the expand/collapse
	* {Integer} [options.duration] Duration of the expand/collapse;
	* defaults to this.options.duration
	* {Function} options.callback Function to call after toggle completes
	*/

	toggle: function ( options ) {
		var toggle_header = this.element.parents( ":jqmData(role='header')" );
		var toggle_content = this.element.parents( ":jqmData(role='page')" ).find( ".ui-content" );
		var CollapsedTop = 110,
			ExpandedTop = 206; 

		if( toggle_header.children().is(".input-search-bar") ){
			CollapsedTop = 218;
			ExpandedTop = 314;
		}

		if( $( window ).scrollTop() <= CollapsedTop ){
			toggle_header.css( "position", "relative" );
			toggle_content.css( "top", "0px" );
    	}

		if( this.isCollapsed ){
			this.expand( options );

			if( $( window ).scrollTop() <= ExpandedTop ){
				var t = setTimeout( function(){  
					toggle_header.css( 'position', 'fixed' );
					toggle_content.css( 'top', ExpandedTop + "px" );
				}, 500 );
			} else {
				//   Need to move scroll top      		
				toggle_header.css( 'position', 'fixed' );
				toggle_content.css( 'top', ExpandedTop + "px" );
			}
			this.options.collapseOnInit = false;
		} else {
			this.collapse( options );
			if( $(window).scrollTop() <= ExpandedTop ){
				var t = setTimeout( function(){
				toggle_header.css( 'position', 'fixed' );
				toggle_content.css( 'top', CollapsedTop + "px" );
			}, 500 );
		} else{
			toggle_header.css( 'position', 'fixed' );
			toggle_content.css( 'top', CollapsedTop + "px" );
			}
		}
		this.options.collapseOnInit = true;
	},
	_setDisabled: function( value ) {
		$.Widget.prototype._setOption.call( this, "disabled", value );
		this.element.add( this.element.prev(".ui-triangle-container") )[value ? "addClass" : "removeClass"]("ui-disabled");
	},
	/**
	* Takes the same options as toggle()
	*/
	collapse: function ( options ) {
//        if (!this.isCollapsed) {
		this._setHeight( '10px', true, options );
//        }
	},

	/**
	* Takes the same options as toggle()
	*/
	expand: function ( options ) {
//        if (this.isCollapsed) {
		this._setHeight( this.expandedHeight, false, options );
//        }
	}
});

// auto self-init widgets
$(document).bind("pagecreate create", function (e) {
    $($.tizen.optionheader.prototype.options.initSelector, e.target)
    .not(":jqmData(role='none'), :jqmData(role='nojs')")
    .optionheader();
});

})(jQuery);
