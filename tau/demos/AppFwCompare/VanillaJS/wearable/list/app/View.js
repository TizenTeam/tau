/*global define */
define(
	[
		"bower/handlebars/handlebars",
		"DOM",
		"Model"
	],
	function (Handlebars, DOM, Model) {
		"use strict";
		var View = function (options) {
				options = options || {};
				this.data = options.data && options.data instanceof Model ? options.data : new Model(options.data || {});
				this.template = options.template || "";
				this.templateCompiled = null;
			},
			proto = View.prototype;

		proto.compileTemplate = function () {
			var templateNode = null;
			if (!this.templateCompiled && this.template.length > 0) {
				templateNode = DOM.getElementById(this.template);
				if (templateNode) {
					this.templateCompiled = Handlebars.compile(templateNode.innerHTML);
				}
			}
		};

		proto.render = function () {
			var buffer = "";
			this.compileTemplate();
			if (this.templateCompiled) { // double check
				buffer = this.templateCompiled(this.data.getData());
			}

			return buffer;
		};

		return View;
	}
);
