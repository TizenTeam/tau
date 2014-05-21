/*global window, define */
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../util",
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			
			// Deferred helper
			var when = function( subordinate /* , ..., subordinateN */ ) {
				var i = 0,
					resolveValues = [].slice.call( arguments ),
					length = resolveValues.length,

					// the count of uncompleted subordinates
					remaining = length !== 1 || (subordinate && (typeof subordinate.promise === "function")) ? length : 0,

					// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
					deferred = remaining === 1 ? subordinate : new ns.util.deferred(),

					// Update function for both resolve and progress values
					updateFunc = function( i, contexts, values ) {
						return function( value ) {
							contexts[ i ] = this;
							values[ i ] = arguments.length > 1 ? [].slice.call( arguments ) : value;
							if ( values === progressValues ) {
								deferred.notifyWith( contexts, values );

							} else if ( !(--remaining) ) {
								deferred.resolveWith( contexts, values );
							}
						};
					},

					progressValues,
					progressContexts,
					resolveContexts;

				// add listeners to Deferred subordinates; treat others as resolved
				if (length > 1) {
					progressValues = new Array(length);
					progressContexts = new Array(length);
					resolveContexts = new Array(length);
					for ( ; i < length; i++ ) {
						if (resolveValues[i] && (typeof resolveValues[i].promise === "function")) {
							resolveValues[i].promise()
								.done(updateFunc(i, resolveContexts, resolveValues))
								.fail(deferred.reject)
								.progress(updateFunc(i, progressContexts, progressValues));
						} else {
							--remaining;
						}
					}
				}

				// if we're not waiting on anything, resolve the master
				if (!remaining) {
					deferred.resolveWith(resolveContexts, resolveValues);
				}

				return deferred.promise();
			};

			ns.util.deferredWhen = when;

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.util.deferredWhen;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));
