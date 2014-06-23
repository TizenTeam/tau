module("api.ej.widget.SplitView", {
	});
	test ( "API ej.widget.SplitView" , function () {
		var widget;
		equal(typeof ej, 'object', 'Class ej exists');
		equal(typeof ej.widget, 'object', 'Class ej.widget exists');
		equal(typeof ej.widget.SplitView, 'function', 'Class ej.widget.SplitView exists');
		widget = new ej.widget.SplitView();

		equal(typeof widget.configure, 'function', 'Method SplitView.configure exists');
		equal(typeof widget.build, 'function', 'Method SplitView.build exists');
		equal(typeof widget.init, 'function', 'Method SplitView.init exists');
		equal(typeof widget.bindEvents, 'function', 'Method SplitView.bindEvents exists');
		equal(typeof widget.destroy, 'function', 'Method SplitView.destroy exists');
		equal(typeof widget.disable, 'function', 'Method SplitView.disable exists');
		equal(typeof widget.enable, 'function', 'Method SplitView.enable exists');
		equal(typeof widget.refresh, 'function', 'Method SplitView.refresh exists');
		equal(typeof widget.option, 'function', 'Method SplitView.option exists');

		equal(typeof widget._build, 'function', 'Method SplitView._build exists');
		equal(typeof widget._bindEvents, 'function', 'Method SplitView._bindEvents exists');
		equal(typeof widget._init, 'function', 'Method SplitView._init exists');
		equal(typeof widget._destroy, 'function', 'Method SplitView._destroy exists');

		equal(typeof widget._setRatio, 'function', 'Method SplitView._setRatio exists');
		equal(typeof widget._setDividerVertical, 'function', 'Method SplitView._setDividerVertical exists');
		equal(typeof widget._setFixed, 'function', 'Method SplitView._setFixed exists');

		equal(typeof widget.pane, 'function', 'Method SplitView.pane exists');
		equal(typeof widget.restore, 'function', 'Method SplitView.restore exists');
		equal(typeof widget.maximize, 'function', 'Method SplitView.maximize exists');
	});