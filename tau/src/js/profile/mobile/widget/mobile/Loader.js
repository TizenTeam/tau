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
 * @extends ns.widget.mobile.BaseWidget
 * @class ns.widget.mobile.Loader
 */

(function (window, ns) {
	'use strict';

//>>excludeStart('tauBuildExclude', pragmas.tauBuildExclude);


	define(
		[
			'../../../../core/engine',
			'../mobile',
			'../../../../core/utils/object',
			'./BaseWidgetMobile'
		],
		function () {
			//>>excludeEnd('tauBuildExclude');

			/**
			 * {Object} Widget Alias for {@link ns.widget.mobile.BaseWidget}
			 * @member ns.widget.mobile.Loader
			 * @private
			 */
			var BaseWidget = ns.widget.mobile.BaseWidgetMobile,
				/**
				 * @property {Object} engine Alias for class ns.engine
				 * @member ns.widget.mobile.Loader
				 * @private
				 */
				engine = ns.engine,
				object = ns.utils.object,
				/**
				 * Alias for class ns.widget.mobile.Loader
				 * @method Loader
				 * @member ns.widget.mobile.Loader
				 * @private
				 */
				Loader = function () {
					var self = this;
					self.action = '';
					self.label = null;
					self.defaultHtml = '';
					self.options = object.copy(Loader.prototype.options);
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
				},
				properties = {
					pageLoadErrorMessageTheme: 'e',
					pageLoadErrorMessage: 'Error Loading Page'
				},
				prototype = new BaseWidget();

			/**
			 * @property {Object} classes Dictionary for loader related css class names
			 * @member ns.widget.mobile.Loader
			 * @static
			 */
			Loader.classes = classes;

			/**
			 * @property {Object} properties Dictionary for loader related properties such as messages and themes
			 * @member ns.widget.mobile.Loader
			 * @static
			 */
			Loader.properties = properties;

			/**
			 * @property {Object} options Object with default options
			 * @property {string} [options.theme=a] the theme for the loading messages
			 * @property {string} [options.textVisible=false] whether the text in the loading message is shown
			 * @property {string} [options.html=''] custom html for the inner content of the loading messages
			 * @property {string} [options.text='loading'] the text to be displayed when the popup is shown
			 * @member ns.widget.mobile.Loader
			 * @instanceWidget
			 */
			prototype.options = {
				theme: 'a',
				textVisible: false,
				html: '',
				text: 'loading'
			};

			/**
			 * Build structure of loader widget
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.mobile.Loader
			 * @instance
			 */
			prototype._build = function (element) {
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
			 * @member ns.widget.mobile.Loader
			 * @instance
			 */
			prototype._init = function (element) {
				this.defaultHtml = element.innerHTML;
				return element;
			};

			/**
			 * Reset HTML
			 * @method resetHtml
			 * @member ns.widget.mobile.Loader
			 * @instance
			 */
			prototype.resetHtml = function (element) {
				element = element || this.element;
				element.innerHTML = this.defaultHtml;
			};

			/**
			 * Show loader
			 * @method Show
			 * @member ns.widget.mobile.Loader
			 * @instance
			 */
			prototype.show = function (theme, msgText, textonly) {
				var classes = Loader.classes,
					self = this,
					element = self.element,
					elementClassList = element.classList,
					body = document.body,
					copySettings = {},
					loadSettings = {},
					textVisible,
					message;

				self.resetHtml(element);

				if (theme !== undefined && theme.constructor === Object) {
					copySettings = object.copy(self.options);
					loadSettings = object.merge(copySettings, theme);
					// @todo remove $.mobile.loadingMessageTheme
					theme = loadSettings.theme || $.mobile.loadingMessageTheme;
				} else {
					loadSettings = self.options;
					// @todo remove $.mobile.loadingMessageTheme
					theme = theme || $.mobile.loadingMessageTheme || loadSettings.theme;
				}

				// @todo remove $.mobile.loadingMessage
				message = msgText || $.mobile.loadingMessage || loadSettings.text;
				document.documentElement.classList.add(classes.uiLoading);

				// @todo remove $.mobile.loadingMessage
				if ($.mobile.loadingMessage === false && !loadSettings.html) {
					element.getElementsByTagName('h1')[0].innerHTML = "";
				} else {
					// @todo remove $.mobile.loadingMessageTextVisible
					if ($.mobile.loadingMessageTextVisible !== undefined) {
						textVisible = $.mobile.loadingMessageTextVisible;
					} else {
						textVisible = loadSettings.textVisible;
					}

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
						element.getElementsByTagName('h1')[0].textContent = message;
					}
				}

			};

			/**
			 * Hide loader
			 * @method hide
			 * @member ns.widget.mobile.Loader
			 * @instance
			 */
			prototype.hide = function () {
				var classes = Loader.classes;
				document.documentElement.classList.remove(classes.uiLoading);
			};


			// definition
			Loader.prototype = prototype;
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
