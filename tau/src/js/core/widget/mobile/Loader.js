/*global window, define */
/*jslint nomen: true, plusplus: true */

/**
 * #Loader widget
 *
 * ##Manual constructor
 * For manual creation of loader widget you can use constructor of widget:
 *
 *	@example
 *	var loader = ns.engine.instanceWidget(document.getElementById('ns-loader'), 'loader');
 *
 * If jQuery library is loaded, its method can be used:
 *
 *	@example
 *	var loader = $('#ns-loader').loader();
 *
 *	@example
 *	$.mobile.loading( 'show', {
 *		text: 'foo',
 *		textVisible: true,
 *		theme: 'z',
 *		html: ""
 *	});
 *
 *	@example
 *	$.mobile.loading('hide');
 *
 *
 * ##HTML Examples
 * ###Create simple loader pending from div using data-role:
 *
 *	@example
 *	<div data-role="loader"></div>
 *
 *
 * @extends ns.widget.BaseWidget
 * @class ns.widget.Loader
 */

(function (window, ns) {
	'use strict';

//>>excludeStart('tauBuildExclude', pragmas.tauBuildExclude);


	define(
		[
			'../../engine',
			'../mobile',
			'./BaseWidgetMobile'
		],
		function () {
			//>>excludeEnd('tauBuildExclude');

			/**
			 * {Object} Widget Alias for {@link ns.widget.BaseWidget}
			 * @member ns.widget.Loader
			 * @private
			 */
			var BaseWidget = ns.widget.mobile.BaseWidgetMobile,
				/**
				 * @property {Object} engine Alias for class ns.engine
				 * @member ns.widget.Loader
				 * @private
				 */
				engine = ns.engine,
				object = ns.utils.object,
				/**
				 * Alias for class ns.widget.Loader
				 * @method Loader
				 * @member ns.widget.Loader
				 * @private
				 */
				Loader = function () {
					var self = this;
					self.action = '';
					self.label = null;
					/**
					 * @property {Object} options Object with default options
					 * @member ns.widget.Loader
					 * @instance
					 */
					self.options = {
						/**
						 * the theme for the loading message
						 * @property {string} [options.theme=a]
						 * @member ns.widget.Loader
						 * @instance
						 */
						theme: 'a',

						/**
						 * whether the text in the loading message is shown
						 * @property {string} [options.textVisible=false]
						 * @member ns.widget.Loader
						 * @instance
						 */
						textVisible: false,

						/**
						 * custom html for the inner content of the loading message
						 * @property {string} [options.html='']
						 * @member ns.widget.Loader
						 * @instance
						 */
						html: '',

						/**
						 * the text to be displayed when the popup is shown
						 * @property {string} [options.text='loading']
						 * @member ns.widget.Loader
						 * @instance
						 */
						text: 'loading'
					};
					self.defaultHtml = '';
				},
				classes = {
					uiLoader: 'ui-loader',
					uiLoaderPrefix: 'ui-loader-',
					uiBodyPrefix: 'ui-body-',
					uiCorner: 'ui-corner-all',
					uiIcon: 'ui-icon',
					uiLoaderIcon: 'ui-icon-loading',
					uiLoading: 'ui-loading',
					uiTextOnly: 'ui-loader-textonly'
				};

			Loader.prototype = new BaseWidget();

			/**
			 * @property {Object} classes Dictionary for loader related css class names
			 * @member ns.widget.Loader
			 * @static
			 */
			Loader.classes = classes;

			/**
			 * Build structure of loader widget
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.Loader
			 * @instance
			 */
			Loader.prototype._build = function (element) {
				var options = this.options,
					loaderElementSpan = document.createElement('span'),
					loaderElementTile = document.createElement('h1'),
					elementClassList = element.classList,
					spanClassList = loaderElementSpan.classList;

				loaderElementTile.textContent = options.text;
				spanClassList.add(classes.uiIcon);
				spanClassList.add(classes.uiLoaderIcon);

				element.appendChild(loaderElementSpan);
				element.appendChild(loaderElementTile);
				elementClassList.add(classes.uiLoader);
				elementClassList.add(classes.uiCorner);
				elementClassList.add(classes.uiBodyPrefix + options.theme);
				elementClassList.add(classes.uiLoaderPrefix + 'default');

				this.defaultHtml = element.innerHTML;

				return element;
			};

			/**
			 * Init structure of loader widget
			 * @method _init
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.Loader
			 * @instance
			 */
			Loader.prototype._init = function (element) {
				this.defaultHtml = element.innerHTML;
				return element;
			};

			/**
			 * Reset HTML
			 * @method resetHtml
			 * @member ns.widget.Loader
			 * @instance
			 */
			Loader.prototype.resetHtml = function (element) {
				element = element || this.element;
				element.innerHTML = this.defaultHtml;
			};

			/**
			 * Show loader
			 * @method Show
			 * @member ns.widget.Loader
			 * @instance
			 */
			Loader.prototype.show = function (theme, msgText, textonly) {
				var classes = Loader.classes,
					self = this,
					element = self.element,
					elementClassList = element.classList,
					body = document.body,
					copySettings = {},
					loadSettings = {},
					textVisible,
					message;

				element.parentNode.removeChild(element);

				self.resetHtml(element);

				if (theme !== undefined && theme.constructor === Object) {
					copySettings = object.copy(self.options);
					loadSettings = object.merge(copySettings, theme);
					theme = loadSettings.theme;
				} else {
					loadSettings = self.options;
					theme = theme || loadSettings.theme;
				}

				message = msgText || loadSettings.text;

				document.documentElement.classList.add(classes.uiLoading);

				textVisible = loadSettings.textVisible;

				element.className = '';
				elementClassList.add(classes.uiLoader);
				elementClassList.add(classes.uiCorner);
				elementClassList.add(classes.uiBodyPrefix + theme);
				elementClassList.add(classes.uiLoaderPrefix + (textVisible || msgText || theme.text ? 'verbose' : 'default'));

				if ((loadSettings.textonly !== undefined && loadSettings.textonly) || textonly) {
					elementClassList.add(classes.uiTextOnly);
				}

				if (loadSettings.html) {
					element.innerHTML = loadSettings.html;
				} else {
					element.getElementsByTagName('h1')[0].innerText = message;
				}

				body.appendChild(element);

			};

			/**
			 * Hide loader
			 * @method hide
			 * @member ns.widget.Loader
			 * @instance
			 */
			Loader.prototype.hide = function () {
				var classes = Loader.classes;
				document.documentElement.classList.remove(classes.uiLoading);
			};


			// definition
			ns.widget.mobile.Loader = Loader;
			engine.defineWidget(
				'Loader',
				'[data-role="loader"], .ui-loader',
				[
					'show',
					'hide'
				],
				Loader,
				"mobile"
			);

//>>excludeStart('tauBuildExclude', pragmas.tauBuildExclude);
			return ns.widget.mobile.Loader;
		}
	);
	//>>excludeEnd('tauBuildExclude');
}(window.document, ns));
