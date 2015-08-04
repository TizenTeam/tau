/*global tau, test, equal, notEqual, ok*/
module("core/core");

test ("tau" , function () {
	var id1, id2, id3;

	id1 = tau.getUniqueId();
	id2 = tau.getUniqueId();
	id3 = tau.getUniqueId();
	equal(typeof id1, "string", "Result of tau.getUniqueId() #1");
	equal(typeof id2, "string", "Result of tau.getUniqueId() #2");
	equal(typeof id3, "string", "Result of tau.getUniqueId() #3");
	notEqual(id1, id2, "id1 != id2");
	notEqual(id1, id3, "id1 != id3");
	notEqual(id3, id2, "id3 != id2");

	equal(tau.set("test1", true), undefined, "Method tau.set('test1', true)");
	equal(tau.set("test2", "val"), undefined, "Method tau.set('test2', 'val')");
	equal(tau.set("test3", {val: 0}), undefined, "Method tau.set('test3', {val: 0})");
	equal(tau.get("test1"), true, "Method tau.get('test1')");
	equal(tau.get("test2"), "val", "Method tau.get('test2')");
	equal(tau.get("test3").val, 0, "Method tau.get('test3')");
	equal(tau.get("test4"), undefined, "Method tau.get('test4')");
	equal(tau.get("test4", "default"), "default", "Method tau.get('test4', 'default')");
});

(function(window){
	var orgConsole = window.console;
	window.console = {
		log: function (arg1, arg2, arg3) {
			tau.event.trigger(document.body, "consolelog", arg1 + " " + arg2 + " " + arg3);
		},
		warn: function (arg1, arg2, arg3) {
			tau.event.trigger(document.body, "consolewarn", arg1 + " " + arg2 + " " + arg3);
		},
		error: function (arg1, arg2, arg3) {
			tau.event.trigger(document.body, "consoleerror", arg1 + " " + arg2 + " " + arg3);
		}
	};

	test("Console log tests", 2, function () {
		document.body.addEventListener("consolelog", function () {
			ok(true, "Console log called");
		});
		equal(tau.log("test1", "test2", "test3"), undefined, "Result of tau.log");
	});

	test("Console warn tests", 2, function () {
		document.body.addEventListener("consolewarn", function () {
			ok(true, "Console warn called");
		});
		equal(tau.warn("test1", "test2", "test3"), undefined, "Result of tau.warn");
	});

	test("Console error tests", 2, function () {
		document.body.addEventListener("consoleerror", function () {
			ok(true, "Console error called");
			window.console = orgConsole;
		});
		equal(tau.error("test1", "test2", "test3"), undefined, "Result of tau.error");
	});
}(window));