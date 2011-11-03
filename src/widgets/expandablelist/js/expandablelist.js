/*
 * expandable
 * By Youmin Ha <youmin.ha@samsung.com>
 */

(function ($, undefined) {

$.widget("todons.expandablelist", $.mobile.widget, {
	options: {
		initSelector: ":jqmData(expandable='true')",
	},

	_hide: function(e) {
		$(e).removeClass('ui-li-expand-transition-show')
			.addClass('ui-li-expand-transition-hide');
		},
	_show: function(e) {
		$(e).removeClass('ui-li-expand-transition-hide')
			.addClass('ui-li-expand-transition-show');
		},
	_toggle: function(self, e) {
		if (self._is_hidden(e)) self._show(e);
		else self._hide(e);
		},
	_is_hidden: function(e) {
		return ( $(e).height() == 0);
		},

	_toggle_children: function(self, is_hidden, expanded) {
		if(is_hidden) return;
		$.each(expanded, function(idx, e) {
			var elem = $(e);
			if ('' == elem[0].id) return true;	// continue
			var children = elem.nextAll(":jqmData(expanded-by='"+elem[0].id +"')").filter(":visible");	// Only 
			children.each(function(i, e) { 
				self._toggle(self, e);
				});
			self._toggle_children(self, is_hidden, children);
			});
		},


	_create: function () {
		var e = this.element,
			self = this,
			expanded = e.nextAll(":jqmData(expanded-by='" + e[0].id + "')"),
			initial_expansion = e.data("initial-expansion");

		// Set initial status
		if(initial_expansion == true) {
			expanded.each(function(i, e) { 
				self._show(e); 
				});
		} else {
			expanded.each(function(i, e) { 
				self._hide(e); 
				});
		}

		expanded.addClass("ui-li-expanded");

		e.find( ":jqmData(expandable='true')" )
			 .wrapInner( '<img src="thumbnail.jpg" class="ui-li-expanded-icon">' );

		// For every expandable, bind event
		e.bind('vclick', function() {
			var is_hidden = self._is_hidden(expanded[0]);

			expanded.each(function(i, e) { 
				self._toggle(self, e); 
				});
			if(! is_hidden) self._toggle_children(self, is_hidden, expanded);
		});
	},


});	// end: $.widget()


$(document).bind("pagecreate create", function (e) {
	$($.todons.expandablelist.prototype.options.initSelector, e.target)
    .not(":jqmData(role='none'), :jqmData(role='nojs')")
	.expandablelist();
});

})(jQuery);
