var range = ej.util.array.range;

module('ej.util.array');
test('Simple array creation', function() {
	var i,
		simple = range(3, 10);

	ok(Array.isArray(simple), 'Result is array');
	equal(simple.length, 8, 'Result array has length 8');

	for(i = 0; i < 8; i++){
		ok(simple[i] === 3 + i, '[' + i + '] value is ' + simple[i] + ', ok');
	}
});

test('Simple reverse array creation', function() {
	var i,
		simple = range(3, -4);

	ok(Array.isArray(simple), 'Result is array');
	equal(simple.length, 8, 'Result array has length 8');

	for(i = 0; i < 8; i++){
		ok(simple[i] === 3 - i , '[' + i + '] value is ' + simple[i] + ', ok');
	}
});

test('Simple array creation with step', function() {
	var i,
		simple = range(3, 15, 3);

	ok(Array.isArray(simple), 'Result is array');
	equal(simple.length, 5, 'Result array has length 5');

	for(i = 0; i < 5; i++){
		ok(simple[i] === 3 + (i * 3), '[' + i + '] value is ' + simple[i] + ', ok');
	}
});

function equalChar(result, i, properChar) {
	equal(result[i], properChar, '[' + i + '] value is \'' + result[i] + '\', ok');
}

test('Simple array creation - chars', function() {
	var i,
		simple = range('c', 'i');

	ok(Array.isArray(simple), 'Result is array');
	equal(simple.length, 7, 'Result array has length 7');

	equalChar(simple, 0, 'c');
	equalChar(simple, 1, 'd');
	equalChar(simple, 2, 'e');
	equalChar(simple, 3, 'f');
	equalChar(simple, 4, 'g');
	equalChar(simple, 5, 'h');
	equalChar(simple, 6, 'i');
});

test("ej.util.array - check function range", function () {
	var array = ej.util.array;

	equal(typeof array.range(1, 2, 1), "object", "function range returns Array value");
	equal(array.range(1, 2, 1)[1], 2, "function range returns value");
	equal(array.range(1, 8, 2)[1], 3, "function range returns value");
	equal(array.range(2, 2, 1)[0], 2, "function range returns value");
	equal(array.range(1, 2, 2)[1], undefined, "function range returns value");
	equal(array.range("a", 2, 1)[0], 0, "function range returns value");
});


test("ej.util.array - isLikeArray", function () {
	var array = ej.util.array,
		element = document.getElementById("test1"),
		elements = document.querySelectorAll(".test1 input");

	equal(array.isArrayLike(null), false, "function isLikeArray returns false for null");
	equal(array.isArrayLike(element), false, "function isLikeArray returns false for HTMLElement");
	equal(array.isArrayLike(elements), true, "function isLikeArray returns true for NodeList");
	equal(array.isArrayLike([2, 2, 1]), true, "function isLikeArray returns true for Array");
});