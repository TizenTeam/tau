$( document ).one("pagecreate", "#datetimepicker-demo", function () {

	$("#demo-date").on("date-changed", function ( e, newDate ) {
		$("#selected-date1").text( newDate.toString() );
	});

	$("#demo-date2").on("date-changed", function ( e, newDate ) {
		$("#selected-date2").text( newDate.toString() );
	});

	$("#demo-date3").on("date-changed", function ( e, newDate ) {
		$("#selected-date3").text( newDate.toString() );
	});

	$("#demo-date4").on("date-changed", function ( e, newDate ) {
		$("#selected-date4").text( newDate.toString() );
	});

	$("#demo-date5").on("date-changed", function ( e, newDate ) {
		$("#selected-date5").text( newDate.toString() );
	});

	$("#demo-date6").on("date-changed", function ( e, newDate ) {
		$("#selected-date6").text( newDate.toString() );
	});
});