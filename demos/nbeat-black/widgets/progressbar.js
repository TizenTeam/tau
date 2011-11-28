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
		$(this).find('#pending').progress_pending('start');
		$(this).find('#progressing').progressing('start');
	});

	$('#progressbar-demo').bind('pagehide', function (e) {
		$(this).find('#pending').progress_pending('stop');
		$(this).find('#progressing').progressing('stop');
	});


