( function ( window, $, ns, undefined ) {

/*
 * IndexScrollbar
 *
 * Shows an index scrollbar, and triggers 'select' event.
 */
function IndexScrollbar (element) {
	// Support calling without 'new' keyword
	if(ns === this) {
		return new IndexScrollbar(element);
	}

	if(!this._isValidElement(element)) {
		throw "Invalid element is given";
	}

	this.element = element;
	this.index = null;

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
		delimeter: ",",
		index: [ "A", "B", "C", "D", "E", "F", "G", "H",
		         "I", "J", "K", "L", "M", "N", "O", "P", "Q",
		         "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "1"]
	},

	_create: function () {
		// Read index, and add supplement elements
		this._draw(this._getIndex());

		// Bind an click event handler:
		this._bindClickToTriggerSelectEvent();

		//   Set selected class to the listitem
		//   Trigger a custom event: indexscrollbar.select

		// Mark as extended
		this._extended(true);
	},

	_init: function () {

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

	/**	Draw additinoal sub-elements
	 *	@param {array} indices	List of index string
	 */
	_draw: function (indices) {
		var el = this.element,
			ul, li, frag,
			i;

		frag = document.createDocumentFragment();
		ul = document.createElement("ul");
		frag.appendChild(ul);
		for(i=0; i<indices.length; i++) {
			li = document.createElement("li");
			li.innerText = indices[i];
			ul.appendChild(li);
		}
		el.appendChild(frag);

		return this;
	},

	_clear: function () {
		var el = this.element;
		while(el.firstChild) {
			el.removeChild(el.firstChild);
		}
	},

	_bindClickToTriggerSelectEvent: function() {
		var self = this,
			el = this.element,
			callback = function(ev) {
				var target = ev.target,
					idx = "";
				if("li" === target.tagName.toLowerCase()) {
					idx = target.innerText;
					self._trigger(el, "select", {index: idx});
				}
			};
		el.addEventListener("click", callback);
		this._data("clickCallback", callback);
		return this;
	},

	_unbindClick: function() {
		var el = this.element,
			callback = this._data("clickCallback");
		el.removeEventListener("click", callback);
		return this;
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

	addEventListener: function (type, listener) {
		this.element.addEventListener(type, listener);
	},

	removeEventListener: function (type, listener) {
		this.element.removeEventListener(type, listener);
	},

	refresh: function () {
		if( this._isExtended() ) {
			this._unbindClick();
			this._clear();
			this._extended( false );
		}

		this._draw(this._getIndex());
		this._bindClickToTriggerSelectEvent();
		this._extended( true );
	},
};
// Export indexscrollbar to the namespace
ns.IndexScrollbar = IndexScrollbar;

} ( window, jQuery, $.micro ) );
