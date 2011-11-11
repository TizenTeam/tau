/*
 * pagecontrol
 * by Youmin Ha <youmin.ha@samsung.com>
 *
 * This widget shows number bullets, receives touch event for each bullet,
 * and runs your callback for each touch event.
 *
 * RESTRICTIONS
 * This widget can only handle maximum bullets from 1 to 10, according to
 * winset UI design.
 *
 * USAGE
 */

(function ($, undefined) {

$.widget("todons.pagecontrol", $.mobile.widget, {
	options: {
		initSelector: ":jqmData(role='pagecontrol')",
	},

	_create: function () {
	},

	_init: function() {
		var self = this,
			e = this.element,
			maxVal = e.data("max"),
			currentVal = e.attr("data-initVal"),
			i = 0,
			btn = null,
			buf = null,
			page_margin_class = 'page_n_margin_44';


		// Set default values
		if(!maxVal) {
			maxVal = 1;
		} else if(maxVal > 10) {
			maxVal = 10;
		}
		e.data("max", maxVal);

		if(!currentVal) {
			currentVal = 1;
		}
		e.data("current", currentVal);

		// Set pagecontrol class
		e.addClass('pagecontrol');

		// Set empty callback variable
		self.changeCallback = null;

		// Calculate left/right margin
		if(maxVal <= 7) {
			page_margin_class = 'page_n_margin_44';
		} else if(maxVal == 8) {
			page_margin_class = 'page_n_margin_35';
		} else if(maxVal == 9) {
			page_margin_class = 'page_n_margin_26';
		} else {
			page_margin_class = 'page_n_margin_19';
		}

		// Add dot icons
		for(i=1; i<=maxVal; i++) {
			btn = $('<div class="page_n page_n_dot ' + page_margin_class + '" data-value="' + i + '"></div>');
			e.append(btn);
			if(i == currentVal) {
				btn.removeClass('page_n_dot').
					addClass('page_n_'+i);
			}
			// bind vclick event to each icon
			btn.bind('vclick', function(event) {
				var newBtn = $(this),
					oldCurrentBtn = e.children(":jqmData(value='" + e.data('current') + "')");
				oldCurrentBtn.removeClass('page_n_' + e.data('current'))
					.addClass('page_n_dot');

				// Change clicked button to number
				if(newBtn.hasClass('page_n_dot')) {
					newBtn.removeClass('page_n_dot')
						.addClass('page_n_' + newBtn.data('value'));
				}
				e.data('current', newBtn.data('value'))

				// Call change callback
				if(self.changeCallback) {
					console.log('changeCallback exists!');
					self.changeCallback(newBtn.data('value'));
				}
			});
		}
	},
	
	setChangeCallback: function( callback ) {
		alert('setChangeCallback');
		this.changeCallback = callback;
	},
});	// end: $.widget()


$(document).bind("pagecreate create", function(e) {
		$($.todons.pagecontrol.prototype.options.initSelector, e.target)
		.not(":jqmData(role='none'), :jqmData(role='nojs')")
		.pagecontrol();
});

}) (jQuery);
