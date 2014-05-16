module("main");

test ("ej" , function () {
	var id1, id2, id3;

	id1 = ej.getUniqueId();
	id2 = ej.getUniqueId();
	id3 = ej.getUniqueId();
	equal(typeof id1, 'string', 'Result of ej.getUniqueId() #1');
	equal(typeof id2, 'string', 'Result of ej.getUniqueId() #2');
	equal(typeof id3, 'string', 'Result of ej.getUniqueId() #3');
	notEqual(id1, id2, 'id1 != id2');
	notEqual(id1, id3, 'id1 != id3');
	notEqual(id3, id2, 'id3 != id2');

	equal(ej.set("test1", true), undefined, 'Method ej.set("test1", true)');
	equal(ej.set("test2", "val"), undefined, 'Method ej.set("test2", "val")');
	equal(ej.set("test3", {val: 0}), undefined, 'Method ej.set("test3", {val: 0})');
	equal(ej.get("test1"), true, 'Method ej.get("test1")');
	equal(ej.get("test2"), "val", 'Method ej.get("test2")');
	equal(ej.get("test3").val, 0, 'Method ej.get("test3")');
	equal(ej.get("test4"), undefined, 'Method ej.get("test4")');
	equal(ej.get("test4", "default"), "default", 'Method ej.get("test4", "default")');
});

(function(window){
	var orgConsole = window.console;
	window.console = {
		log: function (arg1, arg2, arg3) {
			ej.event.trigger(document.body, 'consolelog', arg1+' '+arg2+' '+arg3);
		},
		warn: function (arg1, arg2, arg3) {
			ej.event.trigger(document.body, 'consolewarn', arg1+' '+arg2+' '+arg3);
		},
		error: function (arg1, arg2, arg3) {
			ej.event.trigger(document.body, 'consoleerror', arg1+' '+arg2+' '+arg3);
		}
	}

	test('Console log tests', 2, function () {
		document.body.addEventListener('consolelog', function (data) {
			ok(true, 'Console log called');
		});
		equal(ej.log('test1', 'test2', 'test3'), undefined, 'Result of ej.log');
	});

	test('Console warn tests', 2, function () {
		document.body.addEventListener('consolewarn', function (data) {
			ok(true, 'Console warn called');
		});
		equal(ej.warn('test1', 'test2', 'test3'), undefined, 'Result of ej.warn');
	});

	test('Console error tests', 2, function () {
		document.body.addEventListener('consoleerror', function (data) {
			ok(true, 'Console error called');
			window.console = orgConsole;
		});
		equal(ej.error('test1', 'test2', 'test3'), undefined, 'Result of ej.error');
	});
}(window));