/*global Globalize:false, range:false, regexp:false*/
/*
 * jQuery Mobile Widget @VERSION
 *
 * This software is licensed under the MIT licence (as defined by the OSI at
 * http://www.opensource.org/licenses/mit-license.php)
 *
 * ***************************************************************************
 * Copyright (C) 2011 by Intel Corporation Ltd.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 * ***************************************************************************
 *
 * Authors: Salvatore Iovene <salvatore.iovene@intel.com>
 *			Daehyon Jung <darrenh.jung@samsung.com>
 */

/**
 * datetimepicker is a widget that lets the user select a date and/or a 
 * time. If you'd prefer use as auto-initialization of form elements, 
 * use input elements with type=date/time/datetime within form tag
 * as same as other form elements.
 * 
 * HTML Attributes:
 * 
 *	data-role: 'datetimepicker'
 *	data-format: date format string. e.g) "MMM dd yyyy, HH:mm"
 *	type: 'date', 'datetime', 'time'
 *	value: pre-set value. any date/time string Date.parse() accepts.
 *	data-value: same as above.
 *
 * Options:
 *	type: 'date', 'datetime', 'time'
 *	format: see data-format in HTML Attributes.
 *	value: see value in HTML Attributes.
 *	date: preset value as JavaScript Date Object representation.
 *
 * APIs:
 *	getValue()
 *		: Get current selected date/time as W3C DTF style string.
 *	setValue( datestring )
 *		: Set date/time to 'datestring'.
 *	changeTypeFormat( type, format )
 *		: Change Type and Format options
 *
 * Events:
 *	data-changed: Raised when date/time was changed.
 *
 * Examples:
 *	<ul data-role="listview">
 *		<li class="ui-li-3-2-2">
 *			<span class="ui-li-text-main">
 *				<input type="datetime" name="demo-date" id="demo-date" 
 *					data-format="MMM dd yyyy hh:mm tt"/>
 *			</span>
 *			<span class="ui-li-text-sub">
 *				Date/Time Picker - <span id="selected-date1"><em>(select a date first)</em></span>
 *			</span>
 *		</li>
 *		<li class="ui-li-3-2-2">
 *			<span class="ui-li-text-main">
 *				<input type="date" name="demo-date2" id="demo-date2"/>
 *			</span>
 *			<span class="ui-li-text-sub">
 *				Date Picker  - <span id="selected-date2"><em>(select a date first)</em></span>
 *			</span>
 *		</li>
 *		<li class="ui-li-3-2-2">
 *			<span class="ui-li-text-main">
 *				<input type="time" name="demo-date3" id="demo-date3"/>
 *			</span>
 *			<span class="ui-li-text-sub">
 *				Time Picker - <span id="selected-date3"><em>(select a date first)</em></span>
 *			</span>
 *		</li>
 *	</ul>
 * How to get a return value:
 * ==========================
 * Bind to the 'date-changed' event, e.g.:
 *    $("#myDatetimepicker").bind("date-changed", function(e, date) {
 *        alert("New date: " + date.toString());
 *    });
 */


