test ("API of Radio Widget", function() {
	var widget;

	equal(typeof tau, "object", "Class tau exists");
	equal(typeof tau.widget, "object", "Class tau.widget exists");
	equal(typeof tau.widget.core, "object", "Class tau.widget exists");
	equal(typeof tau.widget.core.Radio, "function", "Class tau.widget.core.Radio exists");

	widget = new tau.widget.core.Radio(document.getElementById("radio-choice-1"));

	equal(typeof widget._build, 'function', 'Method Radio._build exists');
	equal(typeof widget._getValue, 'function', 'Method Radio.getValue exists');
	equal(typeof widget._setValue, 'function', 'Method Radio._setValue exists');
});
