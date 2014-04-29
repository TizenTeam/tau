/*global window, define */
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../utils",
			"./object"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			/*
			* Create a callback list using the following parameters:
			*
			*	options: an optional list of space-separated options that will change how
			*			the callback list behaves or a more traditional option object
			*
			* By default a callback list will act like an event callback list and can be
			* "fired" multiple times.
			*
			* Possible options:
			*
			*	once:			will ensure the callback list can only be fired once (like a Deferred)
			*
			*	memory:			will keep track of previous values and will call any callback added
			*					after the list has been fired right away with the latest "memorized"
			*					values (like a Deferred)
			*
			*	unique:			will ensure a callback can only be added once (no duplicate in the list)
			*
			*	stopOnFalse:	interrupt callings when a callback returns false
			*
			*/
			ns.utils.callbacks = function (orgOptions) {

				var object = ns.utils.object,
					options = object.copy(orgOptions),
					slice = [].slice,
					// Last fire value (for non-forgettable lists)
					memory,
					// Flag to know if list was already fired
					fired,
					// Flag to know if list is currently firing
					firing,
					// First callback to fire (used internally by add and fireWith)
					firingStart,
					// End of the loop when firing
					firingLength,
					// Index of currently firing callback (modified by remove if needed)
					firingIndex,
					// Actual callback list
					list = [],
					// Stack of fire calls for repeatable lists
					stack = !options.once && [],
					fire,
					add,
					self = {
						// Add a callback or a collection of callbacks to the list
						add: function () {
							if (list) {
								// First, we save the current length
								var start = list.length;
								add(arguments);
								// Do we need to add the callbacks to the
								// current firing batch?
								if (firing) {
									firingLength = list.length;
								// With memory, if we're not firing then
								// we should call right away
								} else if (memory) {
									firingStart = start;
									fire(memory);
								}
							}
							return this;
						},
						// Remove a callback from the list
						remove: function () {
							if (list) {
								slice.call(arguments).forEach(function (arg) {
									var index = list.indexOf(arg);
									while (index > -1) {
										list.splice(index, 1);
										// Handle firing indexes
										if (firing) {
											if (index <= firingLength) {
												firingLength--;
											}
											if (index <= firingIndex) {
												firingIndex--;
											}
										}
										index = list.indexOf(arg, index);
									}
								});
							}
							return this;
						},
						// Check if a given callback is in the list.
						// If no argument is given, return whether or not list has callbacks attached.
						has: function (fn) {
							return fn ? !!list && list.indexOf(fn) > -1 : !!(list && list.length);
						},
						// Remove all callbacks from the list
						empty: function () {
							list = [];
							firingLength = 0;
							return this;
						},
						// Have the list do nothing anymore
						disable: function () {
							list = stack = memory = undefined;
							return this;
						},
						// Is it disabled?
						disabled: function () {
							return !list;
						},
						// Lock the list in its current state
						lock: function () {
							stack = undefined;
							if (!memory) {
								self.disable();
							}
							return this;
						},
						// Is it locked?
						locked: function () {
							return !stack;
						},
						// Call all callbacks with the given context and arguments
						fireWith: function (context, args) {
							if (list && (!fired || stack)) {
								args = args || [];
								args = [context, args.slice ? args.slice() : args];
								if (firing) {
									stack.push(args);
								} else {
									fire(args);
								}
							}
							return this;
						},
						// Call all the callbacks with the given arguments
						fire: function () {
							self.fireWith(this, arguments);
							return this;
						},
						// To know if the callbacks have already been called at least once
						fired: function () {
							return !!fired;
						}
					};
				add = function (args) {
					slice.call(args).forEach(function (arg) {
						var type = typeof arg;
						if (type === "function") {
							if (!options.unique || !self.has(arg)) {
								list.push(arg);
							}
						} else if (arg && arg.length && type !== "string") {
							// Inspect recursively
							add(arg);
						}
					});
				};
				// Fire callbacks
				fire = function (data) {
					memory = options.memory && data;
					fired = true;
					firingIndex = firingStart || 0;
					firingStart = 0;
					firingLength = list.length;
					firing = true;
					while (list && firingIndex < firingLength) {
						if (list[firingIndex].apply(data[0], data[1]) === false && options.stopOnFalse) {
							memory = false; // To prevent further calls using add
							break;
						}
						firingIndex++;
					}
					firing = false;
					if (list) {
						if (stack) {
							if (stack.length) {
								fire(stack.shift());
							}
						} else if (memory) {
							list = [];
						} else {
							self.disable();
						}
					}
				};

				return self;
			};

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.utils.callbacks;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));