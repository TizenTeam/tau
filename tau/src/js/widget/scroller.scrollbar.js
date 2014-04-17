//>>excludeStart("microBuildExclude", pragmas.microBuildExclude);

/*
  * Copyright (c) 2013 Samsung Electronics Co., Ltd
  *
  * Licensed under the Flora License, Version 1.1 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *     http://floralicense.org/license/
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed fastOn an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */

define([
	"../ns",
	"../helper",
	"./scroller.core"], function( ns ) {
//>>excludeEnd("microBuildExclude");

( function( ns, window, undefined ) {
"use strict";

var Scroller = ns.Scroller;

if ( Scroller.Scrollbar ) {
	return;
}

Scroller.Scrollbar = function( scrollElement, options ) {

	this.element = null;
	this.barElement = null;

	this.container = null;
	this.clip = null;

	this.options = {};
	this.type = null;

	this.maxScroll;
	this.started = false;
	this.displayDelayTimeoutId = null;

	this._create( scrollElement, options );
};

Scroller.Scrollbar.prototype = {
	_create: function( scrollElement, options ) {
		this.container = scrollElement;
		this.clip = scrollElement.children[0];

		this._initOptions(options);
		this._init();
	},

	_initOptions: function( options ) {
		options = ns.extendObject({
			type: false,
			displayDelay: 700,
			sections: null,
			orientation: Scroller.Orientation.VERTICAL
		}, options);

		this.setOptions( options );
	},

	_init: function() {
		var type = this.options.type;

		if ( !type ) {
			return;
		}

		this.type = Scroller.Scrollbar.Type[type];
		if ( !this.type ) {
			throw "Bad options. [type : " + this.options.type + "]";
		}

		this._createScrollbar();
	},

	_createScrollbar: function() {
		var sections = this.options.sections,
			orientation = this.options.orientation,
			wrapper = document.createElement("DIV"),
			bar = document.createElement("span");

		wrapper.appendChild(bar);

		this.type.insertAndDecorate({
			orientation: orientation,
			wrapper: wrapper,
			bar: bar,
			container: this.container,
			clip: this.clip,
			sections: sections
		});

		this.element = wrapper;
		this.barElement = bar;
	},

	_removeScrollbar: function() {
		if ( this.element ) {
			this.element.parentNode.removeChild(this.element);
		}

		this.element = null;
		this.barElement = null;
	},

	setOptions: function (options) {
		ns.extendObject(this.options, options);
	},

	refresh: function () {
		this.clear();
		this.init();
	},

	translate: function( offset, duration ) {
		var orientation = this.options.orientation,
			translate, transition, barStyle, endDelay;

		if ( !this.element || !this.type ) {
			return;
		}

		offset = this.type.offset( orientation, offset );

		barStyle = this.barElement.style;
		if ( !duration ) {
			transition = "none";
		} else {
			transition = "-webkit-transform " + duration / 1000 + "s ease-out";
		}

		translate = "translate3d(" + offset.x + "px," + offset.y + "px, 0)";

		barStyle["-webkit-transform"] = translate;
		barStyle["-webkit-transition"] = transition;

		if ( !this.started ) {
			this._start();
		}

		endDelay = ( duration || 0 ) + this.options.displayDelay;
		if ( this.displayDelayTimeoutId !== null ) {
			window.clearTimeout( this.displayDelayTimeoutId );
		}
		this.displayDelayTimeoutId = window.setTimeout(this._end.bind(this), endDelay);
	},

	_start: function() {
		this.type.start(this.element, this.barElement);
		this.started = true;
	},

	_end : function() {
		this.started = false;
		this.displayDelayTimeoutId = null;

		if ( this.type ) {
			this.type.end(this.element, this.barElement);
		}
	},

	_clear: function() {
		this._removeScrollbar();

		this.started = false;
		this.type = null;
		this.element = null;
		this.barElement = null;
		this.displayDelayTimeoutId = null;
	},

	destroy: function() {
		this._clear();

		this.options = null;
		this.container = null;
		this.clip = null;
	}
};

Scroller.Scrollbar.Type = {};

//interface Scroller.Indicator.Type 
Scroller.Scrollbar.Type.Interface = {
	insertAndDecorate: function(/* options */) {},
	start: function(/* scrollbarElement, barElement */) {},
	end: function(/* scrollbarElement, barElement */) {},
	offset: function(/* orientation, offset  */) {}
};

Scroller.Scrollbar.Type.bar = ns.extendObject( {}, Scroller.Scrollbar.Type.Interface, {
	options: {
		wrapperClass: "ui-scrollbar-bar-type",
		barClass: "ui-scrollbar-indicator",
		orientationClass: "ui-scrollbar-",
		margin: 2,
		animationDuration: 500
	},

	insertAndDecorate: function( data ) {
		var scrollbarElement = data.wrapper,
			barElement = data.bar,
			container = data.container,
			clip = data.clip,
			orientation = data.orientation,
			margin = this.options.margin,
			clipSize = orientation === Scroller.Orientation.VERTICAL ? clip.offsetHeight : clip.offsetWidth,
			containerSize = orientation === Scroller.Orientation.VERTICAL ? container.offsetHeight : container.offsetWidth,
			orientationClass = this.options.orientationClass + (orientation === Scroller.Orientation.VERTICAL ? "vertical" : "horizontal"),
			barStyle = barElement.style;

		this.containerSize = containerSize;
		this.maxScrollOffset = clipSize - containerSize;
		this.scrollZoomRate = containerSize / clipSize;
		this.barSize = window.parseInt( containerSize / (clipSize/containerSize)  ) - ( margin * 2 );

		scrollbarElement.className = this.options.wrapperClass + " " + orientationClass;
		barElement.className = this.options.barClass;

		if ( orientation === Scroller.Orientation.VERTICAL ) {
			barStyle.height =  this.barSize + "px";
			barStyle.top = "0px";
		} else {
			barStyle.width =  this.barSize + "px";
			barStyle.left = "0px";
		}

		container.appendChild(scrollbarElement);
	},

	offset: function( orientation, offset ) {
		var x, y, offset;

		offset = offset !== this.maxScrollOffset ?
				offset * this.scrollZoomRate :
				this.containerSize - this.barSize - this.options.margin * 2;

		if ( orientation === Scroller.Orientation.VERTICAL ) {
			x = 0;
			y = offset;
		} else {
			x = offset;
			y = 0;
		}

		return {
			x: x,
			y: y
		};
	},

	start: function( scrollbarElement/*, barElement */) {
		var style = scrollbarElement.style,
		duration = this.options.animationDuration;
		style["-webkit-transition"] = "opacity " + duration / 1000 + "s ease";
		style.opacity = 1;
	},

	end: function( scrollbarElement/*, barElement */) {
		var style = scrollbarElement.style,
		duration = this.options.animationDuration;
		style["-webkit-transition"] = "opacity " + duration / 1000 + "s ease";
		style.opacity = 0;
	}
});

Scroller.Scrollbar.Type.tab = ns.extendObject( {}, Scroller.Scrollbar.Type.Interface, {
	options: {
		wrapperClass: "ui-scrollbar-tab-type",
		barClass: "ui-scrollbar-indicator",
		margin: 1
	},

	insertAndDecorate: function( data ) {
		var scrollbarElement = data.wrapper,
			barElement = data.bar,
			container = data.container,
			clip = data.clip,
			sections = data.sections,
			orientation = data.orientation,
			margin = this.options.margin,
			clipWidth = clip.offsetWidth,
			clipHeight = clip.offsetHeight,
			containerWidth = container.offsetWidth,
			containerHeight = container.offsetHeight,
			clipSize = orientation === Scroller.Orientation.VERTICAL ? clipHeight : clipWidth,
			containerSize = orientation === Scroller.Orientation.VERTICAL ? containerHeight : containerWidth,
			sectionSize = clipSize / containerSize,
			height,  barHeight, i, len;

		this.containerSize = containerWidth;
		this.maxScrollOffset = clipSize - containerSize;
		this.scrollZoomRate = containerWidth / clipSize;
		this.barSize = window.parseInt( (containerWidth - margin * 2 * (sectionSize-1)) / sectionSize  );

		scrollbarElement.className = this.options.wrapperClass;
		barElement.className = this.options.barClass;

		barElement.style.width = this.barSize + "px";
		barElement.style.left = "0px";

		container.insertBefore(scrollbarElement, clip);

		// reset page container and section layout.
		barHeight = barElement.offsetHeight;
		height = clipHeight - barHeight;
		clip.style.height = height + "px";
		if ( sections && sections.length ) {
			for ( i=0, len=sections.length; i <len; i++ ) {
				sections[i].style.height = height + "px";
			}
		}
	},

	offset: function( orientation, offset ) {
		return {
			x: offset === 0 ? -1 :
				offset !== this.maxScrollOffset ? offset * this.scrollZoomRate :
					this.containerSize - this.barSize - this.options.margin,
			y: 0
		};
	}

});

} ( ns, window ) );

//>>excludeStart("microBuildExclude", pragmas.microBuildExclude);
});
//>>excludeEnd("microBuildExclude");
