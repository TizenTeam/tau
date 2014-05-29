var easing = ej.util.easing;

test("ej.util.easing - check the existence of objects/functions", function () {
	equal(typeof ej, "object", "ej exists");
	equal(typeof ej.util, "object", "ej.util exists");
	equal(typeof ej.util.easing, "object", "ej.util.easing exists");
	equal(typeof easing.cubicOut, "function", "function cubicOut");
});

test("ej.util.easing - check function cubicOut", function () {
	equal(typeof easing.cubicOut(1, 1, 1, 1), "number", "function cubicOut returns number value");
	equal(easing.cubicOut(1, 1, 1, 1), 2, "function cubicOut returns value");
	equal(easing.cubicOut(2, 1, 1, 1), 3, "function cubicOut returns value");
	equal(easing.cubicOut(3, 1, 1, 1), 10, "function cubicOut returns value");
});