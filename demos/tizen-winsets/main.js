$( document ).bind("pagecreate", function () {

	$("#demo-date").bind("date-changed", function ( e, newDate ) {
		$("#selected-date1").text( newDate.toString() );
	});

	$("#demo-date2").bind("date-changed", function ( e, newDate ) {
		$("#selected-date2").text( newDate.toString() );
	});

	$("#demo-date3").bind("date-changed", function ( e, newDate ) {
		$("#selected-date3").text( newDate.toString() );
	});

	$("#demo-date4").bind("date-changed", function ( e, newDate ) {
		$("#selected-date4").text( newDate.toString() );
	});

	$("#demo-date5").bind("date-changed", function ( e, newDate ) {
		$("#selected-date5").text( newDate.toString() );
	});

	$("#demo-date6").bind("date-changed", function ( e, newDate ) {
		$("#selected-date6").text( newDate.toString() );
	});

	$('#noti-demo').bind('vmouseup', function ( e ) {
		$('#notification').notification('open');
	});

	$('#noti-icon1').bind('vclick', function ( e ) {
		$('#notification').notification('icon', './test/icon02.png');
	});

	$('#noti-icon2').bind('vclick', function ( e ) {
		$('#notification').notification('icon', './test/icon01.png');
	});

	$('#gallery-demo').bind('pageshow', function () {
		$('#gallery').gallery('add', './test/01.jpg');
		$('#gallery').gallery('add', './test/02.jpg');
		$('#gallery').gallery('add', './test/03.jpg');
		$('#gallery').gallery('add', './test/04.jpg');
		$('#gallery').gallery('add', './test/05.jpg');
		$('#gallery').gallery('add', './test/06.jpg');
		$('#gallery').gallery('add', './test/07.jpg');
		$('#gallery').gallery('add', './test/08.jpg');
		$('#gallery').gallery('add', './test/09.jpg');
		$('#gallery').gallery('refresh', 3);
	});

	$('#gallery-demo').bind('pagebeforehide', function () {
		$('#gallery').gallery('empty');
	});

	$('#gallery-add').bind('vmouseup', function ( e ) {
		$('#gallery').gallery('add', './test/10.jpg');
		$('#gallery').gallery('add', './test/11.jpg');
		$('#gallery').gallery('refresh');
	});

	$('#gallery-del').bind('vmouseup', function ( e ) {
		$('#gallery').gallery('remove');
	});

	/* Gen list : Dummy DB load */
	$( document ).on( "pagecreate", ".virtuallist_demo_page", function () {
		/* ?_=ts code for no cache mechanism */
		$.getScript( "./virtuallist-db-demo.js", function ( data, textStatus ) {
			$("ul").filter( function () {
				return $( this ).data("role") == "virtuallistview";
			}).addClass("vlLoadSuccess");

			$(".virtuallist_demo_page").die();
			$("ul.ui-virtual-list-container").virtuallistview("create");
		});
	});

	/*Expandable list : Dummy DB load*/
	$( document ).on( "pagecreate", "#genlist_extendable_page", function () {
		/*?_=ts code for no cache mechanism*/
		$.getScript( "./virtuallist-db-demo.js", function ( data, textStatus ) {
			$("ul").filter( function () {
				return $( this ).data("role") == "extendablelist";
			}).addClass("elLoadSuccess");

			$("#genlist-extendable-page").die();
			$("ul.ui-extendable-list-container").extendablelist("create");
			// TODO: 'create' is called twice!!
		});
	});

	// Expand all textarea height automatically
	$( document ).on( "pagecreate", "#ButtonNolist", function ( ev ) {
		var page = $( ev.target );
		$( page ).bind( 'pageshow' , function ( ) {
			var textarea = page.find('textarea');
			$( textarea ).each( function ( idx, el ) {
				var h = Math.max( el.clientHeight, el.scrollHeight );
				$( el ).height( h );
			} );
		} );
	} );

});

$(document).bind( "pageinit" , function() {
	$.mobile.tizen.enableSelection( $("div:jqmData(role='page')"), 'none' );
});
$(document).ready( function () {
	// add current datetime with browser language format
	// NOTE: Globalize.* functions must be run after docoument ready.
	$('#current_date').html(Globalize.culture().name + " -- " +
				Globalize.format( new Date(), "F" ));
	$('#html_font_size').html('html font size:' + $('html').css('font-size'));
});
