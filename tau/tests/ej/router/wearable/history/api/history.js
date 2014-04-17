module("API", {
	});

	test ( "ns.router.wearable.history" , function () {
		var history = ej.router.wearable.history;
		equal(typeof ej, 'object', 'Class ej exists');
		equal(typeof ej.router, 'object', 'Class ej.router.micro exists');
		equal(typeof ej.router.wearable, 'object', 'Class ej.router.wearable exists');
		equal(typeof ej.router.wearable.history, 'object', 'Class ej.router.wearable.history exists');
		equal(typeof history.activeState, 'object', 'Class ej.router.wearable.history.activeState exists');
		equal(typeof history.replace, 'function', 'Class ej.router.wearable.history.replace exists');
		equal(typeof history.back, 'function', 'Class ej.router.wearable.history.back exists');
		equal(typeof history.setActive, 'function', 'Class ej.router.wearable.history.setActive exists');
		equal(typeof history.getDirection, 'function', 'Class ej.router.wearable.history.getDirection exists');
		equal(typeof history.enableVolatileRecord, 'function', 'Class ej.router.wearable.history.enableVolatileRecord exists');
		equal(typeof history.disableVolatileMode, 'function', 'Class ej.router.wearable.history.disableVolatileMode exists');
	});