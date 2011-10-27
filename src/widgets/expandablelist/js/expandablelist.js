/*
 * expandable
 * By Youmin Ha <youmin.ha@samsung.com>
 */

(function ($, undefined) {

$.widget("todons.expandablelist", $.mobile.widget, {
	options: {
		initSelector: ":jqmData(expandable='true')",
	},

	_create: function () {
		var e = this.element,
			self = this,
			expanded = e.nextAll(":jqmData(expanded='true')")
				.filter("[data-for='" + e[0].id + "']");

		expanded.hide();	// Initially hidden

		// For every expandable, bind event
		e.bind('vclick', function() {
			var 
			_toggle = function(e) {
				e.toggle('fast', 'swing');
			},

			toggleChildren = function(expanded) {
				if(expanded[0]) {
					// If current status is visible, this toggle is hiding.
					if($(expanded[0]).is(":visible")) {
						var toBeToggled = null;
						$.each(expanded, function(idx, e) {
							var elem = $(e);
							if ('' == elem[0].id) return true; 	// continue
							var children = elem.nextAll(":jqmData(expanded='true')")
								.filter("[data-for='" + elem[0].id + "']")
								.filter(":visible");
							_toggle(children);
							toggleChildren(children);
						});
					}
				}
			}
			_toggle(expanded);
			toggleChildren(expanded);
		});
	},

	stepToggle: function (expanded, self) {

	},
});	// end: $.widget()
 

$(document).bind("pagecreate create", function (e) {
	$($.todons.expandablelist.prototype.options.initSelector, e.target)
    .not(":jqmData(role='none'), :jqmData(role='nojs')")
	.expandablelist();
});

})(jQuery);
