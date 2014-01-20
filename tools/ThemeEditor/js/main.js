var modifiedVariables = {};


function changeColor (handler) {
	var lessVariableName = $(arguments[0]).attr('data-lessvar');
	$(handler).ColorPicker({
		onChange: function (hsb, hex, rgb) {
			var lessFrame = $('iframe').get(0).contentWindow.less;

			modifiedVariables[lessVariableName] = '#' + hex;
			$(handler).css('backgroundColor', '#' + hex);
			lessFrame.modifyVars(modifiedVariables);
		}
	})
}

function changeText (handler) {
	var lessVariableName = handler.getAttribute('data-lessvar'),
		lessFrame = $('iframe').get(0).contentWindow.less;

	modifiedVariables[lessVariableName] = handler.value;
	lessFrame.modifyVars(modifiedVariables);
}


function changeSlider (handler) {
	var lessVariableName = handler.getAttribute('data-lessvar'),
		rangeMin = handler.getAttribute('data-min'),
		rangeMax = handler.getAttribute('data-max'),
		value = parseInt(handler.value, 10),
		lessFrame = $('iframe').get(0).contentWindow.less;

	value = parseFloat(rangeMin) + parseFloat((rangeMax - rangeMin) * value / 100);
	modifiedVariables[lessVariableName] = value + 'px';
	lessFrame.modifyVars(modifiedVariables);
}



window.onload = function () {
	themeEditor.init(properties);
};
