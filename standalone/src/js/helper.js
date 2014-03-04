//>>excludeStart("microBuildExclude", pragmas.microBuildExclude);
define([
	"jquery",
	"./ns",
	"./core",
	"./utils/path",
	"./var/selectors"], function( jQuery, ns ) {
//>>excludeEnd("microBuildExclude");

(function( $, ns, window, undefined ) {

	$.extend(ns, {

		$window: $(window),
		$document: $(window.document),

		getData: function( element ) {
			var dataPrefix = "data-",
				data = {},
				ele = element.jquery ? element[0] : element,
				attrs = ele.attributes,
				attr, nodeName, i, length;

			for (i=0, length=attrs.length; i < length; i++){
				attr = attrs.item(i);
				nodeName = attr.nodeName;
				if(nodeName.indexOf(dataPrefix) > -1) {
					data[ nodeName.replace( dataPrefix, "" ) ] = attr.nodeValue;
				}
			}

			return data;
		},

		fireEvent: function(element, eventName, detail) {
			var ele = element.jquery ? element[0] : element,
				evt = new CustomEvent(eventName, {
					"bubbles": true,
					"cancelable": true,
					"detail": detail
				});

			//>>excludeStart("microBuildExclude", pragmas.microBuildExclude);
			console.debug(eventName, detail);
			//>>excludeEnd("microBuildExclude");
			ele.dispatchEvent(evt);
		},

		extendObject: function(orig, ext) {
			var key, val;
			if(!orig) {
				orig = {};
			}
			for(key in ext) {
				val = ext[key];
				if(!orig[key]) {
					orig[key] = val;
				}
			}
			return orig;
		},

		dom: {
			getOffset: function( el ) {
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

			triggerCustomEvent: function(element, name, detail) {
				var ev;
				if(!element || !element.nodeType || element.nodeType !== 1) {	// DOM element check
					throw "Given element is not a valid DOM element";
				}
				if("string" !== typeof name || name.length <= 0) {
					throw "Given event name is not a valid string";
				}
				ev = new CustomEvent(
					name,
					{
						detail: detail,
						bubbles: true,
						cancelable: true
					}
				);
				element.dispatchEvent(ev);
				return true;
			},

			data: function(element, key, val) {
				var el = element,
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
			}
		}
	});

	

})( jQuery, ns, this );

//>>excludeStart("microBuildExclude", pragmas.microBuildExclude);
});
//>>excludeEnd("microBuildExclude");
