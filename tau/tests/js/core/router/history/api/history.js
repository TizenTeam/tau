module("API", {
	});

	test ( "ns.router.history" , function () {
		var history = ej.router.history;
		equal(typeof ej, 'object', 'Class ej exists');
		equal(typeof ej.router, 'object', 'Class ej.router exists');
		equal(typeof ej.router, 'object', 'Class ej.router exists');
		equal(typeof ej.router.history, 'object', 'Class ej.router.history exists');
		equal(typeof history.activeState, 'object', 'Class ej.router.history.activeState exists');
		equal(typeof history.replace, 'function', 'Class ej.router.history.replace exists');
		equal(typeof history.back, 'function', 'Class ej.router.history.back exists');
		equal(typeof history.setActive, 'function', 'Class ej.router.history.setActive exists');
		equal(typeof history.getDirection, 'function', 'Class ej.router.history.getDirection exists');
		equal(typeof history.enableVolatileRecord, 'function', 'Class ej.router.history.enableVolatileRecord exists');
		equal(typeof history.disableVolatileMode, 'function', 'Class ej.router.history.disableVolatileMode exists');
	});