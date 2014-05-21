/*global window, define */
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../util",
			"./callbacks",
			"./object"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			var Deferred = function (callback) {
				var callbacks = ns.util.callbacks,
					object = ns.util.object,
					tuples = [
						// action, add listener, listener list, final state
						["resolve", "done", callbacks({once: true, memory: true}), "resolved"],
						["reject", "fail", callbacks({once: true, memory: true}), "rejected"],
						["notify", "progress", callbacks({memory: true})]
					],
					state = "pending",
					deferred = {},
					promise = {
						state: function () {
							return state;
						},
						always: function () {
							deferred.done(arguments).fail(arguments);
							return this;
						},
						then: function () {/* fnDone, fnFail, fnProgress */
							var functions = arguments;
							return new Deferred(function (newDefer) {
								tuples.forEach(function (tuple, i) {
									var fn = (typeof functions[i] === 'function') && functions[i];
									// deferred[ done | fail | progress ] for forwarding actions to newDefer
									deferred[tuple[1]](function () {
										var returned = fn && fn.apply(this, arguments);
										if (returned && (typeof returned.promise === 'function')) {
											returned.promise()
												.done(newDefer.resolve)
												.fail(newDefer.reject)
												.progress(newDefer.notify);
										} else {
											newDefer[tuple[0] + "With"](this === promise ? newDefer.promise() : this, fn ? [returned] : arguments);
										}
									});
								});
								functions = null;
							}).promise();
						},
						// Get a promise for this deferred
						// If obj is provided, the promise aspect is added to the object
						promise: function (obj) {
							if (obj) {
								return object.merge(obj, promise);
							}
							return promise;
						}
					};

				// Keep pipe for back-compat
				promise.pipe = promise.then;

				// Add list-specific methods

				tuples.forEach(function (tuple, i) {
					var list = tuple[2],
						stateString = tuple[3];

					// promise[ done | fail | progress ] = list.add
					promise[tuple[1]] = list.add;

					// Handle state
					if (stateString) {
						list.add(function () {
							// state = [ resolved | rejected ]
							state = stateString;

						// [ reject_list | resolve_list ].disable; progress_list.lock
						}, tuples[i ^ 1][2].disable, tuples[2][2].lock);
					}

					// deferred[ resolve | reject | notify ]
					deferred[tuple[0]] = function () {
						deferred[tuple[0] + "With"](this === deferred ? promise : this, arguments);
						return this;
					};
					deferred[tuple[0] + "With"] = list.fireWith;
				});

				// Make the deferred a promise
				promise.promise(deferred);

				// Call given func if any
				if (callback) {
					callback.call(deferred, deferred);
				}

				// All done!
				return deferred;
			};
			ns.util.deferred = Deferred;
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.util.deferred;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));
