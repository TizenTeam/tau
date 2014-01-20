/*
 *
 * Simple properties
 var properties = {
	'Body': {
	'Default Font': {
		lessVar: '@less-variable-name',
		widgets: [
			{type: 'text', default: 'normal'},
			{type: 'slider', default: '10px', min: '5px', max: '30px'},
			{type: 'text', default: 'Verdana'}
		]
	},

	}
}
 *
 *
 */

(function(window){
	var cssClasses = {
		themeEditor: 'themeEditor',
		categoryPanel: 'category-panel',
		labelName: 'label-name'
	};

	/**
	 * Constructor
	 * @returns {ThemeEditor}
	 */
	var ThemeEditor = function () {
		return this;
	};

	function createWidgetText(lessVariable, defaultValue) {
		return '<input type="text" data-default="' + defaultValue + '" data-lessvar="' + lessVariable + '" value="' + defaultValue + '" onchange="changeText(this);">';
	}

	function createWidgetColorPicker(lessVariable, defaultValue) {
		return '<input type="text" data-default="' + defaultValue + '" data-lessvar="' + lessVariable + '" value="' + defaultValue + '" onclick="changeColor(this);">';
	}

	function createWidgetSlider(lessVariable, defaultValue, rangeMin, rangeMax) {
		var sliderValue = parseInt(defaultValue, 10) * 100 / (rangeMax - rangeMin) - rangeMin;

		return '<input type="range" data-default="' + defaultValue + '" data-lessvar="' + lessVariable + '" min="0" max="100" value="' + sliderValue + '" data-min="' + rangeMin + '"  data-max="' + rangeMax + '" onclick="changeSlider(this);">';
	}

	function parseWidget(container, lessVar, widgetParams) {
		var widgetType = widgetParams.type.toLowerCase(),
			widgetDefault = widgetParams.default,
			widget;

		switch (widgetType) {
			case 'text':
				widget = createWidgetText(lessVar, widgetDefault);
				break;

			case 'slider':
				widget = createWidgetSlider(lessVar, widgetDefault, widgetParams.min, widgetParams.max);
				break;

			case 'color':
				widget = createWidgetColorPicker(lessVar, widgetDefault);
				break;

			default:
				widget = 'Unrecognized widget: ' + widgetType;
		}

		container.insertAdjacentHTML('beforeend', widget);
	}
	/**
	 * Add variable item to panel
	 * @param {type} container
	 * @param {type} labelTitle
	 * @param {type} widgets
	 */
	function addVariableItem(container, labelTitle, members) {
		var label = document.createElement('div'),
			widgetContainer = document.createElement('div'),
			classes = cssClasses,
			lessVar = members.lessVar,
			widgets = members.widgets,
			widgetParams;

		label.className = classes.labelName;
		label.innerHTML = labelTitle;
		for(widget in widgets) {
			parseWidget(widgetContainer, lessVar, widgets[widget]);
		}

		container.appendChild(label);
		container.appendChild(widgetContainer);
	}

	function addCategoryItem(panel, title, members) {
		var panelTitle = document.createElement('h3'),
			panelContent = document.createElement('div'),
			labelName;

		panelTitle.innerHTML = title;

		for(labelName in members) {
			addVariableItem(panelContent, labelName, members[labelName]);
		}

		panel.appendChild(panelTitle);
		panel.appendChild(panelContent);
	}

	ThemeEditor.prototype.buildLeftColumn = function () {
		var configProperties = this.configProperties,
			classes = cssClasses,
			categoryName,
			container = this.container,
			leftColumn = document.createDocumentFragment(),
			categoryPanel = document.createElement('div');

		categoryPanel.className = classes.categoryPanel;

		for(categoryName in configProperties) {
			addCategoryItem(categoryPanel, categoryName, configProperties[categoryName]);
		}

		leftColumn.appendChild(categoryPanel);



		// Finally add all pannels to container
		container.classList.add(classes.themeEditor);
		container.appendChild(leftColumn);

		//Enhance by UI Widgets
		$(categoryPanel).accordion();

	}


	ThemeEditor.prototype.init = function (configProperties) {
		this.configProperties = configProperties;
		this.container = document.getElementById('leftPanel');


		this.buildLeftColumn();
	}

	window.themeEditor = new ThemeEditor();
})(window);