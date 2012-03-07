/**
 * Displays vertical multi-level list.
 *
 * To apply, add the attribute data-expandable="true" and id="parentid" to a <li> element for parent list item
 * and add the arrribute data-expanded-by="parentid" to a <li> element for child list item.
 *
 * HTML Attributes:
 *		data-expandable: Parent list item must have 'true' value for this attribute
 *		data-expanded-by: Child list item expanded by parent list item must have 'true' value for this attribute
 *		data-initial-expansion: If you want expandable list to be expanded initially, set this value as 'true'
 *
 * Example:
 *     <li data-expandable="true" id="exp1" data-initial-expansion="true">Parent</li>
 *     <li data-expanded-by="exp1">Child</li>
 */

(function ($, undefined) {

$.widget("todons.expandablelist", $.mobile.widget, {
	options: {
		initSelector: ":jqmData(expandable='true')"
	},

	_hide: function(e) {
		$(e).removeClass('ui-li-expand-transition-show')
			.addClass('ui-li-expand-transition-hide');
	},
	_show: function(e) {
		$(e).removeClass('ui-li-expand-transition-hide')
			.addClass('ui-li-expand-transition-show');
	},
	_hide_expand_img: function(e) {
		$(e).removeClass('ui-li-expandable-hidden')
			.addClass('ui-li-expandable-shown');

		$(e).find( ".ui-li-expand-icon" )
			.addClass( "ui-li-expanded-icon" )
			.removeClass( "ui-li-expand-icon" );
	},
	_show_expand_img: function(e) {
		$(e).removeClass('ui-li-expandable-shown')
			.addClass('ui-li-expandable-hidden');

		$(e).find( ".ui-li-expanded-icon" )
			.addClass( "ui-li-expand-icon" )
			.removeClass( "ui-li-expanded-icon" );
	},

	_set_expand_arrow: function(self, e, parent_is_expanded) {
			if (parent_is_expanded) {
				self._hide_expand_img(e);
			} else {
				self._show_expand_img(e);
			}
			if($(e[0]).data("expandable") && parent_is_expanded == false) {
				var children = $(e).nextAll(":jqmData(expanded-by='"+$(e).attr('id')+"')");
				children.each(function(idx, child) {
					self._set_expand_arrow(self, child, e.is_expanded);
				});
			}
	},

	_toggle: function(self, e, parent_is_expanded) {
		if (! parent_is_expanded) {
			self._show(e);
		}
		else {
			self._hide(e);
			if($(e).data("expandable") && e.is_expanded == true) {
				var children = $(e).nextAll(":jqmData(expanded-by='"+$(e).attr('id')+"')");
				children.each(function(idx, child) {
					self._toggle(self, child, e.is_expanded);
				});
				e.is_expanded = false;
			}
		}
	},
	_is_hidden: function(e) {
		return ( $(e).height() == 0);
	},

	_create: function () {

		var children = $(this.element).nextAll(":jqmData(expanded-by='"+$(this.element).attr('id')+"')");
		if (children.length == 0) {
			return;
		}

		var e = this.element,
			self = this,
			expanded = e.nextAll(":jqmData(expanded-by='" + e[0].id + "')"),
			initial_expansion = e.data("initial-expansion");
			is_expanded = false;

		if(initial_expansion == true ) {
			var parent_id = e.data("expanded-by");
			if(parent_id) {
				if($("#"+parent_id).is_expanded == true)  is_expanded = true;
			} else {
				is_expanded = true;
			}
		}

		e[0].is_expanded = is_expanded;
		if (e[0].is_expanded) {
			self._hide_expand_img(e);
			$(e).append("<div class='ui-li-expanded-icon'></div>");
		} else {
			self._show_expand_img(e);
			$(e).append("<div class='ui-li-expand-icon'></div>");
		}

		if(e[0].is_expanded) expanded.each(function(i, e) { self._show(e); });
		else expanded.each(function(i, e) { self._hide(e); });

		expanded.addClass("ui-li-expanded");

		e.bind('vclick', function() {
			var _is_expanded = e[0].is_expanded;
			expanded.each(function(i, e) { self._toggle(self, e, _is_expanded); });
			e[0].is_expanded = ! e[0].is_expanded;

			self._set_expand_arrow(self, e, e[0].is_expanded);
		});
	}


});	// end: $.widget()


$(document).bind("pagecreate create", function (e) {
	$($.todons.expandablelist.prototype.options.initSelector, e.target)
    .not(":jqmData(role='none'), :jqmData(role='nojs')")
	.expandablelist();
});

})(jQuery);
