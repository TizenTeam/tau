/* TBD */
/*!
 * jQuery Mobile Widget @VERSION
 *
 * Copyright (C) TODO
 * License: TODO
 * Authors: Salvatore Iovene <salvatore.iovene@intel.com>
 * 			Daehyon Jung <darrenh.jung@samsung.com>
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
 *
 * Options:
 * 	type: 'date', 'datetime', 'time'
 *	format: see data-format in HTML Attributes.
 *
 * APIs:
 * 	getValue()
 *		: Get current selected date/time as W3C DTF style string.
 * 	update()
 * 		: Force to update fields.
 *
 * Events:
 * 	data-changed: Raised when date/time was changed.
 *
 * Examples:
 *	<ul data-role="listview">
 *		<li class="ui-li-3-2-2">
 *			<span class="ui-li-text-main">
 *				<input type="datetime" name="demo-date" id="demo-date" 
 *					data-format="MMM dd yyyy hh:mm tt"/>
 * 			</span>
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


(function($, window, undefined) {
	$.widget("todons.datetimepicker", $.mobile.widget, {
		options: {
			type: 'datetime', // date, time, datetime applicable
			format: null,
			initSelector: "input[type='date'], input[type='datetime'], input[type='time'], :jqmData(role='datetimepicker')"
		},

		_makeTwoDigits: function(val) {
			var ret = val.toString(10);

			if ( val < 10 ) {
				ret = "0" + ret;
			}
			return ret;
		},

		/**
		 * return W3C DTF string
		 */
		getValue: function() { 
			var time = this.data.time;
			var date = this.data.date;			
			if ( this.calendar.convert ) {
				var greg = this.calendar.convert.toGregorian( 
						date.year, date.month, date.day );
				date.year = greg.getFullYear();
				date.month = greg.getMonth();
				date.day = greg.getDate();
			}
			var obj = this;
			var toTimeString = function timeStr( t ) {				
				return  obj._makeTwoDigits( t.hour ) + ':' +  
				 	obj._makeTwoDigits( t.min ) + ':' +
					obj._makeTwoDigits( t.sec );
				
			};
			var toDateString = function dateStr( d ) {
				return ( "" + ( ( d.year % 10000 ) + 10000 ) ).substr(1) + '-' +  
					obj._makeTwoDigits( d.month ) + '-' +  
					obj._makeTwoDigits( d.day ); 
				
			};

			switch ( this.options.type ) {
			case 'time':
				return toTimeString( time );
			case 'date':
				return toDateString( date );
			default:
				return toDateString( date ) + 'T' + toTimeString( time );
			}
		},

		_updateField: function( target, value ) {
			if ( !target || !value || target.length == 0 ) {
				return;
			}

			var pat = target.jqmData( 'pat' );
			switch ( pat ) {
			case 'H':
			case 'HH':
			case 'h':
			case 'hh':
				var hour = value;
				if ( pat.charAt(0) == 'h' ) {
					if ( hour > 12 ) {
						hour -= 12;
					}
					else if ( hour == 0 ) {
						hour = 12;
					}
				}
				if ( pat.length == 2 ) {
					hour = this._makeTwoDigits( hour );
				}
				target.text( hour );
				break;
			case 'm':				
			case 'M':
			case 'd':
			case 's':
				target.text( value );
				break;
			case 'mm':
			case 'dd':
			case 'MM':
			case 'ss':
				target.text( this._makeTwoDigits( value ) );
				break;
			case 'MMM':
				target.text( this.calendar.months.namesAbbr[ value - 1] );
				break;
			case 'MMMM':
				target.text( this.calendar.months.names[ value - 1 ] );
				break;
			case 'yy':
				target.text( this._makeTwoDigits( value % 100 ) );
				break;
			case 'yyyy':
				if ( value < 10 ) {
					value = '000' + value;
				} else if ( value < 100 ) {
					value = '00' + value;
				} else if ( value < 1000 ) {
					value = '0' + value; 
				}
				target.text( value );
				break;
			}

		},

		_format: function( pattern ) {
			var token = this._parsePattern( pattern );
			var div = document.createElement('div');
			var attr = [];
			while ( token.length > 0 ) {
				var pat = token.shift();
				var tpl = '<span class="ui-datefield-%1" data-pat="' + pat + '">%2</span>';
				switch ( pat ) {
				case 'H': //0 1 2 3 ... 21 22 23
				case 'HH': //00 01 02 ... 21 22 23
				case 'h': //0 1 2 3 ... 11 12
				case 'hh': //00 01 02 ... 11 12 					
					$(div).append( tpl.replace('%1', 'hour') );
					attr['hour'] = true;
					break;
				case 'mm': //00 01 ... 59
				case 'm': //0 1 2 ... 59
					$(div).append( tpl.replace('%1', 'min') );
					attr['min'] = true;
					break;
				case 'ss':
				case 's':
					$(div).append( tpl.replace('%1', 'sec') );
					attr['sec'] = true;
					break;
				case 'd': // day of month 5					
				case 'dd': // day of month(leading zero) 05
					$(div).append( tpl.replace('%1', 'day') );
					attr['day'] = true;
					break;
				case 'M': // Month of year 9
				case 'MM': // Month of year(leading zero) 09
				case 'MMM':
				case 'MMMM':
					$(div).append( tpl.replace('%1', 'month') );
					attr['month'] = true;
					break;	
				case 'yy':	// year two digit
				case 'yyyy': // year four digit
					$(div).append( tpl.replace('%1', 'year') );
					attr['year'] = true;
					break;
				case 't': //AM / PM indicator(first letter) A, P
					// add button
				case 'tt': //AM / PM indicator AM/PM
					// add button
					var ampm = this.data.time.hour > 11 ? 
							this.calendar.PM[0] : this.calendar.AM[0];							
					var btn = '<a href="#" class="ui-datefield-ampm" data-role="button">' + 
							ampm + '</a>';
					$(div).append( btn );
					attr['ampm'] = true;
					break;
				case 'g':
				case 'gg':
					$(div).append( tpl.replace('%1', 'era').replace('%2', 
																this.calendar.eras.name) );
					break;
				default : // string or any non-clickable object
					$(div).append( tpl.replace('%1', 'seperator').replace('%2', pat) );
					break;
				}
			}

			return {
				attr: attr,
				html: div,				
			};
		},

		_switchAmPm: function( obj, owner ) {
			if ( this.calendar.AM != null ) {
				if ( this.calendar.AM[0] == $(owner).find('.ui-btn-text').text() ) { // AM to PM
					this.data.time.hour += 12;
					$(owner).find('.ui-btn-text').text( this.calendar.PM[0] );
				} else {	// PM to AM
					this.data.time.hour -= 12;
					$(owner).find('.ui-btn-text').text( this.calendar.AM[0] );
				}
				obj.update();
			}
		},

		update: function() {
			if ( $(this.elem).is('input') ) {
				this.elem.value = this.getValue();
			}
			$(this.elem).trigger('date-changed', this.getValue() );
		},

		_parsePattern: function( pattern ) {
			var regex = /^(\/|'(.*?)'|dd|d|MMMM|MMM|MM|M|yyyy|yy|y|hh|h|HH|H|mm|m|ss|s|tt|t|f|gg|g)/g;
			var token = [];

			while ( pattern.length > 0 ) {
				var s = regex.exec( pattern );
				if ( s ) {
					pattern = pattern.substr( s[0].length );
					token.push( s[0] );
				} else {
					token.push( pattern.charAt(0) );
					pattern = pattern.substr(1);
				
				}
			}
			
			return token;
		},

		_create: function() {
			var input = this.element;
			var type = $(input).attr("type");
			if ( type ) {
				this.options.type = type;
			}

			var isTime = type.indexOf("time") > -1;
			var isDate = type.indexOf("date") > -1;
	
			$.extend( this, {
				elem: input,
				time: isTime,
				date: isDate,
				calendar: Globalize.culture().calendars.standard,
				data: {
					now: new Date(),
					parentInput: undefined,
					time: { 
						hour: 0,
						min: 0,
						sec: 0
					},
					date: {
						year: 0,
						month: 0,
						day: 0
					},
				},
				
			});
		
			// init date&time
			var now = this.data.now;
			if ( isDate ) {
				var date = this.data.date;	 	
				if ( this.calendar.convert ) {
					var local = this.calendar.convert.fromGregorian( 
							this.data.now );
					date.year = local.year;
					date.month = local.month + 1;
					date.day = local.day;
				} else {
					date.year = now.getFullYear();
					date.month = now.getMonth() + 1;
					date.day = now.getDate();
				}
			}

			if ( isTime ) {
				var time = this.data.time;
				time.hour = now.getHours();
				time.min = now.getMinutes();
				time.sec = now.getSeconds();
			}
			$.mobile.todons.parseOptions( this );
			$(input).css('display', 'none');
			$div = $(document.createElement('div'));
			$div.addClass('ui-datefield');
			$(input).after( $div );
			this._initField( this.options.type, $div );
			$div.trigger('create');
			var obj = this;
			$div.bind('vclick', function(e) {
				obj._showDataSelector( obj, this, e.target );
			});
			$div.find('.ui-datefield-ampm').bind( 'vclick', function(e) {
				obj._switchAmPm( obj, this );
			});
		},
		
		_populateDataSelector: function( field, pat, obj ) {
			var values, numItems, current, data;
			switch ( field ) {
			case 'hour': 
				if ( pat == 'H' ) {
					// twentyfour
					values = range( 0, 23 );
					data = range( 0, 23 );
					current = obj.data.time.hour;
				} else {
					values = range( 1, 12 );
					current = obj.data.time.hour - 1;//11
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
					values = values.map( obj._makeTwoDigits );
				}
				numItems = values.length;
				break;
			case 'min':
			case 'sec':
				values = range( 0, 59 );
				if ( pat.length == 2 ) {
					values = values.map( obj._makeTwoDigits );
				}
				data = range( 0, 59 );
				current = ( field == 'min' ? obj.data.time.min : obj.data.time.sec );
				numItems = values.length;
				break;
			case 'year':				
				var local = new Date( 1900, 0, 1 );
				var yearlb;
				var yearhb;
				if ( obj.calendar.convert ) {
					local = obj.calendar.convert.fromGregorian( local );
					yearlb = local.year;
					yearhb = yearlb + 200;
				} else {
					yearlb = local.getFullYear();
					yearhb = yearlb + 200;
				}	
				data = range( yearlb, yearhb );
				current = obj.data.date.year - yearlb;
				values = range( yearlb, yearhb );
				numItems = values.length;
				break;
			case 'month':
				switch ( pat.length ) {
				case 1:
					values = range( 1, 12 );
					break;
				case 2:
					values = range( 1, 12 ).map( obj._makeTwoDigits );
					break;
				case 3:
					values = obj.calendar.months.namesAbbr.slice();
					break;
				case 4:
					values = obj.calendar.months.names.slice();
					break;
				}
				if ( values.length == 13 ) { // @TODO Lunar calendar support
					if ( values[12] == "" ) { // to remove lunar calendar reserved space
						values.pop();
					}
				}
				data = range( 1, values.length );
				current = obj.data.date.month - 1;
				numItems = values.length;
				break;
			case 'day':
				//@TODO max number 31 -> depends on month
				var day = 31;
				values = range( 1, day );
				if ( pat.length == 2 ) {
					values = values.map( obj._makeTwoDigits );
				}
				data = range( 1, day );
				current = obj.data.date.day - 1;
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

		_showDataSelector: function( obj, ui, target ) {
			target = $(target);

			var attr = target.attr("class");
			if ( !attr ) {
				return;
			}
			var field = attr.match(/ui-datefield-([^ ]*)/);
			if ( !field ) {
				return;
			} 
			
			target.addClass('ui-datefield-selected');

			var pat = target.jqmData('pat');
			var data = obj._populateDataSelector( field[1], pat, obj );

			var values = data.values, 
				numItems = data.numItems;
				current = data.current;
				valuesData = data.data;

			if ( values ) {
				$ul = $(document.createElement('ul'));
				for ( item in values ) {
					$li = $(document.createElement('li'));
					$item = $(document.createElement('a'));
					$item.addClass('ui-link');
					$item.text( values[item] );
					$item.jqmData( "val", valuesData[item] );

					$li.append( $item );
					$ul.append( $li );
					
					if ( current == item ) {
						$li.addClass('current');
					}
				}
				
				var $div = $(document.createElement('div') );
				$div.attr("data-style", "picker").append( $ul ).appendTo( ui );
				var $ctx = $div.ctxpopup();

				$ctx.ctxpopup( 'pop', 
						target.offset().left + target.width() / 2 - window.pageXOffset,
						target.offset().top + target.height() / 2 - window.pageYOffset,
						target );
				$div.bind('close', function(e) {
					$div.unbind( 'close' );
					$ul.unbind( 'vclick' );
					$(obj).unbind( 'update' );
					$(ui).find('.ui-datefield-selected').removeClass('ui-datefield-selected');
				});
				$(obj).bind( 'update', function( e, val ) {
					$ctx.ctxpopup( 'close' );
					var data = $(ui).find( '.' + field[0] );
					obj._updateField( $(data), val );
					console.log( data );
					switch( field[1] ) {
					case 'year':
						obj.data.date.year = val;
						break;
					case 'month':
						obj.data.date.month = val;
						break;
					case 'day':
						obj.data.date.day = val;
						break;
					case 'hour':
						obj.data.time.hour = val;
						break;
					case 'min':
						obj.data.time.min = val;
						break;
					case 'sec':
						obj.data.time.sec = val;
						break;
					}
					obj.update();
				});
				$ul.bind( 'vclick', function( e ) {
					if ( $(e.target).is('a') ) {
						var val = $(e.target).jqmData("val"); 
						$(obj).trigger( 'update', val ); // close popup, unselect field
					}
				});
			}
		},

		_initField: function( type, div ){
			var updateFields = function( obj, html, attr ) {
				if ( attr['year'] ) {
					obj._updateField( $(html).find( '.ui-datefield-year' ), 
									obj.data.date.year );
				} 
				if ( attr['month'] ) {
					obj._updateField( $(html).find( '.ui-datefield-month' ),
									obj.data.date.month );
				} 
				if ( attr['day'] ) {
					obj._updateField( $(html).find( '.ui-datefield-day' ),
									obj.data.date.day );
				} 
				if ( attr['hour'] ) {
					obj._updateField( $(html).find( '.ui-datefield-hour' ),
									obj.data.time.hour );
				} 
				if ( attr['min'] ) {
					obj._updateField( $(html).find( '.ui-datefield-min' ),
									obj.data.time.min );
				}
				if ( attr['sec'] ) {
					obj._updateField( $(html).find( '.ui-datefield-sec' ),
									obj.data.time.sec );
				}
			};

			if ( this.options.format ) {
				var datetime = this._format( this.options.format );
				updateFields( this, datetime.html, datetime.attr );
				div.append( datetime.html );
			} else {
				if ( type.match( 'date' ) ) {
					var date = this._format( this.calendar.patterns.d );
					$(date.html).addClass('date');
					updateFields( this, date.html, date.attr );
					div.append( date.html );
				}

				if ( type.match( 'datetime' ) ) {
					div.append( '<span class="ui-datefield-tab"></span>' );
				}

				if ( type.match( 'time' ) ) {
					var time = this._format( this.calendar.patterns.t );
					$(time.html).addClass('time');
					updateFields( this, time.html, time.attr );
					div.append( time.html );
				}
			}									
		},		

	});

	$(document).bind("pagecreate create", function(e) {
		$($.todons.datetimepicker.prototype.options.initSelector, e.target)
			.not(":jqmData(role='none'), :jqmData(role='nojs')")
			.datetimepicker();
	});

})(jQuery, this);
