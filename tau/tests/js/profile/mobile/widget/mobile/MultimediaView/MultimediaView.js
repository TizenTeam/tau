/*global $: false, ej: false, document: false, window: false,
 module: false, test:false, equal: false*/
(function (ns) {
document.addEventListener('DOMContentLoaded', function () {
	'use strict';
	var MultimediaView = ns.widget.mobile.MultimediaView,
		multimediaView,
		videoElement,
		audioElement;

	module('ns.widget.MultimediaView for video element', {
		setup: function () {
			multimediaView = new MultimediaView();
			videoElement = document.getElementById('video-1');
		}
	});
	test('build', function () {
		multimediaView.build(videoElement);
		ok(multimediaView.element.classList.contains('ui-multimediaview'), 'multimediaView.build');
		equal(multimediaView.element.parentNode.querySelectorAll('.ui-multimediaview-control').length, 1, 'multimediaView has control panel');
	});

	test('engine.instanceWidget', function () {
		multimediaView = ns.engine.instanceWidget(videoElement, 'MultimediaView');
		ok(multimediaView.element.classList.contains('ui-multimediaview'), 'multimediaView was build');
		equal(multimediaView.element.parentNode.querySelectorAll('.ui-multimediaview-control').length, 1, 'multimediaView has control panel');
	});


	module('ns.widget.MultimediaView for audio element', {
		setup: function () {
			multimediaView = new MultimediaView();
			audioElement = document.getElementById('audio-1');
		}
	});
	test('build', function () {
		multimediaView.build(audioElement);
		ok(multimediaView.element.classList.contains('ui-multimediaview'), 'multimediaView.build');
		equal(multimediaView.element.parentNode.querySelectorAll('.ui-multimediaview-control').length, 1, 'multimediaView has control panel');
	});
});
}(ej));