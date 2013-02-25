/*
 * Unit Test: MultiMediaView
 *
 * Wonseop Kim <wonseop.kim@samsung.com>
 */
/*jslint browser: true*/
/*global $, jQuery, test, equal, ok*/
$( document ).ready( function ( ) {
	module("MultiMediaView");

	var unit_multimediaview = function ( widget, type ) {
		var control,
			fullscreenButton,
			width,
			height,
			played,
			fullScreen,
			timeupdated,
			ended,
			param,
			volumebutton,
			seekerbar,
			playpause;

		/* Create */
		widget.multimediaview( );
		ok( widget.hasClass("ui-multimediaview") , "Create");

		playpause = widget.parent( ).find('.ui-playpausebutton') ;
		ok( playpause.hasClass("ui-play-icon") , "Markup: Play button present");
		if ( type == 'vedio') {
			fullScreen = widget.parent( ).find('.ui-fullscreenbutton') ;
			ok( fullScreen.hasClass("ui-fullscreen-on") , "Markup: fullscreen button present");
		}
		volumebutton = widget.parent( ).find('.ui-volumebutton') ;
		ok( volumebutton.hasClass("ui-volume-icon") , "Markup: Volume button present");
		seekerbar = widget.parent( ).find('.ui-seekbar') ;
		equal( seekerbar.find(".ui-currenttime").css('width'), '0px', "Markup: initial current time");
		ok( widget.parent( ).find(".ui-durationlabel"), "Markup : duration label");
		ok( widget.parent( ).find(".ui-timestamplabel"), "Markup : current time label");
		ok( widget.parent( ).find(".ui-volumecontrol"), "Markup : volume control");

		/* width */
		width = 100;
		widget.multimediaview("width", width );
		equal( width, widget.width( ), "API: width");

		equal( width, widget.multimediaview("width") , "API: width multimediaview");

		/* height */
		height = 200;
		widget.multimediaview("height", height );
		equal( height, widget.height( ), "API: height");
		equal( height, widget.multimediaview("height") , "API: height multimediaview");
		if ( type === "video") {

			/* fullscreen */
			fullscreenButton = widget.parent( ).find(".ui-fullscreenbutton");
			equal( false, widget.multimediaview("fullScreen") , "API: fullScreen initially value - multimediaview");

			widget.multimediaview("fullScreen", true );
			ok( fullscreenButton.hasClass("ui-fullscreen-off"), "API: fullScreen ( on ) - markup");
			equal( true, widget.multimediaview("fullScreen") , "API: fullScreen set to true - multimediaview");
			equal( $("body")[0].clientHeight - 1 , widget.height( ), "API: height after full screen on");
			equal( $("body")[0].clientWidth , widget.width( ), "API: width after full screen on");

			widget.multimediaview("fullScreen", false );
			ok( fullscreenButton.hasClass("ui-fullscreen-on"), "API: fullScreen ( off ) - markup");
			equal( false, widget.multimediaview("fullScreen") , "API: fullScreen set to true - multimediaview");
			equal( widget.height( ) , height, "API: height after full screen off");
			equal( widget.width( ) , width, "API: width after full screen off");

		}
	};

	test("video", function ( ) {
		$('#multimediaview0').page( );
		unit_multimediaview( $("#video"), "video");
	} );

	test("audio", function ( ) {
		$('#multimediaview1').page( );
		unit_multimediaview( $("#audio"), "audio");
	} );

	test("audio dymanic", function ( ) {

		var createEvent = false,
			audioHTML = '<audio data-controls= "false"style= "width:100%;"id= "audioControl2"data-fullscreen= "false"class= "multimediaobjetc">' +
										'<source src= "http://www.w3schools.com/html5/mov_bbb.mp4"type= "audio/mp4"/>' +
										'<source src= "http://www.w3schools.com/html5/mov_bbb.ogg"type= "audio/ogg"/>' +
										'<p>Your browser does not support the audio tag.</p>' +
									'</audio>';
		$('#multimediaview11').page( );
		$('#multimediaview11').find(":jqmData(role=content)").append( audioHTML );

		$("#audioControl").bind("create", function ( ) {
			createEvent = true ;
		} );

		$('#audioControl2').trigger("create") ;
		equal( createEvent, true, "Audio Create Event") ;
		unit_multimediaview( $("#audioControl2"), "audio");
	} );

	test("video dymanic", function ( ) {

		var createEvent = false,
			videoHTML = '<video data-controls= "true"style= "width:100%;"id= "vedioControl1"data-fullscreen= "false"class= "multimediaobjetc">' +
									'<source src= "http://www.w3schools.com/html5/mov_bbb.mp4"type= "video/mp4"/>' +
									'<source src= "http://www.w3schools.com/html5/mov_bbb.ogg"type= "video/ogg"/>' +
									'<source src= "http://www.w3schools.com/html5/mov_bbb.webm"type= "video/webm"/>' +
									'<p>Your browser does not support the video tag.</p>' +
								'</video>';
		$('#multimediaview01').page( );
		$('#multimediaview01').find(":jqmData(role=content)").append( videoHTML ) ;

		$("#vedioControl1").bind("create", function ( ) {
			createEvent = true ;
		} );
		$('#vedioControl1').trigger("create") ;
		equal( createEvent, true, "Vedio Create Event") ;
		unit_multimediaview( $("#vedioControl1"), "video");
	} );

} );
