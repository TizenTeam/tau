	$('#progressbar-demo').live('pageshow', function (e) {

		// set progressbar value...
		$('#progressbar').progressbar("option", "value", 37);

		// how to update progressbar..
		$('#progressbarTest').bind('vclick', function (e) {

			// request animation frame
			window.requestAnimFrame = (function(){
				return  window.requestAnimationFrame       ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame    ||
				window.oRequestAnimationFrame      ||
				window.msRequestAnimationFrame     ||
				function(animloop){
				return window.setTimeout(animloop, 1000 / 60);
				};
			})();
			window.cancelRequestAnimFrame = ( function() {
				return window.cancelAnimationFrame          ||
				window.webkitCancelRequestAnimationFrame    ||
				window.mozCancelRequestAnimationFrame       ||
				window.oCancelRequestAnimationFrame     ||
				window.msCancelRequestAnimationFrame        ||
				clearTimeout
			})();

			// to store the request
			var request;
			// progress value
			var i = 0;

			// start and run the animloop
			(function animloop(){
				$('#progressbar').progressbar("option", "value", i++);
				request = requestAnimFrame(animloop);
				if ( i > 100 )
					cancelRequestAnimFrame(request);
			})();
		});
		$(this).find('#pending').progressing({ running: true });
		$(this).find('#progressing').progressing({ running: true });

		$('#pendingTest').bind('vclick', function (e) {
			var running = $('#pending').progressing( "option", "running" );
			// start/stop progressing animation
			if ( running );
				$('#pending').progressing( "option", "running", !running );
		});

		$('#progressingTest').bind('vclick', function (e) {
			var running = $('#progressing').progressing( "option", "running" );
			// start/stop progressing animation
			if ( running );
				$('#progressing').progressing( "option", "running", !running );
		});
	});

	$('#progressbar-demo').bind('pagehide', function (e) {
		$(this).find('#pending').progressing( "option", "running", false );
		$(this).find('#progressing').progressing( "option", "running", false );
	});


