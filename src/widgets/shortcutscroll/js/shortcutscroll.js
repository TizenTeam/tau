/*!
 * jQuery Mobile Widget @VERSION
 *
 * Copyright (C) TODO
 * License: TODO
 * Authors: Elliot Smith <elliot.smith@intel.com>
 * Authors: Koeun Choi  <koeun.choi@samsung.com>
 */

/**
 * shortcutscroll is a scrollview controller, which binds
 * a scrollview to a a list of short cuts; the shortcuts are built
 * from the text on dividers in the list. Clicking on a shortcut
 * instantaneously jumps the scrollview to the selected list divider;
 * mouse movements on the shortcut column move the scrollview to the
 * list divider matching the text currently under the touch; a popup
 * with the text currently under the touch is also displayed.
 *
 * To apply, add the attribute data-shortcutscroll="true" to a listview
 * (a <ul> or <ol> element inside a page). Alternatively, call
 * shortcutscroll() on an element.
 *
 * The closest element with class ui-scrollview-clip is used as the
 * scrollview to be controlled.
 *
 * If a listview has no dividers or a single divider, the widget won't
 * display.
 */
(function($, undefined) {
	$.widget( "todons.shortcutscroll", $.mobile.widget, {
		options: {
			initSelector: ":jqmData(shortcutscroll)"
		},

		second_popup: 0,

		_show_second_popup: function (to_x, to_y) {
			this.shortcutsContainer2.css('top', to_y);
			this.shortcutsContainer2.animate({right: to_x}, 300);
			this.second_popup = 1;
		},

		_hide_second_popup: function (to_x) {
			this.shortcutsContainer2.animate({right: to_x}, 300);
			this.second_popup = 0;
		},

		_create: function () {
			var $el = this.element,
			self = this,
			$popup,
			timer,
			dragging = 0,
			shortcut_width = 0,
			page = $el.closest(':jqmData(role="page")');

			$.extend(this, {
				dividertext: ""
			});

			this.scrollview = $el.closest('.ui-scrollview-clip');
			this.shortcutsContainer = $('<div class="ui-shortcutscroll"/>');
			this.shortcutsList = $('<ul></ul>');

			// popup for the hovering character
			this.shortcutsContainer.append($('<div class="ui-shortcutscroll-popup"></div>'));
			$popup = this.shortcutsContainer.find('.ui-shortcutscroll-popup');

			this.shortcutsContainer.append(this.shortcutsList);
			this.scrollview.append(this.shortcutsContainer);

			// second popup
			this.shortcutsList2 = $('<ul></ul>');
			this.shortcutsContainer2= $('<div class="ui-shortcutscroll"/>');
			this.shortcutsContainer2.append(this.shortcutsList2);
			shortcut_width = this.shortcutsContainer.width() + 10;
			this.shortcutsContainer2.css('right', -shortcut_width);
			this.scrollview.append(this.shortcutsContainer2);

			// adjust z-index
			this.shortcutsContainer.css('z-index', 100);
			this.shortcutsContainer2.css('z-index', 90);

			// find the bottom of the last item in the listview
			this.lastListItem = $el.children().last();

			// remove scrollbars from scrollview
			this.scrollview.find('.ui-scrollbar').hide();

			var jumpToItem = function(list_item) {
				// get the vertical position of the list item (so we can
				// scroll to it)
				var dividerY = $(list_item).position().top;

				// find the bottom of the last list item
				var bottomOffset = self.lastListItem.outerHeight(true) +
							self.lastListItem.position().top;

				var scrollviewHeight = self.scrollview.height();

				// check that after the candidate scroll, the bottom of the
				// last item will still be at the bottom of the scroll view
				// and not some way up the page
				var maxScroll = bottomOffset - scrollviewHeight;
				dividerY = (dividerY > maxScroll ? maxScroll : dividerY);

				// don't apply a negative scroll, as this means the
				// list item should already be visible
				dividerY = Math.max(dividerY, 0);

				// apply the scroll
				clearTimeout(timer);
				timer = setTimeout(function() {
					self.scrollview.scrollview('scrollTo', 0, -dividerY, 1000);
				}, 300);

				var popup_text = $(list_item).text();

				if (popup_text.length > 1)
					popup_text = popup_text.substr(0, 2).toUpperCase();

				$popup.text(popup_text).position({
					my: 'center center',
					at: 'center center',
					of: self.scrollview
				}).show();

				self.dividertext = $(list_item).text();
			};

			var set_second_list = function(divider) {
				var div_char = $(divider).text();

				var listItems =
					self.element.find('li:contains("' + div_char + '"):not(:jqmData(role="list-divider"))');

				self.shortcutsList2.find('li').remove();

				var list_text;
				var list_char;

				listItems.each(function(index, second_list) {
					list_text = $(second_list).text();

					if (list_text.charAt(1) !== list_char) {
						list_char = list_text.charAt(1);
						self.shortcutsList2.append($('<li>' +
								list_char.toUpperCase() + '</li>')
								.data('second_list', second_list));
					}
				});
			};

			// bind mouse over so it moves the scroller to the divider
			this.shortcutsList.bind('touchstart mousedown vmousedown touchmove vmousemove', function (e) {
				e.preventDefault();
				e.stopPropagation();

				if (e.type === 'touchstart' || e.type === 'mousedown' || e.type === 'vmousedown') {
					console.log("shourtcutslist down");
					dragging = 1;
				}

				if (!dragging)
					return;

				// Get coords relative to the element
				var coords = $.mobile.todons.targetRelativeCoordsFromEvent(e);
				var shortcutsListOffset = self.shortcutsList.offset();

				// If the element is a list item, get coordinates relative to the shortcuts list
				if (e.target.tagName.toLowerCase() === "li") {
					coords.x += $(e.target).offset().left -
							shortcutsListOffset.left;
					coords.y += $(e.target).offset().top -
							shortcutsListOffset.top;
				}

				// Hit test each list item
				self.shortcutsList.find('li').each(function() {
					var listItem = $(this),
					l = listItem.offset().left - shortcutsListOffset.left,
					t = listItem.offset().top - shortcutsListOffset.top,
					r = l + Math.abs(listItem.outerWidth(true)),
					b = t + Math.abs(listItem.outerHeight(true));

					if (coords.x >= l && coords.x <= r &&
						coords.y >= t && coords.y <= b) {
						if (self.second_popup)
							self._hide_second_popup(-shortcut_width);
						jumpToItem($(listItem.data('divider')));
						set_second_list($(listItem.data('divider')));

						return false;
					}
					return true;
				});
			});

			this.shortcutsList2.bind('vmousemove', function (e) {
				e.preventDefault();
				e.stopPropagation();

				if (!dragging)
					return;

				if (!self.second_popup)
					return;

				// Get coords relative to the element
				var coords = $.mobile.todons.targetRelativeCoordsFromEvent(e);
				var shortcutsListOffset = self.shortcutsList2.offset();

				// If the element is a list item, get coordinates relative to the shortcuts list
				if (e.target.tagName.toLowerCase() === "li") {
					coords.x += $(e.target).offset().left -
							shortcutsListOffset.left;
					coords.y += $(e.target).offset().top -
							shortcutsListOffset.top;
				}

				// Hit test each list item
				self.shortcutsList2.find('li').each(function() {
					var listItem = $(this),
					l = listItem.offset().left - shortcutsListOffset.left,
					t = listItem.offset().top - shortcutsListOffset.top,
					r = l + Math.abs(listItem.outerWidth(true)),
					b = t + Math.abs(listItem.outerHeight(true));

					if (coords.x >= l && coords.x <= r &&
						coords.y >= t && coords.y <= b) {
						jumpToItem($(listItem.data('second_list')));
						return false;
					}
					return true;
				});
			});

			//hide when touch up..
			$(document).bind('touchend mouseup vmouseup', function (e) {
				dragging = 0;
				$popup.hide();

				if (self.second_popup)
					self._hide_second_popup(-shortcut_width);
			});

			this.shortcutsList.bind('vmouseout', function (e) {
				if (!dragging)
					return;

				var c = targetRelativeCoordsFromEvent(e);

				if (c.x > 0)
					return;

				var shortcutsListOffset = self.shortcutsList.offset();

				if (e.target.tagName.toLowerCase() === "li")
					c.y += $(e.target).offset().top - shortcutsListOffset.top;

				self._show_second_popup(shortcut_width, c.y);
			});

			this.shortcutsList2.bind('vmouseout', function (e) {
				if (!dragging)
					return;

				if (!self.second_popup)
					return;

				var c = targetRelativeCoordsFromEvent(e);

				if (c.x < self.shortcutsList2.width())
					return;

				self._hide_second_popup(-shortcut_width);
			});


			if (page && !(page.is(':visible'))) {
				page.bind('pageshow', function () {
					self.refresh();
				});
			} else {
				this.refresh();
			}

			// refresh the list when the dividers change
			$el.bind('listChanged', function () {
				self.refresh();
			});

			// refresh the list when dividers are filtered out
			$el.bind('listFiltered', function () {
				self.refresh(true);
			});
		},

		refresh: function (visibleOnly) {
			var self = this,
			shortcutsTop;

			this.shortcutsList.find('li').remove();

			// get all the dividers from the list and turn them into
			// shortcuts
			var dividers = this.element.find(':jqmData(role="list-divider")');

			// get all the list items
			var listItems = this.element.find('li:not(:jqmData(role="list-divider"))');

			if (visibleOnly) {
				dividers = dividers.filter(':visible');
				listItems = listItems.filter(':visible');
			}

			if (dividers.length < 2) {
				this.shortcutsList.hide();
				return;
			}

			this.shortcutsList.show();

			this.lastListItem = listItems.last();

			dividers.each(function (index, divider) {
				self.shortcutsList.append($('<li>' + $(divider).text() + '</li>')
								.data('divider', divider));
			});

			// position the shortcut flush with the top of the first
			// list divider
			shortcutsTop = dividers.first().position().top;
			this.shortcutsContainer.css('top', shortcutsTop);
		}
	});

	$(document).bind( "pagecreate create", function (e) {
		$($.todons.shortcutscroll.prototype.options.initSelector, e.target)
			.not(":jqmData(role='none'), :jqmData(role='nojs')")
			.shortcutscroll();
	});

})(jQuery);
