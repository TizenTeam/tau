/*global window */
/*jslint nomen: true */
(function (document) {
    "use strict";

    var sampleData = {
        "weather": "sunny",
        "temperature": 50,
        "temperatureUnit": "celsius",
        "city": "Warsaw",
        "time": Math.round((new Date()).getTime() / 1000)
    };

    function pad(number) {
        if (number < 10) {
            return '0' + number;
        }
        return '' + number;
    }

    function switchClass(element, value) {
        var iconPrefix = 'ui-weather-icon-',
            cls = element.classList,
            i = cls.length;

        // clear old
        while (--i >= 0) {
            if (cls.item(i).match(new RegExp(iconPrefix, 'i'))) {
                cls.remove(cls.item(i));
            }
        }

        cls.add(iconPrefix + value);
    }

    window.addEventListener("load", function () {
        var weatherIcon = document.getElementById('weatherIcon'),
            city = document.getElementById("weatherCity"),
            temp = document.getElementById("weatherTemp"),
            baseTime = new Date(sampleData.time * 1000),
            weatherDate = document.getElementById("weatherDate"),
            weatherTime = document.getElementById("weatherTime"),
            unit = sampleData.temperatureUnit === 'celsius' ? '&deg;' : 'F';

        switchClass(weatherIcon, sampleData.weather);
        city.innerHTML = sampleData.city;
        temp.innerHTML = sampleData.temperature + unit;

        weatherTime.innerHTML = pad(baseTime.getHours()) + ':' + pad(baseTime.getMinutes());
        weatherDate.innerHTML = baseTime.getFullYear() + '/' + pad((baseTime.getMonth() + 1)) + '/' + pad(baseTime.getDate());

    }, false);
}(window.document));
