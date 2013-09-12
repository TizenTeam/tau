/*
* Module Name : widgets/jquery.mobile.tizen.triangle
* Copyright (c) 2010 - 2013 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
//>>description: Shows triangle, used by context popup
//>>label: Triangle
//>>group: Tizen:Widgets

define( [ 
	'license/MIT',
	'jquery',
	'../jquery.mobile.tizen.core',
	'./jquery.mobile.tizen.widgetex'
	], function ( ) {

//>>excludeEnd("jqmBuildExclude");

( function ($, undefined) {

	$.widget( "tizen.triangle", $.tizen.widgetex, {
		options: {
			extraClass: "",
			offset: null,
			color: null,
			location: "top",
			initSelector: ":jqmData(role='triangle')"
		},

		_create: function () {
			var triangle = $( "<div></div>", {"class" : "ui-triangle"} );

			$.extend(this, {
				_triangle: triangle
			});

			this.element.addClass( "ui-triangle-container" ).append( triangle );
		},

		_doCSS: function () {
			var location = ( this.options.location || "top" ),
				offsetCoord = ( ($.inArray(location, ["top", "bottom"]) === -1) ? "top" : "left"),
				cssArg = {
					"border-bottom-color" : "top"    === location ? this.options.color : "transparent",
					"border-top-color"    : "bottom" === location ? this.options.color : "transparent",
					"border-left-color"   : "right"  === location ? this.options.color : "transparent",
					"border-right-color"  : "left"   === location ? this.options.color : "transparent"
				};

			cssArg[offsetCoord] = this.options.offset;

			this._triangle.removeAttr( "style" ).css( cssArg );
		},

		_setOffset: function ( value ) {
			this.options.offset = value;
			this.element.attr( "data-" + ($.mobile.ns || "") + "offset", value );
			this._doCSS();
		},

		_setExtraClass: function ( value ) {
			this._triangle.addClass( value );
			this.options.extraClass = value;
			this.element.attr( "data-" + ($.mobile.ns || "") + "extra-class", value );
		},

		_setColor: function ( value ) {
			this.options.color = value;
			this.element.attr( "data-" + ($.mobile.ns || "") + "color", value );
			this._doCSS();
		},

		_setLocation: function ( value ) {
			this.element
				.removeClass( "ui-triangle-container-" + this.options.location )
				.addClass( "ui-triangle-container-" + value );
			this._triangle
				.removeClass( "ui-triangle-" + this.options.location )
				.addClass( "ui-triangle-" + value );

			this.options.location = value;
			this.element.attr( "data-" + ($.mobile.ns || "") + "location", value );

			this._doCSS();
		}
	});

	$( document ).bind( "pagecreate create", function ( e ) {
	    $($.tizen.triangle.prototype.options.initSelector, e.target)
	        .not(":jqmData(role='none'), :jqmData(role='nojs')")
	        .triangle();
	});

}(jQuery) );

//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
} );
//>>excludeEnd("jqmBuildExclude");
