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

( function ( ns, window, undefined ) {
"use strict";

var Scroller = ns.Scroller;

if ( Scroller.Effect ) {
	return;
}

Scroller.Effect = {};
Scroller.Effect.Bouncing = function( scrollerElement, options ) {

	this.orientation;
	this.maxValue;

	this.container;
	this.minEffectElement;
	this.maxEffectElement;
	this.targetElement;

	this.isShow = false;
	this.isDrag = false;
	this.isShowAnimating = false;
	this.isHideAnimating = false;

	this._create( scrollerElement, options );
};

Scroller.Effect.Bouncing.prototype = {
	options : {
		className: "ui-scrollbar-bouncing-effect",
		duration: 500
	},

	_create: function(scrollerElement, options) {
		this.container = scrollerElement;

		this.orientation = options.orientation;
		this.maxValue = this._getValue( options.maxScrollX, options.maxScrollY);

		this._initLayout();
	},

	_initLayout: function() {
		var minElement = this.minEffectElement = document.createElement("DIV"),
			maxElement = this.maxEffectElement = document.createElement("DIV"),
			className = this.options.className;

		if ( this.orientation === Scroller.Orientation.HORIZONTAL ) {
			minElement.className = className + " ui-left";
			maxElement.className = className + " ui-right";
		} else {
			minElement.className = className + " ui-top";
			maxElement.className = className + " ui-bottom";
		}

		this.container.appendChild( minElement );
		this.container.appendChild( maxElement );

		minElement.addEventListener("webkitAnimationEnd", this);
		maxElement.addEventListener("webkitAnimationEnd", this);
	},

	drag: function( x, y ) {
		this.isDrag = true;
		this._checkAndShow( x, y );
	},

	dragEnd: function() {
		if ( this.isShow && !this.isShowAnimating && !this.isHideAnimating ) {
			this._beginHide();
		}

		this.isDrag = false;
	},

	end: function(x, y) {
		this._checkAndShow( x, y );
	},

	show: function() {
		if ( this.targetElement ) {
			this.isShow = true;
			this._beginShow();
		}
	},

	hide: function() {
		if ( this.isShow ) {
			this.minEffectElement.style.display = "none";
			this.maxEffectElement.style.display = "none";
			this.targetElement.classList.remove("ui-hide");
			this.targetElement.classList.remove("ui-show");
		}
		this.isShow = false;
		this.isShowAnimating = false;
		this.isHideAnimating = false;
		this.targetElement = null;
	},

	_checkAndShow: function( x, y ) {
		var val = this._getValue(x, y);
		if ( !this.isShow ) {
			if ( val >= 0 ) {
				this.targetElement = this.minEffectElement;
				this._beginShow();
			} else if ( val <= this.maxValue ) {
				this.targetElement = this.maxEffectElement;
				this._beginShow();
			}

		} else if ( this.isShow && !this.isDrag && !this.isShowAnimating && !this.isHideAnimating ) {
			this._beginHide();
		}
	},

	_getValue: function(x, y) {
		return this.orientation === Scroller.Orientation.HORIZONTAL ? x : y;
	},

	_beginShow: function() {
		if ( !this.targetElement || this.isShowAnimating ) {
			return;
		}

		this.targetElement.style.display = "block";

		this.targetElement.classList.remove("ui-hide");
		this.targetElement.classList.add("ui-show");

		this.isShow = true;
		this.isShowAnimating = true;
		this.isHideAnimating = false;
	},

	_finishShow: function() {
		this.isShowAnimating = false;
		if ( !this.isDrag ) {
			this.targetElement.classList.remove("ui-show");
			this._beginHide();
		}
	},

	_beginHide: function() {
		if ( this.isHideAnimating ) {
			return;
		}

		this.targetElement.classList.remove("ui-show");
		this.targetElement.classList.add("ui-hide");

		this.isHideAnimating = true;
		this.isShowAnimating = false;
	},

	_finishHide: function() {
		this.isHideAnimating = false;
		this.targetElement.classList.remove("ui-hide");
		this.hide();
		this._checkAndShow();
	},

	handleEvent: function( event ) {
		switch (event.type) {
		case "webkitAnimationEnd":
			if ( this.isShowAnimating ) {
				this._finishShow();
			} else if ( this.isHideAnimating ) {
				this._finishHide();
			}
			break;
		}
	},

	destroy: function() {
		this.minEffectElement.removeEventListener("webkitAnimationEnd", this);
		this.maxEffectElement.removeEventListener("webkitAnimationEnd", this);

		this.container.removeChild( this.minEffectElement );
		this.container.removeChild( this.maxEffectElement );

		this.container = null;
		this.minEffectElement = null;
		this.maxEffectElement = null;
		this.targetElement = null;

		this.isShow = null;
		this.orientation = null;
		this.maxValue = null;
	}
};

} ( ns, window ) );

//>>excludeStart("microBuildExclude", pragmas.microBuildExclude);
});
//>>excludeEnd("microBuildExclude");