/*global window, define, ns*/
/*
 * Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/*jslint nomen: true, plusplus: true */

/**
 * #ActivityIndicator Widget
 * The ActivityIndicator widget shows that an operation is in progress.
 *
 * ## Default selectors
 * In default elements matches to :
 *
 *  - HTML elements with data-role equal "activity-indicator"
 *  - HTML elements with class ui-activity-indicator
 *
 * ###HTML Examples
 *
 * ####Create ActivityIndicator on DIV element
 *
 *		@example
 *		<div id="activity" data-role="activity-indicator"></div>
 *
 * ## Manual constructor
 * For manual creation of button widget you can use constructor of widget from
 * **tau** namespace:
 *
 *		@example
 *		<div id="activity"></div>
 *		<script>
 *			var activity = document.getElementById("activity"),
 *				activityWidget = tau.widget.ActivityIndicator(activity);
 *		</script>
 *
 * Constructor has one required parameter **element** which is base
 * **HTMLElement** to create widget. We recommend get this element by method
 * *document.getElementById*. Second parameter **options** and it is a object
 * with options for widget.
 *
 *
 * ##Options for widget
 *
 * Options for widget can be defined as _data-..._ attributes or supplied as
 * parameter in constructor.
 *
 * You can change option for widget using method **option**.
 *
 *
 * @extends ns.widget.BaseWidget
 * @class ns.widget.mobile.ActivityIndicator
 * @author Heeju Joo <heeju.joo@samsung.com>
 */

