//>>excludeStart("microBuildExclude", pragmas.microBuildExclude);
define([
	"jquery",
	"./core",
	"./utils/path",
	"./var/selectors"], function( jQuery ) {
//>>excludeEnd("microBuildExclude");

(function( $, window, undefined ) {

	$.extend($.micro, {

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
		}

	});

})( jQuery, this );

//>>excludeStart("microBuildExclude", pragmas.microBuildExclude);
});
//>>excludeEnd("microBuildExclude");
