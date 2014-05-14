/*global window, define */
/*jslint nomen: true, plusplus: true */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
			"../mobile", // fetch namespace
			"./BaseWidgetMobile",
			"./Popup",
			"./Button",
			"./Circularview",
			"../../../../core/events/vmouse",
			"../../../../core/utils/DOM/attributes",
			"../../../../core/utils/DOM/manipulation",
			"../../../../core/utils/array",
			"../../../../core/utils/events",
			"../../../../core/utils/globalize"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			/**
			 * DateTimePicker widget
			 * @class ns.widget.Datetimepicker
			 * @extends ns.widget.mobile.BaseWidgetMobile
			 */
			var Datetimepicker = function () {
					this.options = {
						type: null, // date, time, datetime applicable
						format: null,
						date: null
					};
				},
				BaseWidget = ns.widget.mobile.BaseWidgetMobile,
				engine = ns.engine,
				dom = ns.utils.DOM,
				globalize = ns.utils.globalize,
				events = ns.utils.events,
				range = ns.utils.array.range,
				daysInMonth = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ],
				parsePatternRegexp = /\/|\s|dd|d|MMMM|MMM|MM|M|yyyy|yy|y|hh|h|HH|H|mm|m|ss|s|tt|t|f|gg|g|'[\w\W]*'$|[\w\W]/g,
				fieldRegexp = /ui-datefield-([\w]*)/;

			Datetimepicker.prototype = new BaseWidget();

			Datetimepicker.classes = {
				uiBtnPicker: 'ui-btn-picker',
				uiDatefield: 'ui-datefield',
				uiDatefieldPrefix: 'ui-datefield-',
				uiDatefieldSelected: 'ui-datefield-selected',
				uiDatefieldPeriod: 'ui-datefield-period',
				uiLink: 'ui-link',
				uiDatetimepickerSelector: 'ui-datetimepicker-selector',
				uiDatetimepicker: 'ui-datetimepicker',
				uiInputText: 'ui-input-text',
				uiBodyPrefix: 'ui-body-',
				uiDivider1st: 'ui-divider-1st',
				uiDivider2nd: 'ui-divider-2nd',
				inClass: 'in',
				outClass: 'out',
				current: 'current'
			};

			function getCalendar() {
				return globalize.culture().calendars.standard;
			}

			function isLeapYear(year) {
				return year % 4 ? 0 : (year % 100 ? 1 : (year % 400 ? 0 : 1));
			}

			function makeTwoDigits(val) {
				var ret = val.toString(10);
				if (val < 10) {
					ret = "0" + ret;
				}
				return ret;
			}

			function createDateField(type, pat, container) {
				var span = document.createElement('span'),
					spanClassList = span.classList,
					classes = Datetimepicker.classes;
				if (type !== 'seperator' && type !== 'tab') {
					spanClassList.add(classes.uiBtnPicker);
					dom.setNSData(span, 'type', type);
				}
				spanClassList.add(classes.uiDatefieldPrefix + type);
				dom.setNSData(span, 'pat', pat);
				if (type !== 'seperator' && type !== 'tab') {
					dom.setNSData(span, 'role', "button");
					dom.setNSData(span, 'inline', "true");
					engine.instanceWidget(span, 'Button');
				}
				dom.appendNodes(container, span);
				return span;
			}

			function updateField(self, target, value) {
				var pat,
					hour,
					text,
					targetClassList,
					classes = Datetimepicker.classes;

				if (!target) {
					return;
				}

				if (value === 0) {
					value = "0";
				}

				pat = dom.getNSData(target, 'pat');
				targetClassList = target.classList;

				switch (pat) {
					case 'H':
					case 'HH':
					case 'h':
					case 'hh':
						hour = value;
						if (pat.charAt(0) === 'h') {
							if (hour > 12) {
								hour -= 12;
							} else if (hour === 0) {
								hour = 12;
							}
						}
						hour = makeTwoDigits(hour);
						text = hour;
						break;
					case 'm':
					case 'M':
					case 'd':
					case 's':
						text = value;
						break;
					case 'mm':
					case 'dd':
					case 'MM':
					case 'ss':
						text = makeTwoDigits(value);
						break;
					case 'MMM':
						text = getCalendar().months.namesAbbr[value - 1];
						break;
					case 'MMMM':
						text = getCalendar().months.names[value - 1];
						break;
					case 'yy':
						text = makeTwoDigits(value % 100);
						break;
					case 'yyyy':
						if (value < 10) {
							value = '000' + value;
						} else if (value < 100) {
							value = '00' + value;
						} else if (value < 1000) {
							value = '0' + value;
						}
						text = value;
						break;
					case 't':
					case 'tt':
						text = value;
						target = target.firstChild.firstChild;
						break;
				}

				// to avoid reflow where its value isn't out-dated
				if (target.innerText !== text) {
					if (targetClassList.contains(classes.uiDatefieldSelected)) {
						targetClassList.add(classes.outClass);
						self._new_value = text;
						/*
						* @todo animation
						target.animationComplete( function () {
						target.text( self._new_value);
						target.addClass("in")
						removeClass("out");

						target.animationComplete( function () {
						target.removeClass("in").
						removeClass("ui-datefield-selected");
						});
						});
						*/
						target.innerText = self._new_value;
						targetClassList.remove(classes.inClass);
						targetClassList.remove(classes.uiDatefieldSelected);
					} else {
						target.innerText = text;
					}
				}
			}

			Datetimepicker.prototype._setType = function (element, type) {
				var options = this.options;

				switch (type) {
					case 'datetime':
					case 'date':
					case 'time':
						options.type = type;
						break;
					default:
						options.type = 'datetime';
						break;
				}

				dom.setNSData(element, 'type', options.type);
				return this;
			};


			Datetimepicker.prototype._setDate = function (element, newdate) {
				var oldValue = this._getValue(),
					newValue,
					fields,
					type,
					val,
					field,
					i,
					fieldsLength;

				if (typeof newdate === "string") {
					newdate = new Date(newdate);
				}

				if (this._ui) {
					fields = this._ui.querySelectorAll('[data-type]');
					fieldsLength = fields.length;

					for (i = 0; i < fieldsLength; i++) {
						field = fields[i];
						type = dom.getNSData(field, 'type');
						if (!type) {
							type = "";
						}
						switch (type) {
							case 'hour':
								val = newdate.getHours();
								break;
							case 'min':
								val = newdate.getMinutes();
								break;
							case 'sec':
								val = newdate.getSeconds();
								break;
							case 'year':
								val = newdate.getFullYear();
								break;
							case 'month':
								val = newdate.getMonth() + 1;
								break;
							case 'day':
								val = newdate.getDate();
								break;
							case 'period':
								val = newdate.getHours() < 12 && getCalendar().AM ? getCalendar().AM[0] : getCalendar().PM[0];
								break;
							default:
								val = null;
								break;
						}
						if (val !== null) {
							updateField(this, field, val);
						}
					}
				}

				this.options.date = newdate;
				dom.setNSData(element, "date", newdate);

				newValue = this._getValue();

				events.trigger(element, 'change', {
					oldValue: oldValue,
					newValue: newValue
				});
				events.trigger(element, 'date-changed', newValue);
				return this;
			};

			Datetimepicker.prototype._getDate = function () {
				return new Date(this.options.date);
			};

			function switchAmPm(self, element) {
				var date,
					change;

				if (getCalendar().AM !== null) {
					date = new Date(self.options.date);
					change = 1000 * 60 * 60 * 12;

					if (date.getHours() > 11) {
						change = -change;
					}
					date.setTime(date.getTime() + change);
					self._setDate(element, date);
				}
			}

			function addButton(self, container, element, pat) {
				var button = document.createElement('a');

				dom.setNSData(button, 'role', 'button');
				dom.setNSData(button, 'pat', pat);
				dom.setNSData(button, 'type', 'period');
				button.innerText = 'period';
				button.classList.add(Datetimepicker.classes.uiDatefieldPeriod);

				engine.instanceWidget(button, 'Button', {
					inline: true
				});

				button.addEventListener('vclick', function () {
					switchAmPm(self, element);
				});
				dom.appendNodes(container, button);

				return button;
			}

			function parsePattern(pattern) {
				var matches = pattern.match(parsePatternRegexp),
					matchesLength = matches.length,
					i;
				for (i = 0; i < matchesLength; i++) {
					if (matches[i].charAt(0) === "'") {
						matches[i] = matches[i].substr(1, matches[i].length - 2);
					}
				}
				return matches;
			}

			function populateDataSelector(self, field, pat) {
				var date = new Date(self.options.date),
					values,
					numItems,
					current,
					data,
					yearlb,
					yearhb,
					day;

				switch (field) {
					case 'hour':
						if (pat === 'H' || pat === 'HH') {
							// twentyfour
							values = range(0, 23);
							data = range(0, 23);
							current = date.getHours();
						} else {
							values = range(1, 12);
							current = date.getHours() - 1;//11
							if (current >= 11) {
								current = current - 12;
								data = range(13, 23);
								data.push(12); // consider 12:00 am as 00:00
							} else {
								data = range(1, 11);
								data.push(0);
							}
							if (current < 0) {
								current = 11; // 12:00 or 00:00
							}
						}
						if (pat.length === 2) {
							// two digit
							values = values.map(makeTwoDigits);
						}
						numItems = values.length;
						break;
					case 'min':
					case 'sec':
						values = range(0, 59);
						if (pat.length === 2) {
							values = values.map(makeTwoDigits);
						}
						data = range(0, 59);
						current = (field === 'min' ? date.getMinutes() : date.getSeconds());
						numItems = values.length;
						break;
					case 'year':
						yearlb = 1900;
						yearhb = 2100;
						data = range(yearlb, yearhb);
						current = date.getFullYear() - yearlb;
						values = range(yearlb, yearhb);
						numItems = values.length;
						break;
					case 'month':
						switch (pat.length) {
							case 1:
								values = range(1, 12);
								break;
							case 2:
								values = range(1, 12).map(makeTwoDigits);
								break;
							case 3:
								values = getCalendar().months.namesAbbr.slice();
								break;
							case 4:
								values = getCalendar().months.names.slice();
								break;
						}
						if (values.length === 13) { // @TODO Lunar calendar support
							if (values[12] === "") { // to remove lunar calendar reserved space
								values.pop();
							}
						}
						data = range(1, values.length);
						current = date.getMonth();
						numItems = values.length;
						break;
					case 'day':
						day = daysInMonth[date.getMonth()];
						if (day === 28) {
							day += isLeapYear(date.getFullYear());
						}
						values = range(1, day);
						if (pat.length === 2) {
							values = values.map(makeTwoDigits);
						}
						data = range(1, day);
						current = date.getDate() - 1;
						numItems = day;
						break;
				}
				return {
					values: values,
					data: data,
					numItems: numItems,
					current: current
				};
			}

			function date_calibration(date) {
				date.setDate(1);
				date.setDate(date.getDate() - 1);
			}

			function updateHandler(self, field, val) {
				var date = new Date(self.options.date),
					month;

				switch (field[1]) {
					case 'min':
						date.setMinutes(val);
						break;
					case 'hour':
						date.setHours(val);
						break;
					case 'sec':
						date.setSeconds(val);
						break;
					case 'year':
						month = date.getMonth();
						date.setFullYear(val);
						if (date.getMonth() !== month) {
							date_calibration();
						}
						break;
					case 'month':
						date.setMonth(val - 1);
						if (date.getMonth() === val) {
							date_calibration();
						}
						break;
					case 'day':
						date.setDate(val);
						break;
				}
				self._setDate(self.element, date);
			}

			function liClickHandler(self, event) {
				var val,
					target = event.target,
					classes = Datetimepicker.classes;

				if (target.tagName === 'A') {
					target.parentNode.parentNode.querySelector('.' + classes.current).classList.remove(classes.current);
					target.parentNode.classList.add(classes.current);
					val = dom.getNSData(target, 'val');

					updateHandler(self, self._field, val);

					self._ctx.close();
				}
			}

			function closePopupHandler(self) {
				var ctxElement = self._ctx.element,
					targetClassList = self._target.classList,
					classes = Datetimepicker.classes;
				if (self._reflow) {
					window.removeEventListener("resize", self._reflow);
					self._reflow = null;
				}

				if (!(targetClassList.contains(classes.inClass) || targetClassList.contains(classes.outClass))) {
					targetClassList.remove(classes.uiDatefieldSelected);
				}

				ctxElement.removeEventListener('popupafterclose', self._closePopupHandler);
				self._circularview.element.removeEventListener('vclick', self.liClickHandler);
				self._ctx.destroy();
				ctxElement.parentNode.removeChild(ctxElement);
				self._popup_open = false;
			}

			function scrollEndHandler(self) {
				if (!self._reflow) {
					self._reflow = function () {
						self._circularview.reflow();
					};
					window.addEventListener("resize", self._reflow);
				}
			}

			/**
			 * @method showDataSelector
			 * @param self
			 * @param target
			 * @returns {ns.widget.Notification._ui|*|ns.widget.mobile.VirtualListview._ui|ns.widget.Popup._ui|Object|HTMLElement}
			 */
			function showDataSelector(self, target) {
				var className = target.className,
					field = className ? className.match(fieldRegexp) : null,
					pat,
					data,
					values,
					valuesData,
					current,
					datans,
					ul,
					div,
					li,
					a,
					i,
					ctx,
					circularview,
					valuesLength,
					divCircularview,
					divCircularviewContainer,
					ctxElement,
					classes = Datetimepicker.classes;

				if (!field) {
					return;
				}
				if (self._popup_open) {
					return;
				}

				self._target = target;
				self._field = field;
				target.classList.add(classes.uiDatefieldSelected);

				pat = dom.getNSData(target, 'pat');
				data = populateDataSelector(self, field[1], pat);

				if (!target.id) {
					target.id = self.elememberOfment.id + '-' + pat;
				}

				values = data.values;
				valuesLength = values.length;
				valuesData = data.data;
				current = data.current;

				if (values) {
					datans = "data-val";
					ul = document.createElement('ul');
					for (i = 0; i < valuesLength; i++) {
						li = document.createElement('li');
						if (i === current) {
							li.classList.add(classes.current);
						}
						a = document.createElement('a');
						a.classList.add(classes.uiLink);
						a.setAttribute(datans, valuesData[i]);
						a.innerText = values[i];
						li.appendChild(a);
						ul.appendChild(li);
					}

					div = document.createElement('div');
					div.classList.add(classes.uiDatetimepickerSelector);
					div.setAttribute('data-transition', 'fade');
					div.setAttribute('data-fade', 'false');
					div.setAttribute('data-role', 'popup');
					div.setAttribute('data-corners', 'false');
					divCircularview = document.createElement('div');
					divCircularview.appendChild(ul);

					self._ui.appendChild(div);

					ctx = engine.instanceWidget(div, 'Popup');
					self._ctx = ctx;
					divCircularviewContainer = document.createElement('div');
					div.appendChild(divCircularviewContainer);
					divCircularviewContainer.appendChild(divCircularview);
					divCircularviewContainer.style.overflow = 'hidden';
					// @TODO quich fix, change to proper width
					divCircularviewContainer.style.width = '360px';
					ctxElement = ctx.element;
					ctxElement.parentNode.classList.add(classes.uiDatetimepicker);
					divCircularview.setAttribute('data-list', ">li");
					divCircularview.setAttribute('data-role', "circularview");

					circularview = engine.instanceWidget(divCircularview, 'Circularview');
					self._circularview = circularview;
					if (!self._reflow) {
						self._reflow = function () {
							circularview.reflow();
							circularview.centerTo('.' + classes.current, 0);
						};
						window.addEventListener("resize", self._reflow);
					}
					ctx.open({
						link: target.id,
						popupwindow: true,
						tolerance: "10,0"
					});

					self.contextPopup = ctx;
					self._popup_open = true;

					self._closePopupHandler = closePopupHandler.bind(null, self);
					self._liClickHandler = liClickHandler.bind(null, self);
					self._scrollEndHandler = scrollEndHandler.bind(null, self);
					ctxElement.addEventListener('popupafterclose', self._closePopupHandler);
					divCircularview.addEventListener('vclick', self._liClickHandler, true);

					circularview.centerTo('.' + classes.current, 500);
					ctxElement.addEventListener('scrollend', self._scrollEndHandler);
				}
				return self._ui;
			}

			/**
			 *
			 * @param self
			 * @returns {boolean}
			 */
			function orientationHandler(self) {
				if (self._popup_open) {
					self._popup_open = false;
					self.contextPopup.close();
				}
				return false;
			}

			Datetimepicker.prototype._setFormat = function (element, format, create) {
				var options = this.options,
					token,
					div = document.createElement('div'),
					tabulatordiv,
					pat,
					span,
					classes = Datetimepicker.classes;
				if (format) {
					if (options.format === format) {
						return null;
					} else {
						options.format = format;
					}
				} else {
					if (!create) {
						return null;
					}
					format = options.format;
				}

				dom.removeAllChildren(this._ui);

				token = parsePattern(format);

				while (token.length > 0) {
					pat = token.shift();
					switch (pat) {
						case 'H': //0 1 2 3 ... 21 22 23
						case 'HH': //00 01 02 ... 21 22 23
						case 'h': //0 1 2 3 ... 11 12
						case 'hh': //00 01 02 ... 11 12
							span = createDateField('hour', pat, div);
							break;
						case 'mm': //00 01 ... 59
						case 'm': //0 1 2 ... 59
							if (options.type === 'date') {
								span = createDateField('month', pat, div);
							} else {
								span = createDateField('min', pat, div);
							}
							break;
						case 'ss':
						case 's':
							span = createDateField('sec', pat, div);
							break;
						case 'd': // day of month 5
						case 'dd': // day of month(leading zero) 05
							span = createDateField('day', pat, div);
							break;
						case 'M': // Month of year 9
						case 'MM': // Month of year(leading zero) 09
						case 'MMM':
						case 'MMMM':
							span = createDateField('month', pat, div);
							break;
						case 'yy':	// year two digit
						case 'yyyy': // year four digit
							span = createDateField('year', pat, div);
							break;
						case 't': //AM / PM indicator(first letter) A, P
						// add button
						case 'tt': //AM / PM indicator AM/PM
							// add button
							span = addButton(this, div, element, pat);
							break;
						case 'g':
						case 'gg':
							span = createDateField('era', pat, div);
							span.innerText = this._calendar().eras.name;
							break;
						case '\t':
							span = createDateField('tab', pat, div);
							tabulatordiv = document.createElement('div');
							tabulatordiv.classList.add(classes.uiDivider1st);
							tabulatordiv.innerHTML = '&nbsp;';
							span.appendChild(tabulatordiv);
							tabulatordiv = document.createElement('div');
							tabulatordiv.classList.add(classes.uiDivider2nd);
							tabulatordiv.innerHTML = '&nbsp;';
							span.appendChild(tabulatordiv);
							break;
						default: // string or any non-clickable object
							span = createDateField('seperator', pat, div);
							span.innerText = pat.replace(/[\-\/]/gi, '');
							break;
					}
				}

				dom.appendNodes(this._ui, div);
				if (options.date) {
					this._setDate(element, options.date);
				}

				element.setAttribute("data-format", options.format);
				return options.format;
			};

			/**
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @private
			 * @member ns.widget.Datetimepicker
			 */
			Datetimepicker.prototype._build = function (element) {
				var ui,
					elementClassList = element.classList,
					tagName = element.tagName.toLowerCase(),
					classes = Datetimepicker.classes;
				if (tagName === 'input') {
					element.style.display = 'none';
					/*
					 * @todo change to class object
					 */
					elementClassList.add(classes.uiInputText);
					elementClassList.add(classes.uiBodyPrefix + 's');
				}
				ui = document.createElement('div');
				ui.setAttribute('id', this.id + '-datetimepicker-ui');
				ui.classList.add(classes.uiDatefield);
				this._ui = ui;
				if (tagName === 'input') {
					dom.insertNodeAfter(element, ui);
				} else {
					element.appendNode(ui);
				}

				return element;
			};

			function datetimepicerClick(self, event) {
				showDataSelector(self, event.target);
				return false;
			}

			Datetimepicker.prototype._bindEvents = function () {
				this._orientationHandlerBound = orientationHandler.bind(null, this);
				this._datetimepicerClickBound = datetimepicerClick.bind(null, this);
				this._ui.addEventListener('vclick', this._datetimepicerClickBound, true);
				window.addEventListener('orientationchange', this._orientationHandlerBound, false);
			};

			/**
			 * @method _init
			 * @protected
			 * @member ns.widget.Datetimepicker
			 */
			Datetimepicker.prototype._init = function () {
				var options = this.options,
					element = this.element,
					value,
					tagName = element.tagName.toLowerCase(),
					classes = Datetimepicker.classes,
					type;
				if (!this._ui) {
					this._ui = document.getElementById(this.id + '-datetimepicker-ui');
				}
				if (!options.format) {
					switch (options.type) {
						case 'datetime':
							this._setFormat(getCalendar().patterns.d + "\t" + getCalendar().patterns.t);
							break;
						case 'date':
							this._setFormat(element, getCalendar().patterns.d);
							break;
						case 'time':
							this._setFormat(element, getCalendar().patterns.t);
							break;
					}
				}

				if (element && tagName === 'input') {
					value = element.getAttribute("value");
					if (value) {
						options.date = new Date(value);
					}
					type = element.getAttribute("type");
					this._setType(element, type);
					if (!options.format) {
						switch (type) {
							case 'datetime':
								this._setFormat(element, getCalendar().patterns.d + "\t" + getCalendar().patterns.t);
								break;
							case 'date':
								this._setFormat(element, getCalendar().patterns.d);
								break;
							case 'time':
								this._setFormat(element, getCalendar().patterns.t);
								break;
						}
					}
				}

				if (!options.date) {
					options.date = new Date();
				}
				this._setFormat(element, null, true);
				this._popup_open = false;
				this._popup_open = false;
			};

			Datetimepicker.prototype._destroy = function () {
				this._ui.removeEventListener('vclick', this._datetimepicerClickBound, true);
				window.removeEventListener('orientationchange', this._orientationHandlerBound, false);
			};

			Datetimepicker.prototype._setValue = function (value) {
				return this._setDate(this.element, value);
			};

			function timetoString(time) {
				return makeTwoDigits(time.getHours()) + ':' +
					makeTwoDigits(time.getMinutes()) + ':' +
					makeTwoDigits(time.getSeconds());
			}

			function dateToString(date) {
				return ((date.getFullYear() % 10000) + 10000).toString().substr(1) + '-' +
					makeTwoDigits(date.getMonth() + 1) + '-' +
					makeTwoDigits(date.getDate());
			}

			Datetimepicker.prototype._isLeapYear = function (year) {
				return isLeapYear(year);
			};

			Datetimepicker.prototype._switchAmPm = function () {
				return switchAmPm(this, this.element);
			};

			Datetimepicker.prototype._getValue = function () {
				var date = this._getDate(this.element),
					rvalue;
				switch (this.options.type) {
					case 'time':
						rvalue = timetoString(date);
						break;
					case 'date':
						rvalue = dateToString(date);
						break;
					default:
						rvalue = dateToString(date) + 'T' + timetoString(date);
						break;
				}
				return rvalue;
			};

			// definition
			ns.widget.mobile.Datetimepicker = Datetimepicker;
			engine.defineWidget(
				"Datetimepicker",
				"input[type='date'], input[type='datetime'], input[type='time'], [date-role='datetimepicker'], .ui-datetimepicker",
				[],
				Datetimepicker,
				'tizen'
			);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.Datetimepicker;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
