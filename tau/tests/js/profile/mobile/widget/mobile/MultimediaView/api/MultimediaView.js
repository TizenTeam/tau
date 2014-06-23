/*global $: false, ej: false, document: false, window: false,
 module: false, test:false, equal: false*/
(function (ns) {
document.addEventListener('DOMContentLoaded', function () {
	'use strict';
	var MultimediaView = ns.widget.mobile.MultimediaView;

	module('ns.widget.MultimediaView create instance');
	test('instance', function () {
		var multimediaView = new MultimediaView();
		ok(typeof multimediaView, 'multimediaView is object');
		ok(multimediaView instanceof MultimediaView, 'multimediaView is instance of MultimediaView');

		equal(typeof multimediaView.width, 'function', 'method multimediaView.width exists');
		equal(typeof multimediaView.height, 'function', 'method multimediaView.height exists');
		equal(typeof multimediaView.fullScreen, 'function', 'method multimediaView.fullScreen exists');
		equal(typeof multimediaView.refresh, 'function', 'method multimediaView.refresh exists');
		/* protected methods*/
		equal(typeof multimediaView._build, 'function', 'protected method multimediaView._build exists');
		equal(typeof multimediaView._init, 'function', 'protected method multimediaView._init exists');
		equal(typeof multimediaView._configure, 'function', 'protected method multimediaView._configure exists');
		equal(typeof multimediaView._bindEvents, 'function', 'protected method multimediaView._bindEvents exists');
		equal(typeof multimediaView._destroy, 'function', 'protected method multimediaView._destroy exists');
		equal(typeof multimediaView._createControl, 'function', 'protected method multimediaView._createControl exists');
		/* options */
		equal(typeof multimediaView.options, 'object', 'propery multimediaView.options exists');
		equal(typeof multimediaView.options.controls, 'boolean', 'propery multimediaView.options.control exists');
		equal(multimediaView.options.controls, true, 'propery multimediaView.options.control default value is true');
		equal(typeof multimediaView.options.fullScreen, 'boolean', 'propery multimediaView.options.fullScreen exists');
		equal(multimediaView.options.fullScreen, false, 'propery multimediaView.options.fullScreen default value if false');
		equal(typeof multimediaView.options.theme, 'string', 'propery multimediaView.options.theme exists');
	});
});
}(ej))