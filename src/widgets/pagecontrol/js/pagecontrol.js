/*
 * pagecontrol
 * by Youmin Ha <youmin.ha@samsung.com>
 */

(function ($, undefined) {

$.widget("todons.pagecontrol", $.mobile.widget, {
	options: {
	},

	_create: function () {
		var e = this.element;
		
		e.attr("a", "1");
		alert("create! " + e.attr("a"));
	},

	_init: function() {
		e.attr("a", "2");
		alert("init! " + e.attr("a"));
	}


});	// end: $.widget()

}) (jQuery);
