$(document).ready(function () {

	module( "Date Time Picker", {
		setup: function() {
			initObjects();
		}
	});

	var datetime = $("#datetime")[0],
		date = $("#date")[0],
		time = $("#time")[0],
		custom = $("#custom")[0],
		objDatetime,
		objDate,
		objTime,
		objCustom,
		initObjects;

	initObjects = function() {
		objDatetime = $(datetime).data( "datetimepicker" );
		objDate = $(date).data( "datetimepicker" );
		objTime = $(time).data( "datetimepicker" );
		objCustom = $(custom).data( "datetimepicker" );
	}

	// trigger pagecreate
	$( "#page-1" ).page();

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

		ok( ( function () {
			var beforeNoon = objTime.option("date").getHours() < 12;
			objTime._switchAmPm();
			return beforeNoon != objTime.option("date").getHours() < 12;
		}()), "should change AM/PM by AMPM button" );

		start();
	});

	asyncTest( "Public Methods", function () {
		objDatetime.value.call( objDatetime, "Jan 1 09:00:00 2012" );
		equal( "2012-01-01T09:00:00", objDatetime.value(), "should set and get value by API" );
		var format = "yyyy MM dd hh mm";
		objDatetime.option('format', format);
		equal( objDatetime.option("format"), format, "should set type and format" );
		start();
	});

	asyncTest( "Events", function () {
		var str = "May 2 18:00:00 2012";

		$(datetime).bind("date-changed", function(e, date) {
			equal( objDatetime.value(), "2012-05-02T18:00:00", "Should invoke event when date changed" );
			start();
		});

		objDatetime.value( str );
	});


});
