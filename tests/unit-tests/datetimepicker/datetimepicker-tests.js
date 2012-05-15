$(document).ready( function () {

	module( "Date Time Picker");

	var datetime = $("#datetime")[0];
	var date = $("#date")[0];
	var time = $("#time")[0];
	var custom = $("#custom")[0];

	// trigger pagecreate
	$( "#page-1" ).page();

	var objDatetime = $(datetime).data( "datetimepicker" );
	var objDate = $(date).data( "datetimepicker" );
	var objTime = $(time).data( "datetimepicker" );
	var objCustom = $(custom).data( "datetimepicker" );

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
		equal( objCustom.options.date.toString(), new Date("Jun 30 00:00:00 UTC+0000 2012").toString(), "should accept preset date." );

		start();
	});

	asyncTest( "Private Methods", function () {
		ok( ( function () {
			var year = 0,
				expect = false,
				actual = false;

			try {
				for ( year = 1; year < 2100; year++ ) {
					expect = new Date( year, 1, 29 ).getDate() == 29;
					actual = objDatetime._isLeapYear( year );
					if ( expect != actual ) {
						throw "" + year + " is wrong";
					}
				};
			} catch ( exception ) {
				console.log( exception );
				return false;
			}
			return true;
		}()), "should be able to check leap year" );

		var updateFieldTest = function ( format, value, expect ) {
			var target = $('<div data-pat=' + format + '></div>');
			objTime._updateField( target, value );
			return target.text();
		};

		deepEqual( [
			updateFieldTest( "h", 0 ),
			updateFieldTest( "hh", 1 ),
			updateFieldTest( "H", 13 ),
			updateFieldTest( "HH", 9 ),
			updateFieldTest( "m", 9 ),
			updateFieldTest( "mm", 9 ),
			updateFieldTest( "MMM", 3 ),
			updateFieldTest( "MMMM", 3 ),
			updateFieldTest( "yy", 1995 ),
			updateFieldTest( "yyyy", 1995 )
		],
		[
			"12", "01", "13", "09", "9", "09", "Mar", "March", "95", "1995"
		], "should update field to given value with format" );

		ok( ( function () {
			var origin = objTime.options.date.getHours() < 12 ? objTime.calendar.AM[0] : objTime.calendar.PM[0],
				span = $(time).parent().find( ".ui-datefield-period .ui-btn-text" );
			if ( span.text() != origin ) {
				console.log( span.text() + " " + origin );
				return false;
			}
			objTime._switchAmPm();
			if ( span.text() == origin ) {
				console.log( span.text() + " " + origin );
				return false;
			}
			return true;
		}()), "should change AM/PM by AMPM button" );

		deepEqual( [ "MMMM", " ", "dd", " ", "yyyy", " ", "hh", ":", "mm", " ", "dummy space" ],
			objTime._parsePattern( "MMMM dd yyyy hh:mm 'dummy space'" ), "should parse DTF string as array" );

		objDatetime.options.date = new Date( "May 2 18:30:00 2012" );
		deepEqual( [
			{ // hour h 6
				values : [ "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12" ],
				data : [ 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 12 ],
				numItems : 12,
				current : 5
			},
			{ // hour H 6
				values : range( 0, 23 ),
				data : range( 0, 23 ),
				numItems : 24,
				current : 18
			},
			{
				values : [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ],
				data : range( 1, 12 ),
				numItems : 12,
				current : 4
			}
		],
		[
			objDatetime._populateDataSelector( "hour", "hh", objDatetime ),
			objDatetime._populateDataSelector( "hour", "H", objDatetime ),
			objDatetime._populateDataSelector( "month", "MMM", objDatetime )
		], "should populate data selector by given field and pattern" );

		start();
	});

	asyncTest( "Public Methods", function () {
		equal( "2012-01-01T09:00:00",
			objDatetime.setValue.call(objDatetime, "Jan 1 09:00:00 2012").getValue(),
			"should set and get value by API" );
		var format = "yyyy MM dd hh mm";
		objDatetime.changeTypeFormat( "datetime", format );
		equal( $(datetime).data("datetimepicker").options.format, format, "should set type and format" );
		start();
	});

	asyncTest( "Events", function () {
		var str = "May 2 18:00:00 2012";

		$(datetime).bind("date-changed", function(e, date) {
			equal( date, "2012-05-02T18:00:00", "Should invoke event when date changed" );
			start();
		});

		objDatetime.setValue( str );
	});


});
