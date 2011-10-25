/*
 * expandable
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

		//expanded = e.children(":jqmData(expanded='true')");
		
		expanded.hide();	// Initially hidden

		e.bind('vclick', function() {
			expanded.toggle('fast', 'swing');
			
		});
	}
});	// end: $.widget()
 

$(document).bind("pagecreate create", function (e) {
	$($.todons.expandablelist.prototype.options.initSelector, e.target)
    .not(":jqmData(role='none'), :jqmData(role='nojs')")
	.expandablelist();
});

})(jQuery);
