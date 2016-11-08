(function (window, document, ns) {
	var
		// tau engine alias
		engine = ns.engine,
		// object utility functions alias
		objectUtils = ns.util.object,
		// Gesture system alias
		Gesture = ns.event.gesture,
		// event utilities alias
		utilsEvents = ns.event,
		// Button alias
		Button = ns.widget.core.Button,
		min = Math.min,
		abs = Math.abs,
		/**
		 Swipe button widget
		 @class SwipeButton
		 @extends tau.widget.core.Button
		*/
		SwipeButton = function() {
			var self = this;

			// call the parent class
			Button.call(self);

			self._cancelled = false;
			self._dragging = false;
			self._animating = false;
		},
		/**
		 @type {Object} eventType
		*/
		eventType = {
			SWIPED: "swiped"
		},
		/**
		 @type {Object} classes css classes dictionary
		*/
		classes = {
			swipeButton: "ui-swipe-button",
			container: "ui-container",
			moveLeft: "ui-move-left",
			moveRight: "ui-move-right"
		},
		/**
		 @type {Object} defaults option dictionary
		*/
		defaults = {
			direction: "right",
			buttonWidth: 80,
			backgroundWidth: 200,
			swipeThreshold: 100

		},
		/**
		 @type {Object} selectors available selectors dictionary
		*/
		selectors = {
			buttonSwipe: "." + classes.swipeButton
		},
		styleIdPrefix = "#swipeButton-",
		ButtonPrototype = Button.prototype,
		prototype = new Button();

	SwipeButton.prototype = prototype;

	/**
	 Creates style element with given id
	 @param {string} id
	 @private
	 @static
	 @member SwipeButton
	*/
	function createStyleElement(id) {
		var style = null;

		// add element only if no other is already in dom with given id
		if (!document.head.querySelector(styleIdPrefix + id)) {
			style = document.createElement("style");
			style.id = "swipeButton-" + id;
			document.head.appendChild(style);
		}
	}

	/**
	 Add css rules to style element specified by given id
	 @param {string} id
	 @param {Object} rules dictionary
	 @private
	 @static
	 @member SwipeButton
	*/
	function addCSSRules(id, rules) {
		var sheet = document.head.querySelector(styleIdPrefix + id).sheet,
			length = rules.length,
			i = 0;

		for (; i < length; i++) {
			sheet.insertRule(rules[i], 0);
		}
	}

	/**
	 Remove style element
	 @param {string} id
	 @private
	 @static
	 @member SwipeButton
	*/
	function removeStyleElement(id) {
		var style = document.head.querySelector(styleIdPrefix + id);

		document.head.removeChild(style);
	}

	/**
	 Adds stylesheet for element
	 @param {HTMLElement} element
	 @protected
	 @member SwipeButton
	*/
	prototype._addStylesheet = function (element) {
		var id = element.id,
			options = this.options,
			buttonWidth = parseInt(options.buttonWidth, 10),
			totalWidth = parseInt(options.backgroundWidth, 10),
			descriptionWidth = totalWidth - buttonWidth;

		createStyleElement(id);
		addCSSRules(id, [
			"#" + id + " { width: " + buttonWidth + "px; }",
			"#" + id + "::before { width: " + buttonWidth + "px; }",
			"#" + id + ".active::before { width: " + totalWidth + "px; }",
			"#" + id + ":active::before { width: " + totalWidth + "px; }",
			"#" + id + " ." + classes.container + " { width: " + totalWidth + "px; }",
			"#" + id + " ." + classes.container + " > :nth-child(1) { width: " + buttonWidth + "px; }",
			"#" + id + " ." + classes.container + " > :nth-child(2) { width: " + descriptionWidth + "px; }"
		]);
	};

	/**
	 Removes stylesheet for SwipeButton
	 @protected
	 @member SwipeButton
	*/
	prototype._removeStylesheet = function () {
		removeStyleElement(this.element.id);
	};

	/**
	 Configure widget
	 @param {HTMLElement} element
	 @protected
	 @member SwipeButton
	*/
	prototype._configure = function(element) {
		var self = this;

		if (typeof ButtonPrototype._configure === "function") {
			ButtonPrototype._configure.call(self, element);
		}
		self.options = objectUtils.merge(self.options, defaults);
	};

	/**
	 Build widget
	 @param {HTMLElement} element
	 @protected
	 @member SwipeButton
	*/
	prototype._build = function(element) {
		var containerElement = document.createElement("div");

		if (typeof ButtonPrototype._build === "function") {
			ButtonPrototype._build.call(this, element);
		}

		// build container for elements inside button
		containerElement.classList.add(classes.container);
		// button can have only 2 elements
		// - the first element is visible all the time
		// - the second element is hidden at the beginning and it is shown during swiping
		// - the rest elements are not displayed
		containerElement.innerHTML = element.innerHTML;
		element.innerHTML = "";
		element.appendChild(containerElement);

		// set class defined direction of movement
		if (this.options.direction == "left") {
			element.classList.add(classes.moveLeft);
		} else {
			element.classList.add(classes.moveRight);
		}

		// add style for elements
		this._addStylesheet(element);

		return element;
	};

	/**
	 Adds events for widget
	 @protected
	 @member SwipeButton
	*/
	prototype._bindEvents = function () {
		var self = this,
			element = self.element;

		// enable gestures drag and swipe (horizontal)
		ns.event.enableGesture(
			element,
			new Gesture.Drag({
				blockVertical: true
			}),
			new Gesture.Swipe({
				orientation: Gesture.Orientation.HORIZONTAL
			})
		);

		utilsEvents.on(element, "drag dragstart dragend dragcancel swipe", self);
	};

	/**
	 Unbind widget events
	 @protected
	 @member SwipeButton
	*/
	prototype._unbindEvents = function () {
		var self = this,
			element = self.element;

		ns.event.disableGesture(element);

		utilsEvents.off(element, "drag dragstart dragend dragcancel swipe", self);
	};

	/**
	 Event handler for dragstart, drag, dragend, swipe, dragcancel and scroll events
	 @param {Event} event
	 @public
	 @member SwipeButton
	*/
	prototype.handleEvent = function (event) {
		switch (event.type) {
			case "dragstart":
				this._start(event);
				break;
			case "drag":
				this._move(event);
				break;
			case "dragend":
				this._end(event);
				break;
			case "swipe":
				this._swipe(event);
				break;
			case "dragcancel":
			case "scroll":
				this._cancel();
				break;
		}
	};

	/**
	 Handles start dragcancel
	 @param {Event} e
	 @protected
	 @member SwipeButton
	*/
	prototype._start = function (e) {
		var self = this;

		// setup state variables to defaults
		self._dragging = true;
		self._cancelled = false;

		// add active class to element when dragging starts
		self.element.classList.add("active");
	};

	/**
	 Handle drag move
	 @param {Event} e
	 @protected
	 @member SwipeButton
	*/
	prototype._move = function (e) {
		var self = this,
			options = self.options,
			gesture = e.detail,
			maxWidth = parseInt(options.backgroundWidth, 10) || 0,
			translateX = gesture.estimatedDeltaX,
			activeElementStyle = self.element.style,
			activeElementWidth = options.buttonWidth;

		// cancel the function if there is no drag currently occuring
		if (!self._dragging || self._cancelled) {
			return;
		}

		if (options.direction == "right") {
			if (translateX > 0) {
				activeElementStyle.width = min(activeElementWidth + translateX, maxWidth) + "px";
			}
		} else {
			// translateX is negative
			if (translateX < 0) {
				activeElementStyle.width = min(activeElementWidth - translateX, maxWidth) + "px";
			}
		}
	};

	/**
	 Handle drag end
	 @param {Event} e
	 @protected
	 @member SwipeButton
	*/
	prototype._end = function (e) {
		var self = this,
			element = self.element,
			options = self.options,
			gesture = e.detail;

		// cancel if there is no drag currently occuring
		if (!self._dragging || self._cancelled) {
			return;
		}

		element.classList.remove("active");
		element.style.width = options.buttonWidth + "px";

		self._dragging = false;

		// check if drag amount was bigger then assumed value
		if (abs(gesture.estimatedDeltaX) >= options.swipeThreshold) {
			// fire event
			utilsEvents.trigger(element, eventType.SWIPED, gesture);
		}
	};

	/**
	 Handle swipe event
	 @param {Event} e
	 @protected
	 @member SwipeButton
	*/
	prototype._swipe = function (e) {
		var self = this,
			element = self.element;

		// cancel if no draggin is currently occuring
		if (!self._dragging || self._cancelled) {
			return;
		}

		element.classList.remove("active");
		element.style.width = "";

		self._dragging = false;

		// fire event
		utilsEvents.trigger(element, eventType.SWIPED, e.detail);
	};

	/**
	 Cancel drag operation
	 @protected
	 @member SwipeButton
	*/
	prototype._cancel = function () {
		var self = this;
		self._dragging = false;
		self._cancelled = true;
	};

	/**
	 Manages destroy process of widget
	 @protected
	 @member SwipeButton
	*/
	prototype._destroy = function () {
		var self = this,
			element = self.element,
			containerElement = element.querySelector("." + classes.container);

		// remove structure of button
		element.innerHTML = containerElement.innerHTML;
		element.classList.remove(classes.moveLeft);
		element.classList.remove(classes.moveRight);

		// remove styles for elements
		self._removeStylesheet();
		self._unbindEvents();

		if (typeof ButtonPrototype._destroy === "function") {
			ButtonPrototype._destroy.call(self);
		}
	};

	ns.widget.wearable.SwipeButton = SwipeButton;

	engine.defineWidget(
		"SwipeButton",
		selectors.buttonSwipe,
		[],
		SwipeButton,
		"wearable"
	);

}(window, window.document, window.tau));
