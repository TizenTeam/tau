( function () {
	tcMousePlayer = {
		queue : [],

		invokeEvent : function ( record ) {
			var elem = document.elementFromPoint( record.clientX, record.clientY );
			if ( elem ) {
				var e = document.createEvent( "MouseEvents" );
				e.initMouseEvent( record.type, true, true );
				for ( var i in record ) {
					e[i] = record[i];
				}
				elem.dispatchEvent( e );
			}
		},

		addQueue : function ( queue ) {
			console.log( "receiving queues..." );
			if ( 'length' in queue ) {
				for ( var i = 0; i < queue.length; i++ ) {
					tcMousePlayer.queue.push( queue[i] );
				}
			} else {
				tcMousePlayer.queue.push( queue );
			}
			console.log( "queues added..." );
		},

		start : function () {
			var idx = 0;
			if ( tcMousePlayer.queue.length > 1 ) {
				tcMousePlayer.invokeLater( 0,
					tcMousePlayer.queue[1].timeStamp - tcMousePlayer.queue[0].timeStamp );
			} else {
				tcMousePlayer.invokeEvent( tcMousePlayer.queue[0] );
			}
		},

		invokeLater : function ( idx, time ) {
			setTimeout( function () {
				var queue = tcMousePlayer.queue;
				var record = queue[idx];

				tcMousePlayer.invokeEvent( record );

				idx++;
				if ( idx < queue.length ) {
					tcMousePlayer.invokeLater( idx,
						queue[idx].timeStamp - record.timeStamp );
				}
			}, time );
		}
	};
}());
