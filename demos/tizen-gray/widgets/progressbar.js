var progressbar_running;

$("#progressbar-demo").live("pageshow", function ( e ) {

	$("#progressbarTest").bind("vclick", function ( e ) {
		progressbar_running = !progressbar_running;

		// request animation frame
		window.requestAnimFrame = (function () {
			return window.requestAnimationFrame ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				window.oRequestAnimationFrame ||
				window.msRequestAnimationFrame ||
				function (animloop) {
					return window.setTimeout(animloop, 1000 / 60);
				};
		}());

		window.cancelRequestAnimFrame = (function () {
			return window.cancelAnimationFrame ||
				window.webkitCancelRequestAnimationFrame ||
				window.mozCancelRequestAnimationFrame ||
				window.oCancelRequestAnimationFrame ||
				window.msCancelRequestAnimationFrame ||
				clearTimeout;
		}());

		var request,
			i = 0;

		// start and run the animloop
		(function animloop() {
			if ( !progressbar_running ) {
				cancelRequestAnimFrame( request );
				return;
			}

			$("#progressbar").progressbar( "option", "value", i++ );

			request = requestAnimFrame( animloop );

			if ( i > 100 ) {
				cancelRequestAnimFrame( request );
			}
		}());
	});

	$( this ).find("#pending").progress({ running: true });
	$( this ).find("#progressing").progress({ running: true });

	$("#pendingTest").bind("vclick", function ( e ) {
		var running = $("#pending").progress( "option", "running" );
		// start/stop progressing animation
		$("#pending").progress( "option", "running", !running );
	});

	$("#progressingTest").bind("vclick", function ( e ) {
		var running = $("#progressing").progress( "option", "running" );
		// start/stop progressing animation
		$("#progressing").progress( "option", "running", !running );
	});
});

$("#progressbar-demo").live("pagehide", function ( e ) {
	progressbar_running = false;
	$( this ).find("#pending").progress( { running: true } );
	$( this ).find("#progressing").progress( { running: true } );
});
