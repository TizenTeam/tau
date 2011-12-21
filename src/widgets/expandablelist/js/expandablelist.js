/*
	Copyright (c) 2011 Samsung Electronics Co., Ltd All Rights Reserved

	Licensed under the Apache License, Version 2.0 (the "License");
	you may not use this file except in compliance with the License.
	You may obtain a copy of the License at

	http://www.apache.org/licenses/LICENSE-2.0

	Unless required by applicable law or agreed to in writing, software
	distributed under the License is distributed on an "AS IS" BASIS,
	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	See the License for the specific language governing permissions and
	limitations under the License.
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

	_toggle: function(self, e, parent_is_expanded) {
		if (! parent_is_expanded) {
			self._show(e);
		}
		else {
			self._hide(e);
			// If current node is also an expandable node, hide its children!
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
		var e = this.element,
			self = this,
			expanded = e.nextAll(":jqmData(expanded-by='" + e[0].id + "')"),
			initial_expansion = e.data("initial-expansion");
			is_expanded = false;

		// Save status in expandable object
		if(initial_expansion == true ) {
			var parent_id = e.data("expanded-by");
			if(parent_id) {
				if($("#"+parent_id).is_expanded == true)  is_expanded = true; // check parent's is_expanded var
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


		// Show/hide expanded objects
		if(e[0].is_expanded) expanded.each(function(i, e) { self._show(e); });
		else expanded.each(function(i, e) { self._hide(e); });

		expanded.addClass("ui-li-expanded");

		// For every expandable, bind event
		e.bind('vclick', function() {
			var _is_expanded = e[0].is_expanded;
			expanded.each(function(i, e) { self._toggle(self, e, _is_expanded); });
			e[0].is_expanded = ! e[0].is_expanded;	// toggle true/false
			if (e[0].is_expanded) {
				self._hide_expand_img(e);
			} else {
				self._show_expand_img(e);
			}

		});
	},


});	// end: $.widget()


$(document).bind("pagecreate create", function (e) {
	$($.todons.expandablelist.prototype.options.initSelector, e.target)
    .not(":jqmData(role='none'), :jqmData(role='nojs')")
	.expandablelist();
});

})(jQuery);
