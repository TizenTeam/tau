/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * #Navigation
 *
 * In TV profile good navigation design is very important. User utilizes remote
 * for navigation and can move only to neighborhood's elements. Remote control
 * key are homogeneous with keyboard keys.
 *
 * All provided TV widgets are suited with proper navigation mechanism.
 *
 * ##Standard navigation
 *
 * Standard navigation utilizes directional keys for moving focus around and
 * OK (Enter on keyboard) for activating widget.
 *
 * Mechanism finds the closest focusable neighbor by checking element offset.
 * When new distinct element is found the current widget is blurred and the new
 * one is focused.
 *
 * ###Navigation inside page
 *
 * Standard page utilizes standard navigation settings.
 *
 * ###Navigation inside popup
 *
 * Popup works in two modes:
 *
 * ####Popup without controls
 *
 * Should popup have no focusable elements it is shown. It becomes blurred after
 * another key is pressed.
 *
 * ####Popup with selectable elements
 *
 * Should popup contain selectable elements keyboard support is enabled on
 * popup. Second action is disabling keyboard support on popup-invoking page.
 * A this point if autoFocus attribute is set on popup the first element in it
 * will be focused (otherwise it will be done with first user action).
 *
 * ##Defining own navigation
 *
 * One can define custom navigation for app or widget.
 * If You create new widget just omit the following part in constructor:
 *
 * 	@example
 * 	Slider = function () {
 *		//(...)
 * 		BaseKeyboardSupport.call(self); //omit this line
 * 		//(...)
 * 		}
 *
 * When using existing widgets you must first turn off the default
 * navigation code and handle it with your own code. The following
 * example shows turning of default navigation for using left/right
 * directions to adjust slider value.
 *
 * 	@example
 * 	function onKeyup(self, event) {
 * 		var status = self.status;
 * 		if (event.keyCode === KEY_CODES.enter) {
 * 			if (status) {
 * 				self._ui.container.focus();
 * 				self._pageWidget.enableKeyboardSupport();
 * 			} else {
 * 				self._ui.handle.focus();
 * 				showPopup(self);
 * 				self._pageWidget.disableKeyboardSupport();
 * 			}
 * 			self.status = !status;
 * 		}
 * 	}
 * 	function onKeydown(self, event) {
 * 		if (event.keyCode !== KEY_CODES.enter && !self.status) {
 * 			event.preventDefault();
 * 			event.stopPropagation();
 * 		}
 * 	}
 *
 * @page ns.page.designNavigation
 * @seeMore introduction.htm Design guide
 */