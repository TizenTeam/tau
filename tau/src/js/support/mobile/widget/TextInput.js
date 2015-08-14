/*global window, define, ns */
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
/*jslint nomen: true, plusplus: true */
/**
 * # TextInput Extra
 *
 * This is support component for deprecated method in TextInput
 *
 * @class ns.widget.mobile.TextInputExtra
 * @extends ns.widget.mobile.TextInput
 */
(function (window, document, ns) {
    "use strict";
    //>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
    define(
        [
            "../../../core/engine",
            "../../../core/util/DOM",
            "../../../core/util/object",
            "../../../core/event",
            "../../../core/theme",
            "../../../profile/mobile/widget/mobile",
            "../../../profile/mobile/widget/mobile/BaseWidgetMobile",
            "../../../profile/mobile/widget/mobile/TextInput"
        ],
        function () {
            //>>excludeEnd("tauBuildExclude");
            var TextInputExtra = ns.widget.mobile.TextInput,

                /**
                 * Alias for class {@link ns.engine}
                 * @property {Object} engine
                 * @member ns.widget.mobile.TextInputExtra
                 * @private
                 * @static
                 */
                engine = ns.engine,
                themes = ns.theme,
                objectUtils = ns.util.object,
                /**
                 * Alias for class {@link ns.util.DOM}
                 * @property {Object} DOM
                 * @member ns.widget.mobile.TextInputExtra
                 * @private
                 * @static
                 */
                selector = ".ui-textinput",

                /**
                 * Backup of _build methods for replacing it
                 * @method parent_build
                 * @member ns.widget.mobile.TextInputExtra
                 * @private
                 */
                parent_build = TextInputExtra.prototype._build,

                /**
                 * Backup of _configure methods for replacing it
                 * @method parent_configure
                 * @member ns.widget.mobile.TextInputExtra
                 * @private
                 */
                parent_configure = TextInputExtra.prototype._configure;


            TextInputExtra.selector = selector;


            TextInputExtra.prototype._configure = function () {
                var self = this;

                if (typeof parent_configure === "function") {
                    parent_configure.call(this);
                }

                self.options = objectUtils.merge({}, TextInputExtra.defaults, {
                    clearSearchButtonText: "clear text",
                    disabled: false,
                    mini: null,
                    theme: "a"
                });
            };

            TextInputExtra.prototype._build = function (element) {
                var self = this,
                    themeClass,
                    options = self.options;

                options.theme = themes.getInheritedTheme(element) || options.theme;
                themeClass = "ui-body-" + options.theme;
                element.classList.add(themeClass);

                return parent_build.call(this, element);
            };

            /**
             * Finds label tag for element.
             * @method _findLabel
             * @return {HTMLElement} element
             * @member ns.widget.mobile.TextInputExtra
             * @return {HTMLElement}
             */
            TextInputExtra.prototype._findLabel = function (element) {
                return element.parentNode.querySelector("label[for='" + element.id + "']");
            };
            /**
             * Returns label value.
             * @method getLabel
             * @return {string} Label value or null
             * @member ns.widget.mobile.TextInputExtra
             */
            TextInputExtra.prototype.getLabel = function () {
                var label = this._findLabel(this.element);
                if (label !== null) {
                    return label.innerHTML;
                }
                return null;
            };

            /**
             * Sets label value.
             * @method setLabel
             * @param {string} Label text
             * @member ns.widget.mobile.TextInputExtra
             */
            TextInputExtra.prototype.setLabel = function (text) {
                var self = this,
                    element = self.element,
                    label;

                if (typeof text === "string") {
                    label = self._findLabel(element);
                    if (label === null) {
                        // create new label
                        label = document.createElement("label");
                        label.setAttribute("for", element.id);
                        // add to parent
                        element.parentElement.appendChild(label);
                    }
                    label.innerHTML = text;
                }
            };

            engine.defineWidget(
                "TextInput",
                "input[type='text']:not([data-role])" +
                ", input[type='number']:not([data-role])" +
                ", input[type='password']:not([data-role])" +
                ", input[type='email']:not([data-role])" +
                ", input[type='url']:not([data-role])" +
                ", input[type='tel']:not([data-role])" +
                ", input[type='month']:not([data-role])" +
                ", input[type='week']:not([data-role])" +
                ", input[type='datetime-local']:not([data-role])" +
                ", input[type='color']:not([data-role])" +
                ", textarea" +
                ", input:not([type]):not([data-role]):not(.ui-checkbox):not(.ui-tizenslider)" +
                ", " + selector,
                ["getLabel", "setLabel"],
                TextInputExtra,
                "mobile"
            );

            //>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
            return TextInputExtra;
        }
    );
    //>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));
