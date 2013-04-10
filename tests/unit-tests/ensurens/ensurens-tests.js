/*
 * Unit Test: EnsureNS
 *
 * Krzysztof Antoszek <k.antoszek@samsung.com>
 */


$(document).ready(function () {
	module("ensureNS");
	test("ensureNS test", function () {
		var obj = {
				"prop1": true,
				"prop2": 1
			};

		// # TEST 1
		equal(!!(window.ensure && window.ensure.tests && window.ensure.tests.leaf1), false);

		ensureNS('window.ensure.tests.leaf1');

		// # TEST 2
		equal(!!(window.ensure && window.ensure.tests && window.ensure.tests.leaf1), true);

		window.ensure.tests.leaf1 = obj;

		ensureNS('window.ensure.tests.leaf1.leaf2');

		// # TEST 3
		equal(typeof window.ensure.tests.leaf1.leaf2, "object");

		// # TEST 4
		deepEqual(window.ensure.tests.leaf1, obj);
	});
});