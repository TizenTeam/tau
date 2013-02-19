( function ( $, window ) {
	$( document ).ready( function () {
		$( "#MBTaddItemTest" ).click( function () {
			$( ":jqmData(role='tokentextarea')" ).tokentextarea( "add", "additem" );
		});

		$( "#MBTremoveItemTest" ).click( function () {
			$( ":jqmData(role='tokentextarea')" ).tokentextarea( "remove", 0 );
		});

		$( "#MBTinputTextTest" ).click( function () {
			$( ":jqmData(role='tokentextarea')" ).tokentextarea( "inputText", "Hello~~~" );
		});

		$( "#MBTgetInputTextTest" ).click( function () {
			var input = $( ":jqmData(role='tokentextarea')" ).tokentextarea( "inputText" );
			window.alert( "input String : " + input );
		});

		$( "#MBTremoveAllItemTest" ).click( function () {
			$( ":jqmData(role='tokentextarea')" ).tokentextarea( "remove" );
			$( ":jqmData(role='tokentextarea')" ).parents( ".ui-scrollview-view" ).parent().scrollview( "scrollTo", 0, 0 );
		});

		$( "#MBTgetSelectedItemTest" ).click( function () {
			var content = $( ":jqmData(role='tokentextarea')" ).tokentextarea( "select" );
			window.alert( "Select content : " + content );
		});

		$( "#MBTselectItemTest" ).click( function () {
			$( ":jqmData(role='tokentextarea')" ).tokentextarea( "select", 0 );
		});

		$( "#MBTlengthTest" ).click( function () {
			var length = $( ":jqmData(role='tokentextarea')" ).tokentextarea( "length" );
			window.alert( "length : " + length );
		});

		$( "#MBTfocusInTest" ).click( function () {
			$( ":jqmData(role='tokentextarea')" ).tokentextarea( "focusIn", 0 );
			$( ":jqmData(role='tokentextarea')" ).parents( ".ui-scrollview-view" ).parent().scrollview( "scrollTo", 0, 0 );
		});

		$( "#MBTfocusOutTest" ).click( function () {
			$( ":jqmData(role='tokentextarea')" ).tokentextarea( "focusOut", 0 );
			$( ":jqmData(role='tokentextarea')" ).parents( ".ui-scrollview-view" ).parent().scrollview( "scrollTo", 0, 0 );
		});

		$( "#MBTdestroyTest" ).click( function () {
			$( ":jqmData(role='tokentextarea')" ).tokentextarea( "destroy" );
		});

		$( "#contentList a" ).click( function () {
			var arg = $( this ).text();
			$( ":jqmData(role='tokentextarea')" ).tokentextarea( "add", arg );
		});

		$( "#cancelBtn" ).click( function () {
			$.mobile.changePage( "#tokentextarea", {
				transition: "reverse slide",
				reverse: false,
				changeHash: false
			} );
		});
	});
} ( jQuery, window ) );