(function (document, ns) {
    "use strict";

//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);

    define(
        [
            "../../../../core/engine",
            "../../../../core/widget/BaseWidget",
            "../mobile"
        ],
        function () {
            //>>excludeEnd("tauBuildExclude");

            var BaseWidget = ns.widget.BaseWidget,
                engine = ns.engine,

                ActivityIndicator = function () {
                    var self = this;

                    self._customClassName = null;
                    self._ui = {
                        animationCircle1Element: null,
                        animationCircle2Element: null,
                        animationCircle3Element: null,
                        animationCircle1SVGElement: null,
                        animationCircle2SVGElement: null,
                        animationCircle3SVGElement: null,
                        animationCircle1SVGInnerElement: null,
                        animationCircle2SVGInnerElement: null,
                        animationCircle3SVGInnerElement: null
                    };
                },
                prototype = new BaseWidget(),

                CLASSES_PREFIX = "ui-activity-indicator",

                size = {
                    LARGE: "large",
                    MEDIUM: "medium",
                    SMALL: "small"
                },
                
                classes = {
                    uiActivityIndicator: CLASSES_PREFIX,
                    uiActivityIndicatorSmall: CLASSES_PREFIX + "-" + size.SMALL,
                    uiActivityIndicatorMedium: CLASSES_PREFIX + "-" + size.MEDIUM,
                    uiActivityIndicatorLarge: CLASSES_PREFIX + "-" + size.LARGE,
                    uiActivityIndicatorCircle1: CLASSES_PREFIX + "-circle1",
                    uiActivityIndicatorCircle2: CLASSES_PREFIX + "-circle2",
                    uiActivityIndicatorCircle3: CLASSES_PREFIX + "-circle3",
                    uiCircle1Svg: "ui-circle1-svg",
                    uiCircle2Svg: "ui-circle2-svg",
                    uiCircle3Svg: "ui-circle3-svg",
                    uiCircle1In: "ui-circle1-in",
                    uiCircle2In: "ui-circle2-in",
                    uiCircle3In: "ui-circle3-in"
                };

            ActivityIndicator.prototype = prototype;

            ActivityIndicator.classes = classes;

            /**
             * set widget class of size
             * @method resetActivityIndicatorClasses
             * @param {ns.widget.mobile.ActivityIndicator} self
             * @param {string} activityIndicatorSize
             * @private
             * @member ns.widget.mobile.ActivityIndicator
             */
            function resetActivityIndicatorClasses (self, activityIndicatorSize) {
                var element = self.element;

                element.className = "";
                if (self._customClassName) {
                    element.classList.add(self._customClassName);
                }

                if (!element.classList.contains(classes.uiActivityIndicator)) {
                    element.classList.add(classes.uiActivityIndicator);
                }

                switch (activityIndicatorSize) {
                    case size.SMALL:
                        element.classList.add(classes.uiActivityIndicatorSmall);
                        break;
                    case size.MEDIUM:
                        element.classList.add(classes.uiActivityIndicatorMedium);
                        break;
                    case size.LARGE:
                        element.classList.add(classes.uiActivityIndicatorLarge);
                        break;
                    default:
                        element.classList.add(classes.uiActivityIndicatorMedium);
                }
            }

            /**
             * set SVG Attribute for animated ActivityIndicator
             * @method setSVGInnerAttribute
             * @param {ns.widget.mobile.ActivityIndicator} self
             * @private
             * @member ns.widget.mobile.ActivityIndicator
             */
            function setSVGInnerAttribute (self) {
                var ui = self._ui;

                ui.animationCircle1SVGElement.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
                ui.animationCircle2SVGElement.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
                ui.animationCircle3SVGElement.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");

                ui.animationCircle1SVGElement.setAttribute("viewBox", "0 0 360 360");
                ui.animationCircle2SVGElement.setAttribute("viewBox", "0 0 360 360");
                ui.animationCircle3SVGElement.setAttribute("viewBox", "0 0 360 360");

                ui.animationCircle1SVGInnerElement.setAttribute("cx", "334");
                ui.animationCircle1SVGInnerElement.setAttribute("cy", "180");
                ui.animationCircle1SVGInnerElement.setAttribute("r", "15");

                ui.animationCircle2SVGInnerElement.setAttribute("cx", "180");
                ui.animationCircle2SVGInnerElement.setAttribute("cy", "180");
                ui.animationCircle2SVGInnerElement.setAttribute("r", "154.333");

                ui.animationCircle3SVGInnerElement.setAttribute("cx", "180");
                ui.animationCircle3SVGInnerElement.setAttribute("cy", "180");
                ui.animationCircle3SVGInnerElement.setAttribute("r", "154.333");
            }

            prototype._configure = function () {
                /**
                 * Object with default options
                 * @property {Object} options
                 * @property {"small"|"medium"|"large"} [options.size="medium"] The size
                 * for the circle style progress
                 * @member ns.widget.mobile.ActivityIndicator
                 */
                this.options = {
                    size: size.MEDIUM
                };
            };

            /**
             * Build widget
             * @method _build
             * @param {HTMLElement} element
             * @protected
             * @member ns.widget.mobile.ActivityIndicator
             */
            prototype._build = function (element) {
                var self = this,
                    ui = self._ui,
                    animationCircle1Element,
                    animationCircle2Element,
                    animationCircle3Element,
                    animationCircle1SVGElement,
                    animationCircle2SVGElement,
                    animationCircle3SVGElement,
                    animationCircle1SVGInnerElement,
                    animationCircle2SVGInnerElement,
                    animationCircle3SVGInnerElement;

                animationCircle1Element = document.createElement("div");
                animationCircle2Element = document.createElement("div");
                animationCircle3Element = document.createElement("div");
                animationCircle1Element.classList.add(classes.uiActivityIndicatorCircle1);
                animationCircle2Element.classList.add(classes.uiActivityIndicatorCircle2);
                animationCircle3Element.classList.add(classes.uiActivityIndicatorCircle3);

                /* Create SVG Element for animationCircle1 */
                animationCircle1SVGElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                animationCircle1SVGElement.setAttribute("class", classes.uiCircle1Svg);
                animationCircle1SVGInnerElement = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                animationCircle1SVGInnerElement.setAttribute("class", classes.uiCircle1In);
                animationCircle1SVGElement.appendChild(animationCircle1SVGInnerElement);

                /* Create SVG Element for animationCircle2 */
                animationCircle2SVGElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                animationCircle2SVGElement.setAttribute("class", classes.uiCircle2Svg);
                animationCircle2SVGInnerElement = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                animationCircle2SVGInnerElement.setAttribute("class", classes.uiCircle2In);
                animationCircle2SVGElement.appendChild(animationCircle2SVGInnerElement);

                /* Create SVG Element for animationCircle3 */
                animationCircle3SVGElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                animationCircle3SVGElement.setAttribute("class", classes.uiCircle3Svg);
                animationCircle3SVGInnerElement = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                animationCircle3SVGInnerElement.setAttribute("class", classes.uiCircle3In);
                animationCircle3SVGElement.appendChild(animationCircle3SVGInnerElement);


                animationCircle1Element.appendChild(animationCircle1SVGElement);
                animationCircle2Element.appendChild(animationCircle2SVGElement);
                animationCircle3Element.appendChild(animationCircle3SVGElement);

                element.appendChild(animationCircle1Element);
                element.appendChild(animationCircle2Element);
                element.appendChild(animationCircle3Element);

                ui.animationCircle1Element = animationCircle1Element;
                ui.animationCircle2Element = animationCircle2Element;
                ui.animationCircle3Element = animationCircle3Element;
                ui.animationCircle1SVGElement = animationCircle1SVGElement;
                ui.animationCircle2SVGElement = animationCircle2SVGElement;
                ui.animationCircle3SVGElement = animationCircle3SVGElement;
                ui.animationCircle1SVGInnerElement = animationCircle1SVGInnerElement;
                ui.animationCircle2SVGInnerElement = animationCircle2SVGInnerElement;
                ui.animationCircle3SVGInnerElement = animationCircle3SVGInnerElement;

                return element;
            };

            /**
             * Init widget
             * @method _init
             * @protected
             * @member ns.widget.mobile.ActivityIndicator
             */
            prototype._init = function () {
                var self = this,
                    activityIndicatorSize = self.options.size;
                    self._customClassName = self.element.className;

                setSVGInnerAttribute(self);
                resetActivityIndicatorClasses(self, activityIndicatorSize);
            };

            /**
             * Refresh progress
             * @method _refresh
             * @member ns.widget.mobile.ActivityIndicator
             * @protected
             */
            prototype._refresh = function () {
                var self = this,
                    activityIndicatorSize = self.options.size;

                resetActivityIndicatorClasses(self, activityIndicatorSize);
            };

            /**
             * Destroy progress
             * @method _destroy
             * @member ns.widget.mobile.ActivityIndicator
             * @protected
             */
            prototype._destroy = function () {
                var self = this,
                    element = self.element,
                    ui = self._ui;

                ui.animationCircle1SVGElement.removeChild(ui.animationCircle1SVGInnerElement);
                ui.animationCircle2SVGElement.removeChild(ui.animationCircle2SVGInnerElement);
                ui.animationCircle3SVGElement.removeChild(ui.animationCircle3SVGInnerElement);


                ui.animationCircle1Element.removeChild(ui.animationCircle1SVGElement);
                ui.animationCircle2Element.removeChild(ui.animationCircle2SVGElement);
                ui.animationCircle3Element.removeChild(ui.animationCircle3SVGElement);

                element.removeChild(ui.animationCircle1Element);
                element.removeChild(ui.animationCircle2Element);
                element.removeChild(ui.animationCircle3Element);

                ui = null;
                return null;
            };

            // definition
            ns.widget.mobile.ActivityIndicator = ActivityIndicator;
            engine.defineWidget(
                "ActivityIndicator",
                "[data-role='activity-indicator'], .ui-activity-indicator",
                [],
                ActivityIndicator,
                "mobile"
            );

//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
            return ns.widget.mobile.ActivityIndicator;
        }
    );
    //>>excludeEnd("tauBuildExclude");
}(window.document, ns));
