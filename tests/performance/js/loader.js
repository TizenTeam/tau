( function (T) {
	T.jobqueue = [];

	T.run = function ( tc ) {
		console.log( "Start test - " + (tc.name ? tc.name : "Untitled") );

		if ( tc.setUp ) {
			T.jobqueue.push( {
				job: tc.setUp,
				name: "setUp()"
			});
		}

		var name;
		for ( name in tc ) {
			if ( name.indexOf("test") == 0 ) {
				T.jobqueue.push( {
					job: tc[name],
					name: name + "()"
				});
			}
		}

		if ( tc.tearDown ) {
			T.jobqueue.push( {
				job: tc.tearDown,
				name: "tearDown()"
			});
		}

		T.next();
	};

	T.next = function () {
		var s = T.jobqueue.shift();
		if ( s ) {
			console.log( "run " + s.name );
			s.job(T);
		}
	};

	T.done = function () {
		
	};
}(T));

