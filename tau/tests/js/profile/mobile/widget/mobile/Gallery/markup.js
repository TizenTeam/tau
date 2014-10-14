/*global window */
(function (document, ns) {
	'use strict';
	var slice = [].slice,
		GALLERY_CLASS = "ui-gallery",
		GALLERY_CONTAINER_CLASS = "ui-gallery-container",
		GALLERY_IMAGE_BACKGROUND = 'ui-gallery-bg';

	/**
	 * The widget of Gallery has async loading of image.
	 * - Init method detaches all images from container,
	 * - On event "pageshow" images are loaded and attached again.
	 */
	asyncTest( "Markup ns.widget.mobile.Gallery" , function () {
		var widget, image;

		tau.engine.run();

		function testFunction() {
			start();

			equal(
				typeof ns.widget.mobile.Gallery,
				'function',
				'Class ns.widget.mobile.Gallery exists'
			);

			widget = ns.engine.instanceWidget(
					document.getElementById("gallery"),
					"Gallery"
			);

			equal(
				widget.element,
				document.getElementById("gallery"),
				"Widget has element and it is the same instance from test markup"
			);

			equal(
				widget.element.classList.contains(GALLERY_CLASS),
				true,
				"Widget element has css class: " + GALLERY_CLASS
			);

			equal(
				widget.element
					.querySelectorAll("." + GALLERY_CONTAINER_CLASS).length,
				1,
				"Widget has one container element inside with css class: " +
						GALLERY_CONTAINER_CLASS
			);

			equal(
				slice.call(widget.element.children).filter(function (child){
					return child.classList.contains(GALLERY_CONTAINER_CLASS);
				}).length,
				1,
				"Container is directly child of widget's element"
			);

			equal(
				widget.element
					.querySelectorAll("." + GALLERY_CONTAINER_CLASS + " img")
					.length,
				1,
				"Widget container has one image (the test markup has one image)"
			);

			equal(
				widget.element
					.querySelectorAll("." + GALLERY_CONTAINER_CLASS + " > div > img")
					.length,
				1,
				"the image is wrapped by div element"
			);

			image = widget.element
				.querySelector("." + GALLERY_CONTAINER_CLASS + " > div > img");
			equal(
				image.parentElement.classList.contains(GALLERY_IMAGE_BACKGROUND),
				true,
				"the image's wrapper has css class: " + GALLERY_IMAGE_BACKGROUND
			);

			document.removeEventListener("pageshow", testFunction);
		}

		document.addEventListener("pageshow", testFunction);
	});
}(window.document, window.tau));
