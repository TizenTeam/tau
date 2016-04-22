/*global tau, Globalize */
(function() {
	var globalize = tau.util.globalize,
		selector,
		list,
		current_language,
		current_date,
		calendar_data,
		calendar_data_area;

	/**
	 * Inserts the calendar data elements
	 */
	function output(inp) {
		calendar_data.appendChild(calendar_data_area).innerHTML = inp;
	}

	/**
	 * Puts a class for syntax highlighting
	 */
	function syntaxHighlight(json) {
		json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
		/*jslint regexp: true*/
		return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
			/*jslint regexp: false*/
			var cls = 'number';
			if (/^"/.test(match)) {
				if (/:$/.test(match)) {
					cls = 'key';
				} else {
					cls = 'string';
				}
			} else if (/true|false/.test(match)) {
				cls = 'boolean';
			} else if (/null/.test(match)) {
				cls = 'null';
			}
			return '<span class="' + cls + '">' + match + '</span>';
		});
	}

	/**
	 * Updates the selected locale information to UI
	 */
	function updateLocaleToUI(selectedLocaleInstance){
		var number = selectedLocaleInstance.numberFormatter(),
			calendar_data = JSON.stringify(selectedLocaleInstance.getCalendar().months.format.wide, undefined, 4 ),
			currency_unit = null;
		list[0].innerText = selectedLocaleInstance.formatMessage("greeting/hello");
		list[1].innerText = selectedLocaleInstance.formatMessage("greeting/bye");
		list[2].innerText = selectedLocaleInstance.formatDate(new Date(),{ datetime:"medium"});
		list[3].innerText = number(123456.789);
		list[4].innerText = selectedLocaleInstance.formatMessage("longText");
		switch(selectedLocaleInstance.getLocale()){
			case "ko":
				currency_unit = "KRW";
				break;
			case "en":
				currency_unit = "USD";
				break;
			case "ar":
				currency_unit = "EGP";
				break;
			case "zh":
				currency_unit = "CNY";
				break;
		}
		list[5].innerText = Globalize.formatCurrency( 69900, currency_unit);

		current_language.innerHTML = selectedLocaleInstance.getLocale();
		output(syntaxHighlight(calendar_data));
	}

	/**
	 * Sets the locale information
	 */
	function setLocale(selected){
		var locale = selected.value;
		globalize.setLocale(locale)
			.done(updateLocaleToUI)
			.fail(function(){
				console.log("failed");
			});
	}

	/**
	 * Back key event handler
	 */
	window.addEventListener( 'tizenhwkey', function( ev ) {

		if( ev.keyName === "back" ) {
			var page = document.getElementsByClassName( 'ui-page-active' )[0],
				pageid = page ? page.id : "";
			if( pageid === "main" ) {
				try {
					tizen.application.getCurrentApplication().exit();
				} catch (ignore) {
				}
			} else {
				window.history.back();
			}
		}

	} );

	/**
	 * pageinit event handler
	 * Do preparatory works
	 */
	document.addEventListener('pageinit', function(){
		selector = document.querySelector( "#select-language" );
		list = document.querySelectorAll( "li.test" );
		current_language = document.querySelector( "#current_language" );
		current_date = document.querySelector( "#current_date" );
		calendar_data = document.querySelector( "#calendar_data" );
		calendar_data_area = document.createElement('pre');

	});

	/**
	 * pageshow event handler
	 * Do preparatory works and adds event listeners
	 */
	document.addEventListener('pageshow',function(){
		setLocale(selector);
		selector.addEventListener("change",function(){
			setLocale(selector);
		});
	});
}());