( function ( $, window, undefined ) {
	$.widget( "tizen.datetimepicker", $.tizen.widgetex, {
		options: {
			type: undefined, // date, time, datetime applicable
			format: undefined,
			date: undefined,
			initSelector: "input[type='date'], input[type='datetime'], input[type='time'], :jqmData(role='datetimepicker')"
		},

		_value: {
			attr: "data-" + ( $.mobile.ns || "" ) + "date",
			signal: "date-changed"
		},

		_daysInMonth: [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ],

		_isLeapYear: function ( year ) {
			return year % 4 ? false :
					( year % 100 ? true :
							( year % 400 ? false : true ) );
		},

		_makeTwoDigits: function ( val ) {
			var ret = val.toString(10);

			if ( val < 10 ) {
				ret = "0" + ret;
			}
			return ret;
		},

		setValue: function ( newdate ) {
			if ( typeof ( newdate ) == "string" ) {
				newdate = new Date( newdate );
			}

			var fields = $('span,a', this.fieldDiv),
				type,
				fn,
				$field,
				btn,
				i;
			for ( i = 0; i < fields.length; i++ ) {
				$field = $(fields[i]);
				type = $field.attr("class").match(/ui-datefield-([\w]*)/);
				if ( !type ) {
					continue;
				}
				switch ( type[1] ) {
				case 'hour':
					fn = newdate.getHours;
					break;
				case 'min':
					fn = newdate.getMinutes;
					break;
				case 'sec':
					fn = newdate.getSeconds;
					break;
				case 'year':
					fn = newdate.getFullYear;
					break;
				case 'month':
					fn = function () {
						return newdate.getMonth() + 1;
					};
					break;
				case 'day':
					fn = newdate.getDate;
					break;
				case 'period':
					fn = newdate.getHours() < 12 ? this.calendar.AM[0] : this.calendar.PM[0];
					btn = $field.find( '.ui-btn-text' );
					if ( btn.length == 0 ) {
						$field.text(fn);
					} else if ( btn.text() != fn ) {
						btn.text( fn );
					}
					continue;
				default:
					continue;
				}
				this._updateField( $field, fn.call( newdate ) );
			}

			this.options.date = newdate;
			this._setValue( this.getValue() );
			return this;
		},

		/**
		 * return W3C DTF string
		 */
		getValue: function () {
			var date = this.options.date,
				obj = this,
				toTimeString,
				toDateString;

			toTimeString = function timeStr( t ) {
				return obj._makeTwoDigits( t.getHours() ) + ':' +
					obj._makeTwoDigits( t.getMinutes() ) + ':' +
					obj._makeTwoDigits( t.getSeconds() );
			};

			toDateString = function dateStr( d ) {
				return ( ( d.getFullYear() % 10000 ) + 10000 ).toString().substr(1) + '-' +
					obj._makeTwoDigits( d.getMonth() + 1 ) + '-' +
					obj._makeTwoDigits( d.getDate() );
			};

			switch ( this.options.type ) {
			case 'time':
				return toTimeString( date );
			case 'date':
				return toDateString( date );
			default:
				return toDateString( date ) + 'T' + toTimeString( date );
			}
		},

		_updateField: function ( target, value ) {
			if ( !target || target.length == 0 ) {
				return;
			}

			if ( value == 0 ) {
				value = "0";
			}

			var pat = target.jqmData( 'pat' ),
				hour,
				text;
			switch ( pat ) {
			case 'H':
			case 'HH':
			case 'h':
			case 'hh':
				hour = value;
				if ( pat.charAt(0) == 'h' ) {
					if ( hour > 12 ) {
						hour -= 12;
					} else if ( hour == 0 ) {
						hour = 12;
					}
				}
				if ( pat.length == 2 ) {
					hour = this._makeTwoDigits( hour );
				}
				text = hour;
				break;
			case 'm':
			case 'M':
			case 'd':
			case 's':
				text = value;
				break;
			case 'mm':
			case 'dd':
			case 'MM':
			case 'ss':
				text = this._makeTwoDigits( value );
				break;
			case 'MMM':
				text = this.calendar.months.namesAbbr[ value - 1];
				break;
			case 'MMMM':
				text = this.calendar.months.names[ value - 1 ];
				break;
			case 'yy':
				text = this._makeTwoDigits( value % 100 );
				break;
			case 'yyyy':
				if ( value < 10 ) {
					value = '000' + value;
				} else if ( value < 100 ) {
					value = '00' + value;
				} else if ( value < 1000 ) {
					value = '0' + value;
				}
				text = value;
				break;
			}
			// to avoid reflow where its value isn't out-dated
			if ( target.text() != text ) {
				target.text( text );
			}
		},

		_format: function ( pattern ) {
			var token = this._parsePattern( pattern ),
				div = document.createElement('div'),
				attr = [],
				pat,
				tpl,
				period,
				btn;

			while ( token.length > 0 ) {
				pat = token.shift();
				tpl = '<span class="ui-datefield-%1" data-pat="' + pat + '">%2</span>';
				switch ( pat ) {
				case 'H': //0 1 2 3 ... 21 22 23
				case 'HH': //00 01 02 ... 21 22 23
				case 'h': //0 1 2 3 ... 11 12
				case 'hh': //00 01 02 ... 11 12
					$(div).append( tpl.replace('%1', 'hour') );
					attr.hour = true;
					break;
				case 'mm': //00 01 ... 59
				case 'm': //0 1 2 ... 59
					$(div).append( tpl.replace('%1', 'min') );
					attr.min = true;
					break;
				case 'ss':
				case 's':
					$(div).append( tpl.replace('%1', 'sec') );
					attr.sec = true;
					break;
				case 'd': // day of month 5					
				case 'dd': // day of month(leading zero) 05
					$(div).append( tpl.replace('%1', 'day') );
					attr.day = true;
					break;
				case 'M': // Month of year 9
				case 'MM': // Month of year(leading zero) 09
				case 'MMM':
				case 'MMMM':
					$(div).append( tpl.replace('%1', 'month') );
					attr.month = true;
					break;
				case 'yy':	// year two digit
				case 'yyyy': // year four digit
					$(div).append( tpl.replace('%1', 'year') );
					attr.year = true;
					break;
				case 't': //AM / PM indicator(first letter) A, P
					// add button
				case 'tt': //AM / PM indicator AM/PM
					// add button
					btn = '<a href="#" class="ui-datefield-period"' +
						' data-role="button" data-inline="true">period</a>';
					$(div).append( btn );
					attr.period = true;
					break;
				case 'g':
				case 'gg':
					$(div).append( tpl.replace('%1', 'era').replace('%2', this.calendar.eras.name) );
					break;
				case '\t':
					$(div).append( tpl.replace('%1', 'tab').replace('%2', pat) );
					break;
				default : // string or any non-clickable object
					$(div).append( tpl.replace('%1', 'seperator').replace('%2', pat) );
					break;
				}
			}

			return {
				attr: attr,
				html: div
			};
		},

		_switchAmPm: function ( obj ) {
			if ( this.calendar.AM != null ) {
				var date = new Date( this.options.date ),
					text,
					change = 1000 * 60 * 60 * 12;
				if ( date.getHours() > 11 ) {
					change = -change;
				}
				date.setTime( date.getTime() + change );
				this.setValue( date );
			}
		},

		_parsePattern: function ( pattern ) {
			var regex = /\/|\s|dd|d|MMMM|MMM|MM|M|yyyy|yy|y|hh|h|HH|H|mm|m|ss|s|tt|t|f|gg|g|'.*'$|./g,
				matches,
				i;

			matches = pattern.match( regex );

			for ( i = 0; i < matches.length; i++ ) {
				if ( matches[i].charAt(0) == "'" ) {
					matches[i] = matches[i].substr( 1, matches[i].length - 2 );
				}
			}

			return matches;
		},

		changeTypeFormat: function ( type, format ) {
			this._field.remove();
			var elem = this.elem;

			$.mobile.widget.prototype.destroy.apply( this, arguments );
			$(elem).datetimepicker( {
				"type": type,
				"format": format,
				"date": this.options.date // preserve current date
			});
		},

		_create: function () {
			var input = this.element.get(0),
				type = this.options.type || $(input).attr("type") || 'datetime',
				isTime,
				isDate,
				obj = this,
				date = this.options.date || input.value || new Date(),
				$div;

			this._setOptions( {
				"type": type,
				"date": date
			});

			isTime = type.indexOf("time") > -1;
			isDate = type.indexOf("date") > -1;
			$.extend( obj, {
				elem: input,
				isTime: isTime,
				isDate: isDate,
				calendar: window.Globalize.culture().calendars.standard
			});

			$(input).css('display', 'none');
			$div = $('<div class="ui-datefield"></div>');
			// init date&time
			this._initFieldDiv( $div );
			$(input).after( $div );
			this._field = $div;
			this.setValue( date );

			$div.bind('vclick', function ( e ) {
				obj._showDataSelector( obj, this, e.target );
			});

			$div.find('.ui-datefield-period').buttonMarkup().bind( 'vclick', function ( e ) {
				obj._switchAmPm( obj );
			});

		},

		_populateDataSelector: function ( field, pat ) {
			var values,
				numItems,
				current,
				data,
				range = window.range,
				local,
				yearlb,
				yearhb,
				day;


			switch ( field ) {
			case 'hour':
				if ( pat == 'H' ) {
					// twentyfour
					values = range( 0, 23 );
					data = range( 0, 23 );
					current = this.options.date.getHours();
				} else {
					values = range( 1, 12 );
					current = this.options.date.getHours() - 1;//11
					if ( current >= 11 ) {
						current = current - 12;
						data = range( 13, 23 );
						data.push( 12 ); // consider 12:00 am as 00:00
					} else {
						data = range( 1, 11 );
						data.push( 0 );
					}
					if ( current < 0 ) {
						current = 11; // 12:00 or 00:00
					}
				}
				if ( pat.length == 2 ) {
					// two digit
					values = values.map( this._makeTwoDigits );
				}
				numItems = values.length;
				break;
			case 'min':
			case 'sec':
				values = range( 0, 59 );
				if ( pat.length == 2 ) {
					values = values.map( this._makeTwoDigits );
				}
				data = range( 0, 59 );
				current = ( field == 'min' ? this.options.date.getMinutes() : this.options.date.getSeconds() );
				numItems = values.length;
				break;
			case 'year':
				yearlb = 1900;
				yearhb = 2100;
				data = range( yearlb, yearhb );
				current = this.options.date.getFullYear() - yearlb;
				values = range( yearlb, yearhb );
				numItems = values.length;
				break;
			case 'month':
				switch ( pat.length ) {
				case 1:
					values = range( 1, 12 );
					break;
				case 2:
					values = range( 1, 12 ).map( this._makeTwoDigits );
					break;
				case 3:
					values = this.calendar.months.namesAbbr.slice();
					break;
				case 4:
					values = this.calendar.months.names.slice();
					break;
				}
				if ( values.length == 13 ) { // @TODO Lunar calendar support
					if ( values[12] == "" ) { // to remove lunar calendar reserved space
						values.pop();
					}
				}
				data = range( 1, values.length );
				current = this.options.date.getMonth();
				numItems = values.length;
				break;
			case 'day':
				day = this._daysInMonth[ this.options.date.getMonth() ];
				if ( day == 28 ) {
					day = day + this._isLeapYear( this.options.date.getFullYear() ) ? 1 : 0;
				}
				values = range( 1, day );
				if ( pat.length == 2 ) {
					values = values.map( this._makeTwoDigits );
				}
				data = range( 1, day );
				current = this.options.date.getDate() - 1;
				numItems = day;
				break;
			}

			return {
				values: values,
				data: data,
				numItems: numItems,
				current: current
			};

		},

		_showDataSelector: function ( obj, ui, target ) {
			target = $(target);

			var attr = target.attr("class"),
				field = attr ? attr.match(/ui-datefield-([\w]*)/) : undefined,
				pat,
				data,
				values,
				numItems,
				current,
				valuesData,
				html,
				datans,
				$ul,
				$div,
				$ctx,
				$li,
				i;

			if ( !attr ) {
				return;
			}
			if ( !field ) {
				return;
			}

			target.not('.ui-datefield-seperator').addClass('ui-datefield-selected');

			pat = target.jqmData('pat');
			data = obj._populateDataSelector.call( obj, field[1], pat );

			values = data.values;
			numItems = data.numItems;
			current = data.current;
			valuesData = data.data;

			if ( values ) {
				datans = "data-" + ($.mobile.ns ? ($.mobile.ns + '-') : "") + 'val="';
				for( i = 0; i < values.length; i++ ) {
					html += '<li><a class="ui-link" ' + datans + valuesData[i] +'">' + values[i] + '</a></li>';
				}

				$ul = $("<ul></ul>");
				$div = $('<div class="ui-datetimepicker-selector" data-transition="none"></div>');
				$div.append( $ul ).appendTo( ui );
				$ctx = $div.ctxpopup();
				$ctx.parents('.ui-popupwindow').addClass('ui-datetimepicker');
				$li = $(html);
				$( $li[current] ).addClass("current");
				$div.jqmData( "list", $li );
				$div.circularview();
				$ctx.popupwindow( 'open',
						target.offset().left + target.width() / 2 - window.pageXOffset,
						target.offset().top + target.height() - window.pageYOffset );
				$div.bind('closed', function ( e ) {
					$div.unbind( 'closed' );
					$ul.unbind( 'vclick' );
					$(obj).unbind( 'update' );
					$(ui).find('.ui-datefield-selected').removeClass('ui-datefield-selected');
					$ctx.popupwindow( 'destroy' );
					$div.remove();
				});

				$(obj).bind( 'update', function ( e, val ) {
					$ctx.popupwindow( 'close' );
					var date = new Date( this.options.date );
					switch ( field[1] ) {
					case 'min':
						date.setMinutes( val );
						break;
					case 'hour':
						date.setHours( val );
						break;
					case 'sec':
						date.setSeconds( val );
						break;
					case 'year':
						date.setFullYear( val );
						break;
					case 'month':
						date.setMonth( val - 1 );
						break;
					case 'day':
						date.setDate( val );
						break;
					}
					obj.setValue( date );
				});

				$ul.bind( 'vclick', function ( e ) {
					if ( $(e.target).is('a') ) {
						$ul.find(".current").removeClass("current");
						$(e.target).parent().addClass('current');
						var val = $(e.target).jqmData("val");
						$(obj).trigger( 'update', val ); // close popup, unselect field
					}
				});

				$div.circularview( 'centerTo', '.current', 500 );
			}
			return ui;
		},

		_initFieldDiv: function ( div ) {
			var date,
				time,
				datetime;

			if ( this.options.format ) {
				datetime = this._format( this.options.format );
				div.append( datetime.html );
			} else {
				if ( this.isDate ) {
					date = this._format( this.calendar.patterns.d );
					$(date.html).addClass('date');
					div.append( date.html );
				}

				if ( this.isDate && this.isTime ) {
					div.append( '<span class="ui-datefield-tab"></span>' );
				}

				if ( this.isTime ) {
					time = this._format( this.calendar.patterns.t );
					$(time.html).addClass('time');
					div.append( time.html );
				}
			}
			this.fieldDiv = div;
		}

	});

	$(document).bind("pagecreate create", function ( e ) {
		$($.tizen.datetimepicker.prototype.options.initSelector, e.target)
			.not(":jqmData(role='none'), :jqmData(role='nojs')")
			.datetimepicker();
	});

} ( jQuery, this ) );
