/*global window: false, console: false, $*/
(function (window, document) {
	'use strict';
	window.addEventListener('load', function () {
		var tau = window.tau,
			gallery3d = document.getElementById('gallery3d');

		// adding of listener on create event
		gallery3d.addEventListener('gallery3dcreate', function () {
			var i, j,
				widget = tau.engine.getBinding(gallery3d, 'Gallery3D');

			for (i = 0; i <= 2; i += 1) {
				for (j = 9; j > 0; j -= 1) {
					widget.add({src: '../test/0' + j + '.jpg'});
				}
			}
		});
		// create widget;
		tau.engine.instanceWidget(gallery3d, 'Gallery3D');

		// adding of listener on select image event
		gallery3d.addEventListener('select', function (e) {
			var path = e.detail.src,
				fileName = path.substring(path.lastIndexOf('/') + 1);
			document.getElementById('filename').innerHTML = fileName;
		});

	}, false);
}(window, window.document));
