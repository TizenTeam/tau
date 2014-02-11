/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/

( function ( window, $, ns, undefined ) {

/*
 * IndexScrollbar
 *
 * Shows an index scrollbar, and triggers 'select' event.
 */
function IndexScrollbar (element, options) {
	// Support calling without 'new' keyword
	if(ns === this) {
		return new IndexScrollbar(element);
	}

	if(!this._isValidElement(element)) {
		throw "Invalid element is given";
	}

	this.element = element;
	this.indicator = null;
	this.index = null;
	this.isShowIndicator = false;
	this.touchAreaOffsetLeft = 0;
	this.indexElements = null;
	this.selectEventTriggerTimeoutId = null;

	this.indexCellInfomations = {
		indices: [],
		mergedIndices: [],
		indexLookupTable: [],

		clear: function() {
			this.indices.length = 0;
			this.mergedIndices.length = 0;
			this.indexLookupTable.length = 0;
		}
	};

	this.eventHandlers = {};

	this._setOptions(options);

	// Skip init when the widget is already extended
	if(!this._isExtended()) {
		this._create();
	}

	this._init();

	return this;
}

IndexScrollbar.prototype = {
	widgetName: "IndexScrollbar",
	widgetClass: "ui-indexscrollbar",

	options: {
		moreChar: "*",
		indicatorClass: "ui-indexscrollbar-indicator",
		selectedClass: "ui-state-selected",
		delimeter: ",",
		index: [
			"A", "B", "C", "D", "E", "F", "G", "H",
			"I", "J", "K", "L", "M", "N", "O", "P", "Q",
			"R", "S", "T", "U", "V", "W", "X", "Y", "Z", "1"
		],
		maxIndexSize: 9,
		keepSelectEventDelay: 50,
		container: null
	},

	_create: function () {
		this._createIndicator();

		// Read index, and add supplement elements
		this._updateLayout();

		// Bind event handler:
		this._bindEvent();

		// Mark as extended
		this._extended(true);
	},

	_init: function () {

	},

	_setOptions: function (options) {
		var name;

		for ( name in options ) {
			if ( options.hasOwnProperty(name) && !!options[name] ) {
				this.options[name] = options[name];
			}
		}
	},

	_updateLayout: function() {
		var container = this._getContainer(),
			positionStyle = window.getComputedStyle(container).position,
			containerOffsetTop = container.offsetTop,
			containerOffsetLeft = container.offsetLeft;

		if ( this.indicator ) {
			this.indicator.style.width = container.offsetWidth + "px";
			this.indicator.style.height = container.offsetHeight + "px";
		}

		if ( positionStyle !== "absolute" && positionStyle !== "relative" ) {
			this.element.style.top = containerOffsetTop + "px";
			this.indicator.style.top = containerOffsetTop + "px";
			this.indicator.style.left = containerOffsetLeft + "px";
		}

		this._updateIndexCellInfomation();
		this._draw();
		this._updateIndexCellRectInfomation();

		this.touchAreaOffsetLeft = this.element.offsetLeft - 10;
	},

	_updateIndexCellInfomation: function() {
		var maxIndexSize = this.options.maxIndexSize,
			indices = this._getIndex(),
			showIndexSize = Math.min( indices.length, maxIndexSize ),
			indexSize = indices.length,
			totalLeft = indexSize - maxIndexSize,
			leftPerItem = window.parseInt(totalLeft / (window.parseInt(showIndexSize/2))),
			left = totalLeft % (window.parseInt(showIndexSize/2)),
			indexItemSizeArr = [],
			mergedIndices = [],
			i, len, pos=0;

		for ( i=0, len=showIndexSize; i < len; i++ ) {
			indexItemSizeArr[i] = 1;
			if ( i % 2 ) {
				indexItemSizeArr[i] += leftPerItem + ( left-- > 0 ? 1 : 0);
			}
		}

		for ( i=0, len=showIndexSize; i < len; i++) {
			pos += indexItemSizeArr[i];

			mergedIndices.push({
				start: pos - 1,
				length: indexItemSizeArr[i]
			});
		}

		this.indexCellInfomations.indices = indices;
		this.indexCellInfomations.mergedIndices = mergedIndices;
	},

	_updateIndexCellRectInfomation: function() {
		var el = this.element,
			mergedIndices = this.indexCellInfomations.mergedIndices,
			containerOffset = this._getOffset(this._getContainer()).top,
			indexLookupTable = [];

		[].forEach.call(el.querySelectorAll("li"), function(node, idx) {
			var m = mergedIndices[idx],
				i = m.start,
				len = i + m.length,
				top = containerOffset + node.offsetTop,
				height = node.offsetHeight / m.length;

			for ( ; i < len; i++ ) {
				indexLookupTable.push({
					cellIndex: idx,
					top: top,
					range: height
				});

				top += height;
			}

		});

		this.indexCellInfomations.indexLookupTable = indexLookupTable;
		this.indexElements = el.children[0].children;
	},

	/**	Draw additinoal sub-elements
	 *	@param {array} indices	List of index string
	 */
	_draw: function () {
		var el = this.element,
			container = this._getContainer(),
			moreChar = this.options.moreChar,
			indices = this.indexCellInfomations.indices,
			mergedIndices = this.indexCellInfomations.mergedIndices,
			indexSize = mergedIndices.length,
			indexHeight = container.offsetHeight,
			indexItemHeight = window.parseInt(indexHeight / indexSize),
			leftHeight = indexHeight - indexItemHeight*indexSize,
			addHeightOffset = leftHeight,
			indexCellHeight, text, ul, li, frag, i, m;

		frag = document.createDocumentFragment();
		ul = document.createElement("ul");
		frag.appendChild(ul);
		for(i=0; i < indexSize; i++) {
			m = mergedIndices[i];
			text = m.length === 1 ? indices[m.start] : moreChar;
			indexCellHeight = i < addHeightOffset ? indexItemHeight + 1 : indexItemHeight;

			li = document.createElement("li");
			li.innerText = text;
			li.style.height = indexCellHeight + "px";
			li.style.lineHeight = indexCellHeight + "px";
			ul.appendChild(li);
		}
		el.appendChild(frag);

		return this;
	},

	_createIndicator: function() {
		var indicator = document.createElement("DIV"),
			container = this._getContainer();

		indicator.className = this.options.indicatorClass;
		indicator.innerHTML = "<span></span>";
		container.insertBefore(indicator, this.element);

		this.indicator = indicator;
	},

	_removeIndicator: function() {
		this.indicator.parentNode.removeChild(this.indicator);
	},

	_changeIndicator: function( idx/*, cellElement */) {
		var selectedClass = this.options.selectedClass,
			cellInfomations = this.indexCellInfomations,
			cellElement, val;

		if ( !this.indicator || idx === this.index ) {
			return false;
		}

		// TODO currently touch event target is not correct. it's browser bugs.
		// if the bug is fixed, this logic that find cellelem have to be removed.
		cellElement = this.indexElements[cellInfomations.indexLookupTable[idx].cellIndex];
		this._clearSelected();
		cellElement.classList.add(selectedClass);

		val = cellInfomations.indices[idx];
		this.indicator.firstChild.innerHTML = val;

		this.index = idx;

		if ( this.selectEventTriggerTimeoutId ) {
			window.clearTimeout(this.selectEventTriggerTimeoutId);
		}
		this.selectEventTriggerTimeoutId = window.setTimeout(function() {
			this._trigger(this.element, "select", {index: val});
			this.selectEventTriggerTimeoutId = null;
		}.bind(this), this.options.keepSelectEventDelay);

	},

	_clearSelected: function() {
		var el = this.element,
			selectedClass = this.options.selectedClass,
			selectedElement = el.querySelectorAll("."+selectedClass);

		[].forEach.call(selectedElement, function(node/*, idx */) {
			node.classList.remove(selectedClass);
		});
	},

	_showIndicator: function() {
		if ( this.isShowIndicator || !this.indicator ) {
			return false;
		}

		this.indicator.style.display = "block";
		this.isShowIndicator = true;
	},

	_hideIndicator: function() {
		if ( !this.isShowIndicator || !this.indicator ) {
			return false;
		}

		this._clearSelected();
		this.indicator.style.display = "none";
		this.isShowIndicator = false;
		this.index = null;
	},

	_onTouchStartHandler: function( ev ) {
		var pos = this._getPositionFromEvent( ev ),
			idx = this._findIndexByPosition( pos.y );

		if ( idx < 0 ) {
			idx = 0;
		}

		this._changeIndicator(idx, ev.target);
		this._showIndicator();
	},

	_onTouchEndHandler: function(/* ev */) {
		this._hideIndicator();
	},

	_onTouchMoveHandler: function( ev ) {
		var pos, idx;

		if ( !this.isShowIndicator ) {
			return;
		}

		pos = this._getPositionFromEvent( ev );
		idx = this._findIndexByPosition( pos.y );

		if ( idx > -1 && pos.x > this.touchAreaOffsetLeft ) {
			this._changeIndicator(idx, ev.target);
		}

		ev.preventDefault();
		ev.stopPropagation();
	},

	_bindEvent: function() {
		this._bindResizeEvent();
		this._bindEventToTriggerSelectEvent();
	},

	_unbindEvent: function() {
		this._unbindResizeEvent();
		this._unbindEventToTriggerSelectEvent();
	},

	_bindResizeEvent: function() {
		this.eventHandlers.onresize = function(/* ev */) {
			this.refresh();
		}.bind(this);

		window.addEventListener( "resize", this.eventHandlers.onresize );
	},

	_unbindResizeEvent: function() {
		if ( this.eventHandlers.onresize ) {
			window.removeEventListener( "resize", this.eventHandlers.onresize );
		}
	},

	_bindEventToTriggerSelectEvent: function() {
		this.eventHandlers.touchStart = this._onTouchStartHandler.bind(this);
		this.eventHandlers.touchEnd = this._onTouchEndHandler.bind(this);
		this.eventHandlers.touchMove = this._onTouchMoveHandler.bind(this);

		this.element.addEventListener("touchstart", this.eventHandlers.touchStart);
		this.element.addEventListener("touchmove", this.eventHandlers.touchMove);
		document.addEventListener("touchend", this.eventHandlers.touchEnd);
		document.addEventListener("touchcancel", this.eventHandlers.touchEnd);
	},

	_unbindEventToTriggerSelectEvent: function() {
		this.element.removeEventListener("touchstart", this.eventHandlers.touchStart);
		this.element.removeEventListener("touchmove", this.eventHandlers.touchMove);
		document.removeEventListener("touchend", this.eventHandlers.touchEnd);
		document.removeEventListener("touchcancel", this.eventHandlers.touchEnd);
	},

	/**
	 * Trgger a custom event to the give element
	 * @param {obj}		elem	element
	 * @param {string}	eventName	event name
	 * @param {obj}		detail	detail data of the custom event
	 */
	_trigger: function(elem, eventName, detail) {
		var ev;
		if(!elem || !elem.nodeType || elem.nodeType !== 1) {	// DOM element check
			throw "Given element is not a valid DOM element";
		}
		if("string" !== typeof eventName || eventName.length <= 0) {
			throw "Given eventName is not a valid string";
		}
		ev = new CustomEvent(
			eventName,
			{
				detail: detail,
				bubbles: true,
				cancelable: true
			}
		);
		elem.dispatchEvent(ev);

		return true;
	},

	_data: function (key, val) {
		var el = this.element,
			d = el._gearui_data,
			idx;
		if(!d) {
			d = el._gearui_data = {};
		}
		if(typeof key === "object") {
			// Support data collection
			for(idx in key) {
				this._data(idx, key[idx]);
			}
			return this;
		} else {
			if("undefined" === typeof val) {	// Getter
				return d[key];
			} else {	// Setter
				d[key] = val;
				return this;
			}
		}
	},

	_isValidElement: function (el) {
		return el.classList.contains(this.widgetClass);
	},

	_isExtended: function () {
		return !!this._data("extended");
	},

	_extended: function (flag) {
		this._data("extended", flag);
		return this;
	},

	_getIndex: function () {
		var el = this.element,
			options = this.options,
			indices = el.getAttribute("data-index");
		if(indices) {
			indices = indices.split(options.delimeter);	// Delimeter
		} else {
			indices = options.indices;
		}
		return indices;
	},

	_findIndexByPosition: function( posY ) {
		var rectTable = this.indexCellInfomations.indexLookupTable,
			i, len, info, range;

		for ( i=0, len=rectTable.length; i < len; i++) {
			info = rectTable[i];
			range = posY - info.top;
			if ( range > 0 && range < info.range ) {
				return i;
			}
		}

		return -1;
	},

	_getOffset: function( el ) {
		var left=0, top=0 ;
		do {
			top += el.offsetTop;
			left += el.offsetLeft;
		} while (el = el.offsetParent);

		return {
			top: top,
			left: left
		};
	},

	_getContainer: function() {
		return this.options.container || this.element.parentNode;
	},

	_getPositionFromEvent: function( ev ) {
		return ev.type.search(/^touch/) !== -1 ?
				{x: ev.touches[0].clientX, y: ev.touches[0].clientY} :
				{x: ev.clientX, y: ev.clientY};
	},

	_clear: function () {
		this.indexCellInfomations.clear();
		this.indexElements = null;

		var el = this.element;
		while(el.firstChild) {
			el.removeChild(el.firstChild);
		}
	},

	addEventListener: function (type, listener) {
		this.element.addEventListener(type, listener);
	},

	removeEventListener: function (type, listener) {
		this.element.removeEventListener(type, listener);
	},

	refresh: function () {
		if( this._isExtended() ) {
			this._unbindEvent();
			this._hideIndicator();
			this._clear();
			this._extended( false );
		}

		this._updateLayout();
		this._extended( true );
	},

	destroy: function() {
		this._unbindEvent();
		this._removeIndicator();
		this._clear();
		this._extended( false );

		this.element = null;
		this.indicator = null;
		this.index = null;
		this.isShowIndicator = false;
		this.indexCellInfomations = null;
		this.eventHandlers = null;
	}
};
// Export indexscrollbar to the namespace
ns.IndexScrollbar = IndexScrollbar;

} ( window, jQuery, $.micro ) );
