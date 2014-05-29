/*jslint browser: true*/
/*global $, jQuery, test, equal, ok, asyncTest, Globalize, start, stop, deepEqual, range*/
$(document).ready(function () {

	module( "Date Time Picker" );

	var datetime,
		date,
		time,
		custom,
		make2digit,
		isLeapYear,
		getDay,
		getCurDate,
		objDatetime,
		objDate,
		objTime,
		objCustom,
		markup,
		datetime2 ,
		date2,
		time2 ,
		custom2 ,
		objDatetime2,
		objDate2 ,
		objTime2,
		objCustom2;

	make2digit = function (arr) {
		var i, ret;
		for ( i = 0;  i < arr.length;  i++ ) {
			arr[i] = arr[i].toString();
			ret = arr[i].toString(10);
			if ( arr[i] < 10 ) {
				arr[i] = "0" + arr[i];
			}
		}
		return arr;
	};

	isLeapYear = function ( year ) {
		return year % 4 ? 0 : ( year % 100 ? 1 : ( year % 400 ? 0 : 1 ) );
	};

	getDay = function () {
		var date = new Date( "May 2 18:30:00 2012" ),
			daysInMonth = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ],
			day = daysInMonth[ date.getMonth() ];
		if ( day == 28 ) {
			day += isLeapYear( date.getFullYear() );
		}
		return day;
	};

	getCurDate = function () {
		var date = new Date( "May 2 18:30:00 2012" );
		return date.getDate();
	};

	//Dymanically creating datetimepicker
	markup = '<ul data-role="listview" id="datetimeList2">' +
						'<li class="ui-li-2line-sub-main">' +
							'<span class="ui-li-text-main">' +
								'<input type="datetime" id="datetime2" />' +
							'</span>' +
							'<span class="ui-li-text-sub">DateTimePicker</span>' +
						'</li>' +
						'<li class="ui-li-2line-sub-main">' +
							'<span class="ui-li-text-main">' +
								'<input type="date" id="date2"/>' +
							'</span>' +
							'<span class="ui-li-text-sub">DatePicker</span>' +
						'</li>' +
						'<li class="ui-li-2line-sub-main">' +
							'<span class="ui-li-text-main">' +
								'<input type="time" id="time2"/>' +
							'</span>' +
							'<span class="ui-li-text-sub">TimePicker</span>' +
						'</li>' +
						'<li class="ui-li-2line-sub-main">' +
							'<span class="ui-li-text-main">' +
								'<input type="datetime" id="custom2" data-format="MMM dd yyyy hh:mm tt" value="2012-06-30T00:00:00+00:00" />' +
							'</span>' +
							'<span class="ui-li-text-sub">DateTimePicker</span>' +
						'</li>' +
					'</ul>';

	// trigger pagecreate
	$( "#page-1" ).page();
	$('#page-1').find( ":jqmData(role=content)" ).append(markup);
	$('#page-1').find( ":jqmData(role=content)" ).trigger('create');

	datetime = $( "#datetime" )[0];
	date = $( "#date" )[0];
	time = $( "#time" )[0];
	custom = $( "#custom" )[0];

	datetime2 = $( "#datetime2" )[0];
	date2 = $( "#date2" )[0];
	time2 = $( "#time2" )[0];
	custom2 = $( "#custom2" )[0];

	objDatetime = $(datetime).data( "datetimepicker" );
	objDate = $(date).data( "datetimepicker" );
	objTime = $(time).data( "datetimepicker" );
	objCustom = $(custom).data( "datetimepicker" );

	objDatetime2 = $(datetime2).data( "datetimepicker" );
	objDate2 = $(date2).data( "datetimepicker" );
	objTime2 = $(time2).data( "datetimepicker" );
	objCustom2 = $(custom2).data( "datetimepicker" );
	/* End of dynamic creation*/

	asyncTest( "Auto-initialization", function () {
		ok( objDatetime, "should Date/Time instace created" );
		ok( objDate, "should Date instance created" );
		ok( objTime, "should Time instance created" );
		ok( objCustom, "should Custom format instance created" );
		start();
	});

	asyncTest( "Options", function () {
		equal( objDatetime.options.type, "datetime", "should 'datetime' type created." );
		equal( objDate.options.type, "date", "should 'date' type created." );
		equal( objTime.options.type, "time", "should 'time' type created." );
		equal( objCustom.options.type, "datetime", "should custom format created as 'datetime' type." );
		equal( objCustom.options.format, "MMM dd yyyy hh:mm tt", "should accept custom format string." );
		equal( objCustom.options.date.toString(), new Date( "Jun 30 00:00:00 UTC+0000 2012" ).toString(), "should accept preset date." );
		start();
	});

	asyncTest( "Private Methods", function () {
		var months, updateFieldTest ;
		ok( ( function () {
			var year = 0,
				expect = false,
				actual = false;

			try {
				for ( year = 1;  year < 2100;  year++ ) {
					expect = new Date( year, 1, 29 ).getDate() == 29;
					actual = objDatetime._isLeapYear( year );
					if ( expect != actual ) {
						throw year + " is wrong";
					}
				}
			} catch ( exception ) {
				console.log( exception );
				return false;
			}
			return true;
		}()), "should be able to check leap year" );

		ok( ( function () {
			var beforeNoon = objTime.option("date").getHours() < 12;
			objTime._switchAmPm();
			return beforeNoon != objTime.option("date").getHours() < 12;
		}()), "should change AM/PM by AMPM button" );

		objDatetime.options.date = new Date( "May 2 18:30:00 2012" );

		months = Globalize.culture().calendar.months.namesAbbr.slice();
		if ( months.length > 12 ) {
			months.length = 12;
		}

		/*date Value Api*/
		objDate.value( "Jan 1 09:00:00 2012" );
		equal(objDate.value( ) , "2012-01-01" , "Set and get value for date" );

		/*date Value Api*/
		objTime.value( "Jan 1 09:00:00 2012" );
		equal(objTime.value( ) , "09:00:00" , "Set and get value for time" );
		start();
	});

	asyncTest( "Public Methods", function () {
		objDatetime.value.call( objDatetime, "Jan 1 09:00:00 2012" );
		equal( "2012-01-01T09:00:00", objDatetime.value(), "should set and get value by API" );
		var format = "yyyy MM dd hh mm";
		objDatetime.option('format', format);
		equal( objDatetime.option( "format" ), format, "should set type and format" );
		start();
	});

	asyncTest( "Events", function () {
		var str = "May 2 18:00:00 2012";

		$(datetime).bind( "date-changed", function (e, date) {
			equal( objDatetime.value(), "2012-05-02T18:00:00", "Should invoke event when date changed" );
			start();
		});

		objDatetime.value( str );
	});

	asyncTest( "Auto-initialization Dynamic", function () {
		ok( objDatetime2, "should Date/Time instace created" );
		ok( objDate2, "should Date instance created" );
		ok( objTime2, "should Time instance created" );
		ok( objCustom2, "should Custom format instance created" );
		start();
	});

	asyncTest( "Options Dynamic", function () {
		equal( objDatetime2.options.type, "datetime", "should 'datetime' type created." );
		equal( objDate2.options.type, "date", "should 'date' type created." );
		equal( objTime2.options.type, "time", "should 'time' type created." );
		equal( objCustom2.options.type, "datetime", "should custom format created as 'datetime' type." );
		equal( objCustom2.options.format, "MMM dd yyyy hh:mm tt", "should accept custom format string." );
		equal( objCustom2.options.date.toString(), new Date( "Jun 30 00:00:00 UTC+0000 2012" ).toString(), "should accept preset date." );

		start();
	});

	asyncTest( "Private Methods Dynamic", function () {
		var months, updateFieldTest ;
		ok( ( function () {
			var year = 0,
				expect = false,
				actual = false;

			try {
				for ( year = 1;  year < 2100;  year++ ) {
					expect = new Date( year, 1, 29 ).getDate() == 29;
					actual = objDatetime2._isLeapYear( year );
					if ( expect != actual ) {
						throw year + " is wrong";
					}
				}
			} catch ( exception ) {
				console.log( exception );
				return false;
			}
			return true;
		}()), "should be able to check leap year" );

		ok( ( function () {
			var beforeNoon = objTime2.option("date").getHours() < 12;
			objTime2._switchAmPm();
			return beforeNoon != objTime2.option("date").getHours() < 12;
		}()), "should change AM/PM by AMPM button" );

		objDatetime2.options.date = new Date( "May 2 18:30:00 2012" );

		months = Globalize.culture().calendar.months.namesAbbr.slice();
		if ( months.length > 12 ) {
			months.length = 12;
		}
		/*date Value Api*/
		objDate2.value( "Jan 1 09:00:00 2012" );
		equal(objDate2.value( ) , "2012-01-01" , "Set and get value for date" );

		/*date Value Api*/
		objTime2.value( "Jan 1 09:00:00 2012" );
		equal(objTime2.value( ) , "09:00:00" , "Set and get value for time" );

		start();
	});

	asyncTest( "Public Methods Dynamic", function () {
		objDatetime2.value.call( objDatetime2, "Jan 1 09:00:00 2012" );
		equal( "2012-01-01T09:00:00", objDatetime2.value(), "should set and get value by API" );
		var format = "yyyy MM dd hh mm";
		objDatetime2.option('format', format);
		equal( objDatetime2.option( "format" ), format, "should set type and format" );
		start();
	});

	asyncTest( "Events Dynamic", function () {
		var str = "May 2 18:00:00 2012";
		$(datetime2).bind( "date-changed", function (e, date) {
			equal( objDatetime2.value(), "2012-05-02T18:00:00", "Should invoke event when date changed" );
			start();
		});

		objDatetime2.value( str );
	});
});
