(function (ns) {
	'use strict';
	test("ns.widget.datetimepicker - check the existence of objects/functions", function () {
		var datetimepicker;
		equal(typeof ns, "object", "ns exists");
		equal(typeof ns.widget, "object", "ns.widget exists");
		equal(typeof ns.widget.mobile, "object", "ns.widget.mobile exists");
		equal(typeof ns.widget.mobile.Datetimepicker, "function", "ns.widget.datetimepicker.mobile exists");

		datetimepicker = new ns.widget.mobile.Datetimepicker();
		equal(typeof datetimepicker._build, "function", "function _build");
		equal(typeof datetimepicker.build, "function", "function build");
		equal(typeof datetimepicker.configure, "function", "function configure");
		equal(typeof datetimepicker._getCreateOptions, "function", "function _getCreateOptions");
		equal(typeof datetimepicker.init, "function", "function init");
		equal(typeof datetimepicker.bindEvents, "function", "function bindEvents");
		equal(typeof datetimepicker.destroy, "function", "function destroy");
		equal(typeof datetimepicker.disable, "function", "function disable");
		equal(typeof datetimepicker.enable, "function", "function enable");
		equal(typeof datetimepicker.refresh, "function", "function refresh");
		equal(typeof datetimepicker.option, "function", "function option");
		equal(typeof datetimepicker.value, "function", "function value");

		equal(typeof datetimepicker._setDate, "function", "function _setDate");
		equal(typeof datetimepicker._getDate, "function", "function _getDate");
		equal(typeof datetimepicker._setFormat, "function", "function _setFormat");
		equal(typeof datetimepicker._setValue, "function", "function _setValue");
		equal(typeof datetimepicker._getValue, "function", "function _getValue");
	});
}(ej));