( function ( $, window ) {
	$( document ).ready( function () {
		$( "#MBTaddItemTest" ).click( function () {
			$( ":jqmData(role='multibuttonentry')" ).multibuttonentry( "add", "additem" );
		});

		$( "#MBTremoveItemTest" ).click( function () {
			$( ":jqmData(role='multibuttonentry')" ).multibuttonentry( "remove", 0 );
		});

		$( "#MBTinputTextTest" ).click( function () {
			$( ":jqmData(role='multibuttonentry')" ).multibuttonentry( "inputText", "Hello~~~" );
		});

		$( "#MBTgetInputTextTest" ).click( function () {
			var input = $( ":jqmData( role='multibuttonentry' )" ).multibuttonentry( "inputText" );
			window.alert( "input String : " + input );
		});

		$( "#MBTremoveAllItemTest" ).click( function () {
			$( ":jqmData(role='multibuttonentry')" ).multibuttonentry( "remove" );
		});

		$( "#MBTgetSelectedItemTest" ).click( function () {
			var content = $( ":jqmData(role='multibuttonentry')" ).multibuttonentry( "select" );
			window.alert( "Select content : " + content );
		});

		$( "#MBTselectItemTest" ).click( function () {
			$( ":jqmData(role='multibuttonentry')" ).multibuttonentry( "select", 0 );
		});

		$( "#MBTlengthTest" ).click( function () {
			var length = $( ":jqmData(role='multibuttonentry')" ).multibuttonentry( "length" );
			window.alert( "length : " + length );
		});

		$( "#MBTfocusInTest" ).click( function () {
			$( ":jqmData(role='multibuttonentry')" ).multibuttonentry( "focusIn", 0 );
		});

		$( "#MBTfocusOutTest" ).click( function () {
			$( ":jqmData(role='multibuttonentry')" ).multibuttonentry( "focusOut", 0 );
		});

		$( "#MBTdestoryTest" ).click( function () {
			$( ":jqmData(role='multibuttonentry')" ).multibuttonentry( "destory" );
		});

		$( "#addressbook a" ).click( function () {
			var arg = $( this ).text();
			$( ":jqmData(role='multibuttonentry')" ).multibuttonentry( "add", arg );
		});
	});
} ( jQuery, window ) );