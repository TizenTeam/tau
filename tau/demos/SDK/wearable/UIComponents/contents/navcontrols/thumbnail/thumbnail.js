/*global tau */
(function(){
	var page = document.getElementById("sectionChangerPage"),
		elSectionChanger = document.getElementById("sectionChanger"),
		sectionLength = document.querySelectorAll("section").length,
		elPageIndicator = document.getElementById("pageIndicator"),
		sectionChanger,
		pageIndicator,
		pageIndicatorHandler,
		rotaryDetentHandler;

	/**
	 * sectionchange event handler
	 */
	pageIndicatorHandler = function (e) {
		pageIndicator.setActive(e.detail.active);
	};

	/**
	 * rotarydetent event handler
	 */
	rotaryDetentHandler = function(e) {
		var activeIndex = sectionChanger.getActiveSectionIndex(),
			direction = e.detail.direction;

		if (direction === "CW" && activeIndex < 2) {
			sectionChanger.setActiveSection(++activeIndex, 250);
			// CW direction
		} else if (direction === "CCW" && activeIndex > 0) {
			// CCW direction
			sectionChanger.setActiveSection(--activeIndex, 250);
		}
	};

	/**
	 * pagebeforeshow event handler
	 * Do preparatory works and adds event listeners
	 */
	page.addEventListener( "pagebeforeshow", function() {
		pageIndicator =  new tau.widget.PageIndicator(elPageIndicator, {
			numberOfPages: sectionLength,
			layout: "circular"
		});
		pageIndicator.setActive(0);
		sectionChanger = new tau.widget.SectionChanger(elSectionChanger, {
			orientation: "horizontal",
			fillContent: false
		});
		// Add rotarydetent handler to document
		document.addEventListener("rotarydetent", rotaryDetentHandler);
	});

	/**
	 * pagehide event handler
	 * Destroys and removes event listeners
	 */
	page.addEventListener( "pagehide", function() {
		// Remove rotarydetent handler to document
		document.removeEventListener("rotarydetent", rotaryDetentHandler);
		// release object
		sectionChanger.destroy();
		pageIndicator.destroy();
	});

	elSectionChanger.addEventListener("sectionchange", pageIndicatorHandler, false);
}());