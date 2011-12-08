/* TBD */
/*!
 * jQuery Mobile Widget @VERSION
 *
 * Copyright (C) TODO
 * License: TODO
 * Authors: Salvatore Iovene <salvatore.iovene@intel.com>
 */

/**
 * datetimepicker is a widget that lets the user select a date and/or a
 * time.
 *
 * To apply, add the attribute data-datetimepicker="true", or set the
 * type="date" to an <input> field in a <form>.
 *
 * Options (default in parentheses):
 * =================================
 *  - showDate (true): shows (and allows modification of) the date.
 *  - showTime (true): shows (and allows modification of) the time.
 *  - header ("Set time"): the header text of the widget.
 *  - timeSeparator (":"): the symbol that separates hours and minutes.
 *  - months (["Jan".."Dec"]): an array of month names (provide your
 *    own if your interface's language is not English.
 *  - am ("AM"): the label for the AM text.
 *  - pm ("PM"): the lael for the PM text.
 *  - twentyfourHours (false): if true, uses the 24h system; if false
 *    uses the 12h system.
 *  - anumationDuration (500): the time the item selector takes to
 *    be animated, in milliseconds.
 *  - initSelector (see code): the jQuery selector for the widget.
 *
 * How to get a return value:
 * ==========================
 * Bind to the 'date-changed' event, e.g.:
 *    $("#myDatetimepicker").bind("date-changed", function(e, date) {
 *        alert("New date: " + date.toString());
 *    });
 */
