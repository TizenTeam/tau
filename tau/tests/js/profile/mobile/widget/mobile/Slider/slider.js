module('Slider', {
	teardown: function () {
		ej.engine._clearBindings();
	}
});
test('Default slider', function () {
	var slider = document.getElementById('mySlider1');
	tau.widget.Slider(slider);

	equal(slider.getAttribute('data-tau-bound'), "Slider", "Slider widget is created");
	ok(slider.classList.contains('ui-slider-input'), 'Slider has ui-slider-input class');
	ok(slider.parentElement.parentElement.querySelector("div[role='application']").classList.contains('ui-slider'), 'Slider has uislider class and container for div was built successfully');
});
test('highlight slider', function () {
	var slider = document.getElementById('mySlider10');
	tau.widget.Slider(slider);

	equal(slider.getAttribute('data-tau-bound'), "Slider", "Slider widget is created");
	ok(slider.classList.contains('ui-slider-input'), 'Slider has ui-slider-input class');
	ok(slider.parentElement.parentElement.querySelector("div[role='application']").classList.contains('ui-slider'), 'Slider has uislider class and container for div was built successfully');
});
test('Select slider', function () {
	var slider = document.getElementById('mySlider11');
	tau.widget.Slider(slider);

	equal(slider.getAttribute('data-tau-bound'), "Slider", "Slider widget is created");
	ok(slider.classList.contains('ui-slider-switch'), 'Slider has ui-slider-switch class');
	ok(slider.parentElement.parentElement.querySelector("div[role='application']").classList.contains('ui-slider'), 'Slider has uislider class and container for div was built successfully');
});
test('Select slider', function () {
	var slider = document.getElementById('mySlider12');
	tau.widget.Slider(slider);

	equal(slider.getAttribute('data-tau-bound'), "Slider", "Slider widget is created");
	ok(slider.classList.contains('ui-slider-switch'), 'Slider has ui-slider-switch class');
	ok(slider.parentElement.parentElement.querySelector("div[role='application']").classList.contains('ui-slider'), 'Slider has uislider class and container for div was built successfully');

});
test('Vertical slider', function () {
	var slider = document.getElementById('mySlider13');
	tau.widget.Slider(slider);

	equal(slider.getAttribute('data-tau-bound'), "Slider", "Slider widget is created");
	ok(slider.classList.contains('ui-slider-input'), 'Slider has ui-slider-input class');
	ok(slider.parentElement.parentElement.querySelector("div[role='application']").classList.contains('ui-slider'), 'Slider has uislider class and container for div was built successfully');
});

asyncTest('slider events', 1, function () {
	var slider = document.getElementById('mySlider10'),
		handle;
	tau.widget.Slider(slider);

	handle = slider.parentElement.parentElement.querySelector('.ui-slider-handle');
	document.addEventListener('change', function() {
		ok(1);
		start();
	});

	ej.event.trigger(handle, 'vmousedown');
	ej.event.trigger(handle, 'vmouseup');
});