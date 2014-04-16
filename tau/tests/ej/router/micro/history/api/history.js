module("API", {
	});

	test ( "ns.router.micro.history" , function () {
		var history = ej.router.micro.history;
		equal(typeof ej, 'object', 'Class ej exists');
		equal(typeof ej.router, 'object', 'Class ej.router.micro exists');
		equal(typeof ej.router.micro, 'object', 'Class ej.router.micro exists');
		equal(typeof ej.router.micro.history, 'object', 'Class ej.router.micro.history exists');
		equal(typeof history.activeState, 'object', 'Class ej.router.micro.history.activeState exists');
		equal(typeof history.replace, 'function', 'Class ej.router.micro.history.replace exists');
		equal(typeof history.back, 'function', 'Class ej.router.micro.history.back exists');
		equal(typeof history.setActive, 'function', 'Class ej.router.micro.history.setActive exists');
		equal(typeof history.getDirection, 'function', 'Class ej.router.micro.history.getDirection exists');
		equal(typeof history.enableVolatileRecord, 'function', 'Class ej.router.micro.history.enableVolatileRecord exists');
		equal(typeof history.disableVolatileMode, 'function', 'Class ej.router.micro.history.disableVolatileMode exists');
	});