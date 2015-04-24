/*global define */
define(
	[
		"Model"
	],
	function (Model) {
		"use strict";
		var RECORDS_DATA_KEY = "records",
			RecordsModel = function (options) {
				options = options || {};
				RecordsModel.prototype.constructor.call(this, options);
				this.setRecords(options.records || []);
			},
			proto = new Model();

		RecordsModel.prototype = proto;

		proto.setRecords = function (records) {
			this.setProp(RECORDS_DATA_KEY, records);
		};

		proto.getRecords = function () {
			return this.getProp(RECORDS_DATA_KEY);
		};

		return RecordsModel;
	}
);
