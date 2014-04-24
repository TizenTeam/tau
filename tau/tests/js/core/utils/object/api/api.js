(function (ns) {
	'use strict';
	var data = ns.utils.object;

	test("ns.utils.object - check the existence of objects/functions", function () {
		equal(typeof ns, "object", "ns exists");
		equal(typeof ns.utils, "object", "ns.utils exists");
		equal(typeof ns.utils.object, "object", "ns.utils.data exists");
		equal(typeof data.copy, "function", "function copy");
		equal(typeof data.merge, "function", "function merge");
		equal(typeof data.fastMerge, "function", "function fastMerge");
	});
}(ej))