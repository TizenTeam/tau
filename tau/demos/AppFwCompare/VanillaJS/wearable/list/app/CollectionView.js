/*global define */
/*jslint plusplus: true */
define(
	[
		"View",
		"RecordsModel"
	],
	function (View, RecordsModel) {
		"use strict";
		var CollectionView = function (options) {
				options = options || {};
				options.data = options.data || new RecordsModel();
				CollectionView.prototype.constructor.call(this, options);
			},
			proto = new View();

		proto.render = function () {
			var records = this.data.getRecords(),
				i = 0,
				l = 0,
				buffer = "";
			this.compileTemplate();
			if (this.templateCompiled) {
				for (i = 0, l = records.length; i < l; ++i) {
					buffer += this.templateCompiled(records[i]);
				}
			}

			return buffer;
		};

		CollectionView.prototype = proto;

		return CollectionView;
	}
);
