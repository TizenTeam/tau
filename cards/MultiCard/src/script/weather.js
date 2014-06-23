/*jslint browser: true, plusplus: true */
/*global Globalize */
(function (window, document) {
	'use strict';

	var elCity = document.getElementById('city'),
		elCondition = document.getElementById('condition'),
		elTemperature = document.getElementById('temperature'),
		elUnits = document.getElementById('temperatureUnits'),
		elDiffer = document.getElementById('differ'),
		elForecastViews = document.querySelectorAll('#forecast-view > *'),
		elForecastView = [],
		daynames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
		view,
		i,
		len;

	for (i = 0, len = elForecastViews.length; i < len; ++i) {
		view = elForecastViews[i];
		elForecastView[i] = {
			'dayname': view.querySelector('.date'),
			'short_dayname': view.querySelector('.short_date'),
			'high': view.querySelector('.high_temp'),
			'low': view.querySelector('.low_temp'),
			'humidity': view.querySelector('.humid')
		};
	}

	function pad(value) {
		if (value < 10) {
			return '0' + value;
		}
		return value;
	}

	window.addEventListener('tizenhwkey', function (e) {
		if (e.keyName === 'back') {
			window.close();
		}
	}, false);

	window.addEventListener('carddata', function (evt) {
		var data = evt.detail,
			current = data.current,
			view,
			currentDate = new Date(),
			forecastDate,
			dayForecast,
			i,
			len;

		elCity.innerHTML = data.city;
		elCondition.src = './images/conditions/' + current.condition + '.png';
		elCondition.alt = current.condition;
		elTemperature.innerHTML = current.temperature;
		elUnits.src = './images/' + current.temperatureUnits.toLowerCase() + '.png';
		console.log(data);
		if (data.current.differ) {
			elDiffer.innerHTML = data.current.differ;
		}

		for (i = 0, len = data.weather.length; i < len; ++i) {
			dayForecast = data.weather[i];
			if (elForecastView[i] !== undefined) {
				view = elForecastView[i];
				forecastDate = new Date(dayForecast.dateTime * 1000);
				/** @TODO "Today" should be translated! 
				 *
				if (forecastDate.getYear() === currentDate.getYear()
						&& forecastDate.getMonth() === currentDate.getMonth()
						&& forecastDate.getDate() === currentDate.getDate()) {
					view.dayname.innerHTML = 'Today';
				} else {
					view.dayname.innerHTML = daynames[forecastDate.getDay()];
				}
				**/
			    view.dayname.innerHTML = Globalize.format(forecastDate, 'dddd');
			    view.short_dayname.innerHTML = Globalize.format(forecastDate, 'ddd');
				view.high.innerHTML = dayForecast.high + '&deg;';
				view.low.innerHTML = dayForecast.low + '&deg;';
				view.humidity.innerHTML = dayForecast.humidity + '%';
			}
		}
	}, false);
}(window, window.document));
