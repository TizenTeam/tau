/*global window, define */
/*jslint nomen: true */
/**
 * #Listdivider widget
 * Listdivider widget creates a list separator, which can be used for building grouping lists using {@link ns.widget.mobile.Listview Listview widget}.
 *
 * ##Default selectors
 * In all elements with _data-role=listdivider_.
 *
 * ##Manual constructor
 * For manual creation of listdivider widget you can use constructor of widget:
 *
 *	@example
 *	var listdivider = ns.engine.instanceWidget(document.getElementById('listdivider'), 'Listdivider');
 *
 * If jQuery library is loaded, its method can be used:
 *
 *	@example
 *	var listdivider = $('#listdivider').listdivider();
 *
 * ##HTML Examples
 *
 * ####Create divider
 *
 *	@example
 *	<ul data-role="listview">
 *		<li data-role="list-divider">Item styles</li>
 *		<li><a href="#">Normal lists</a></li>
 *		<li><a href="#">Normal lists</a></li>
 *		<li><a href="#">Normal lists</a></li>
 *		<li data-role="list-divider">Item styles</li>
 *		<li><a href="#">Normal lists</a></li>
 *		<li><a href="#">Normal lists</a></li>
 *		<li><a href="#">Normal lists</a></li>
 *		<li data-role="list-divider">Item styles</li>
 *		<li><a href="#">Normal lists</a></li>
 *		<li><a href="#">Normal lists</a></li>
 *		<li><a href="#">Normal lists</a></li>
 *	</ul>
 *
 * @class ns.widget.Listdivider
 * @extends ns.widget.BaseWidget
 */
(function (ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
			"../../../../core/utils/DOM/manipulation",
			"../mobile",
			"./BaseWidgetMobile",
			"./Button",
			"./Listview"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var BaseWidget = ns.widget.mobile.BaseWidgetMobile,
				engine = ns.engine,
				dom = ns.utils.DOM,
				Button = ns.widget.mobile.Button,
				Listdivider = function () {
					return this;
				};

			Listdivider.prototype = new BaseWidget();

			Listdivider.classes = {
				uiLiDivider: 'ui-li-divider'
			};

			/**
			* @property {Object} classes Dictionary for listdivider related css class names
			* @member ns.widget.Listdivider
			* @static
			*/
			Listdivider.classes = {
				uiBarThemePrefix: 'ui-bar-',
				uiLiDivider: 'ui-li-divider',
				uiDividerNormalLine: 'ui-divider-normal-line'
			};
			Listdivider.prototype._configure = function () {
				var options = this.options || {};
				/**
				* @property {Object} options Object with default options
				* @member ns.widget.Listdivider
				* @instance
				*/
				this.options = options;
				/**
				* theme of widget
				* @property {String} [options.theme='s']
				* @member ns.widget.Listdivider
				* @instance
				*/
				/** @expose */
				options.theme = 's';
				/**
				* @property {String} [options.style='normal']
				* @member ns.widget.Listdivider
				* @instance
				*/
				/** @expose */
				options.style = 'normal';
				/**
				* @property {String} [options.folded=false]
				* @member ns.widget.Listdivider
				* @instance
				*/
				/** @expose */
				options.folded = false;
				/**
				* @property {boolean} [options.list=true]
				* @member ns.widget.Listdivider
				* @instance
				*/
				/** @expose */
				options.list = true;
			};
			/**
			* Build widget
			* @method _build
			* @param {HTMLElement} element
			* @return {HTMLElement}
			* @member ns.widget.Listdivider
			*/
			Listdivider.prototype._build = function (element) {
				var options = this.options,
					classes = Listdivider.classes,
					classList = element.classList,
					buttonClasses = Button.classes;

				classList.add(classes.uiBarThemePrefix + options.theme);
				classList.add(classes.uiLiDivider);
				element.setAttribute('role', 'heading');
				element.setAttribute('tabindex', '0');
				//@todo check if ol tag and reset counter

				if (!options.style || options.style === "normal" || options.style === "check") {
					if (options.folded === false) {
						dom.wrapInHTML(
							element.childNodes,
							'<span class="' + buttonClasses.uiBtnText + '"></span>'
						);
					}/* else buttonMarkup on element */

					if (options.list === true) {
						if (options.folded === false) {
							element.insertAdjacentHTML(
								'beforeend',
								'<span class="' + classes.uiDividerNormalLine + '"></span>'
							);
						} /*else append to element.childrenBySelector('ui-btn-inner')*/
					}
				}
				return element;
			};

			// definition
			ns.widget.mobile.Listdivider = Listdivider;
			engine.defineWidget(
				"Listdivider",
				"[data-role='list-divider'], .ui-list-divider",
				[],
				Listdivider,
				'tizen'
			);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.Listdivider;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(ns));
