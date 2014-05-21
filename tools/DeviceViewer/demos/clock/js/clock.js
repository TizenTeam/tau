/*global window, console, setInterval, clearInterval */
/*jslint plusplus:true */
(function (window, document) {
	"use strict";

	function updateWidgets(widgets) {
		var now = new Date();
		widgets.forEach(function (widget) {
			widget.update(now);
		});
	}

	function clearWidgets(widgets) {
		var i = widgets.length;
		while (--i >= 0) {
			widgets[i].destroy();
			widgets.splice(i, 1);
		}
	}

	function pad(number) {
		return number < 10 ? '0' + number : number;
	}

	function timeFormat(time) {
		return pad(time.getHours()) + ':' + pad(time.getMinutes());
	}

	var initTime = new Date(),
		pwid = null,
		clocks = [];

	function Clock(element, initTime) {
		var hourElement = document.createElement('div'),
			minuteElement = document.createElement('div'),
			secondElement = document.createElement('div'),
			timeElement = document.createElement('span'),
			arrow = document.createElement('div');

		hourElement.setAttribute('class', 'hour');
		minuteElement.setAttribute('class', 'minute');
		secondElement.setAttribute('class', 'second');
		timeElement.setAttribute('class', 'time');

		hourElement.appendChild(arrow.cloneNode());
		minuteElement.appendChild(arrow.cloneNode());
		secondElement.appendChild(arrow);

		element.appendChild(hourElement);
		element.appendChild(minuteElement);
		element.appendChild(secondElement);
		element.appendChild(timeElement);

		this.dom = {
			hourElement: hourElement,
			minuteElement: minuteElement,
			secondElement: secondElement,
			timeElement: timeElement
		};

		this.update(initTime);
	}

	Clock.prototype.update = function (time) {
		var dom = this.dom,
			hour = time.getHours(),
			hourAngle = Math.ceil(hour % 12 / 12 * 360),
			minuteAngle = time.getMinutes() * 6,
			secondAngle = time.getSeconds() * 6;

		if (dom !== null) {
			dom.timeElement.textContent = timeFormat(time);
			dom.secondElement.setAttribute('style', '-webkit-transform: rotate(' + secondAngle + 'deg); transform: rotate(' + secondAngle + 'deg);');
			dom.minuteElement.setAttribute('style', '-webkit-transform: rotate(' + minuteAngle + 'deg); transform: rotate(' + minuteAngle + 'deg);');
			dom.hourElement.setAttribute('style', '-webkit-transform: rotate(' + hourAngle + 'deg); transform: rotate(' + hourAngle + 'deg);');
		}
	};

	Clock.prototype.destroy = function () {
		this.dom = null;
	};

	[].slice.call(document.querySelectorAll('.clock-widget')).forEach(function (element) {
		clocks.push(new Clock(element, initTime));
	});

	pwid = setInterval(updateWidgets.bind(null, clocks), 1000);
	window.addEventListener("unload", function () {
		clearInterval(pwid);
		clearWidgets(clocks);
	}, false);

}(window, window.document));