(function($, window, undefined) {
    $.widget("todons.datetimepicker", $.mobile.widget, {
        options: {
            showDate: true,
            showTime: true,
            header: "Set time",
            timeSeparator: ":",
            months: ["Jan", "Feb", "Mar", "Apr", "May",
                     "Jun", "Jul", "Aug", "Sep", "Oct",
                     "Nov", "Dec"],
            am: "AM",
            pm: "PM",
            twentyfourHours: false,
            animationDuration: 0,
            initSelector: "input[type='date'], input[type='datetime'], input[type='time'], :jqmData(type='date'), :jqmData(role='datetimepicker')"
        },

        _initDateTime: function() {
            this.data.initial.year = this.data.now.getFullYear();
            this.data.initial.month = this.data.now.getMonth();
            this.data.initial.day = this.data.now.getDate();
            this.data.initial.hours = this.data.now.getHours();
            this.data.initial.minutes = this.data.now.getMinutes();
            this.data.initial.pm = this.data.initial.hours > 11;

            if (this.data.initial.hours == 0 && this.options.twentyfourHours == false) {
                this.data.initial.hours = 12;
            }

            this.data.year = this.data.initial.year;
            this.data.month = this.data.initial.month;
            this.data.day = this.data.initial.day;
            this.data.hours = this.data.initial.hours;
            this.data.minutes = this.data.initial.minutes;
            this.data.pm = this.data.initial.pm;
        },

        _initDate: function(ui) {
            if (!this.options.showDate)
              ui.date.main.remove();
            else {
              /* TODO: the order should depend on locale and
               * configurable in the options. */
              var dataItems = {
                  0: ["year", this.data.initial.year],
                  1: ["month", this.options.months[this.data.initial.month]],
                  2: ["day", this.data.initial.day],
              };

              for (var data in dataItems)
                ui.date[dataItems[data][0]].text(dataItems[data][1]);
            }
        },

        _initTime: function(ui) {
            if (!this.options.showTime) {
                ui.time.main.remove();
                ui.button.remove();
            } else {
                /* TODO: the order should depend on locale and
                 * configurable in the options. */
                var dataItems = {
                    0: ["hours", this._normalizeHour(this._makeTwoDigitValue(this.data.initial.hours))],
                    1: ["separator", this.options.timeSeparator],
                    2: ["minutes", this._makeTwoDigitValue(this.data.initial.minutes)],
                };

                for (var data in dataItems)
                    ui.time[dataItems[data][0]].text(dataItems[data][1]);
            }
        },

        _initDateTimeDivs: function(ui) {
            if (this.options.showDate && this.options.showTime) {
                ui.main.attr("class", "ui-grid-a");
                if (!this.options.twentyfourHours) {
                    ui.main.attr("class", "ui-grid-b");
                }
            }

            this._initDate(ui);
            this._initTime(ui);
            ui.ampm.text(this._parseAmPmValue(this.data.initial.pm));
        },

        _makeTwoDigitValue: function(val) {
          var ret = val.toString(10);

          if (val < 10)
            ret = "0" + ret;
          return ret;
        },

        _normalizeHour: function(val) {
            val = parseInt(val);
            val = (!this.options.twentyfourHours && val > 12) ? (val - 12) : val;
            return this._makeTwoDigitValue(val);
        },

        _parseAmPmValue: function(pm) {
            return pm ? this.options.pm : this.options.am;
        },

        _showDataSelector: function( owner, ui, e ) {
            /* TODO: find out if it'd be better to prepopulate this, or
             * do some caching at least. */
            var obj = this;
            var klass = owner.attr("class");
            var numItems = 0;
            var selectorResult = undefined;

            $(".data-selected").each(function() {
                $(this).removeClass("data-selected");
            });
            owner.addClass("data-selected");

            if (klass.search("year") > 0) {
                var values = range(1900, 2100);
                numItems = values.length;
                selectorResult = obj._populateSelector( owner,
                    values, parseInt, null, obj.data, "year" );
            } else if (klass.search("month") > 0) {
                numItems = obj.options.months.length;
                selectorResult = obj._populateSelector( owner, obj.options.months,
                    function (month) {
                        var i = 0;
                        for (; obj.options.months[i] != month; i++);
                        return i;
                    },
                    function (index) {
                        return obj.options.months[index];
                    },
                    obj.data, "month" );
            } else if (klass.search("day") > 0) {
                var day = new Date(
                    obj.data.year, obj.data.month, 0).getDate();
                numItems = day;
                selectorResult = obj._populateSelector( owner,
                    range(1, day), parseInt, null, obj.data, "day");
            } else if (klass.search("hours") > 0) {
                var values =
                    range(this.options.twentyfourHours ? 0 : 1,
                          this.options.twentyfourHours ? 24 : 12)
                        .map(this._makeTwoDigitValue);
                numItems = values.length;
                /* TODO: 12/24 settings should come from the locale */
                selectorResult = obj._populateSelector( owner,
					 values, parseInt, function(val) {
                      if (!(obj.options.twentyfourHours))
                        val = ((val + 11) % 12) + 1;
                      return val;
                    },
                    obj.data, "hours" );
            } else if (klass.search("separator") > 0) {
                owner.removeClass("data-selected");
                console.log("datetimepicker: no dropdown for time separator");
            } else if (klass.search("minutes") > 0) {
                var values = range(0, 59).map(this._makeTwoDigitValue);
                numItems = values.length;
                selectorResult = obj._populateSelector( owner, values, 
					parseInt, null, obj.data, "minutes" );
            } 
            
            if (selectorResult !== undefined) {
                /* Now that all the items have been added to the DOM, let's compute
                 * the size of the selector.
                 */

				var $div = $(document.createElement('div'));
				$div.attr("data-style", "picker").append( selectorResult.list ).appendTo( ui.container );
				var ctx = $div.ctxpopup();
				ctx.ctxpopup( 'pop', owner.offset().left + owner.width() / 2 - window.pageXOffset, 
                    owner.offset().top + owner.height() / 2 - window.pageYOffset,
                    owner )
                    .bind( 'close', function() {
					    $(".data-selected").each(function() {
						    $(selectorResult.list).unbind('vclick');
    		                $(this).removeClass("data-selected");
	    	            });
		   		});
				obj.ctx = ctx;
                e.stopPropagation();
                e.preventDefault();
            }
        },
        
        // by kilio
        _switchAmPm: function(obj, owner, ui) {
            var val = owner.text().trim();
            if ( this.options.am == val ) {
                this.data["pm"] = true;
                owner.text(this.options.pm);
            } else {
                this.data["pm"] = false;
                owner.text(this.options.am);
            }
            $(obj.data.parentInput).trigger("date-changed", obj.getValue());
        },

        _populateSelector: function( owner, values,
                                    parseFromFunc, parseToFunc,
                                    dest, prop ) {

            var self = this;
            var obj = this;
            var destValue = (parseToFunc !== null ?
                                parseToFunc(dest[prop]) :
                                dest[prop]);
			var list = document.createElement('ul');        
            var i = 0;
            for (; i < values.length; i++) {
                var li = document.createElement('li');
				var item = document.createElement('a');
				$(li).append( item );
				$(item).text( values[i] ).attr('href','#').addClass("ui-link");
				if ( values[i] == destValue ) {
					$(li).addClass('current');
					currentIndex = i;
				}
				$(list).append( li );
            }

			$(list).bind( "vclick", function(e) {
				if ( $(e.target).is('a') ) {
					var value = $(e.target).text();
					var newValue = parseFromFunc( value );
					dest[prop] = newValue;
					owner.text( value );
					$(list).children().each( function() {
						$(this).parent().removeClass("current");
					});
					$(e.target).parent().addClass("current");

					$(obj.data.parentInput).trigger("date-changed", obj.getValue());
					if ( obj.ctx ) {
						obj.ctx.ctxpopup('close');
					}
				}
			});

            return {list: list, currentIndex: currentIndex};
        },

        _create: function() {

            var ui = {
              container: "#datetimepicker",
              header: "#datetimepicker-header",
              main: "#datetimepicker-main",
              date: {
                main: "#datetimepicker-date",
                year: "#datetimepicker-date-year",
                month: "#datetimepicker-date-month",
                day: "#datetimepicker-date-day"
              },
              time: {
                main: "#datetimepicker-time",
                hours: "#datetimepicker-time-hours",
                separator: "#datetimepicker-time-separator",
                minutes: "#datetimepicker-time-minutes"
              },
              ampm: "#datetimepicker-ampm-span",
              button: "#datetimepicker-ampm-div",             
            };

            ui = $.mobile.todons.loadPrototype("datetimepicker", ui);
           
            $.extend ( this, {
              panning: false,
              ui: ui,
              isOpen: false, // by kilio
              data : {
                now: new Date(),
                parentInput: 0,

                initial: {
                    year: 0,
                    month: 0,
                    day: 0,

                    hours: 0,
                    minutes: 0,
                    pm: false,
                },

                year: 0,
                month: 0,
                day: 0,

                hours: 0,
                minutes: 0,
                pm: false,
            } } );

            var obj = this;
            var input = this.element;

            $.mobile.todons.parseOptions(this);

            $(input).css("display", "none");
            $(input).after(ui.container);
            this.data.parentInput = input;

            var inputType = $(input).attr("type");
            this.options.showDate = (inputType == "date") || (inputType == "datetime");
            this.options.showTime = (inputType == "time") || (inputType == "datetime");

            /* We must display either time or date: if the user set both to
             * false, we override that.
             */
            if (!this.options.showDate && !this.options.showTime) {
                this.options.showDate = true;
            }

            this._initDateTime();

            ui.header.text(this.options.header);

            this._initDateTimeDivs(ui);
            
            ui.main.find(".data").each(function() {
                $(this).bind("vclick", function(e) {
					obj._showDataSelector( $(this), ui, e );
                    e.stopPropagation();
                });
            });

            ui.main.find("div.ampm").each(function() {
                $(this).bind("vclick", function(e) {
                    obj._switchAmPm(obj, $(this), ui);
                    e.stopPropagation();
                });
            });

        },

        getValue: function() {
            var actualHours = this.data.hours;
            if (!this.options.twentyfourHours && this.data.pm) {
                actualHours += 12;
            }
            return new Date(this.data.year,
                            this.data.month,
                            this.data.day,
                            actualHours,
                            this.data.minutes);
        }
    }); /* End of widget */

    $(document).bind("pagecreate create", function(e) {
        $($.todons.datetimepicker.prototype.options.initSelector, e.target)
            .not(":jqmData(role='none'), :jqmData(role='nojs')")
            .datetimepicker();
    });

})(jQuery, this);

