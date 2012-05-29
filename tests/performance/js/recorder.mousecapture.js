( function () {
	tcMouseCapture = {
		data : [],
		capture : function ( event ) {
			var log = {
				timeStamp : event.timeStamp,
				type : event.type,
				clientX : event.clientX,
				clientY : event.clientY,
				screenX : event.screenX,
				screenY : event.screenY,
				x : event.x,
				y : event.y
			};
			tcMouseCapture.data.push( log );
		},

		target : ['mousemove', 'mousedown', 'mouseup', 'click', 'mouseover', 'mouseout' ],

		start : function () {
			tcMouseCapture.data.splice( 0, tcMouseCapture.data.length );
			for ( var i in tcMouseCapture.target ) {
				document.addEventListener( tcMouseCapture.target[i], tcMouseCapture.capture );
			}

			return true;
		},

		stop : function () {
			for ( var i in tcMouseCapture.target ) {
				document.removeEventListener( tcMouseCapture.target[i], tcMouseCapture.capture );
			}

			return true;
		},

		dump : function () {
			return JSON.stringify(tcMouseCapture.data);
		}
	};
}());
