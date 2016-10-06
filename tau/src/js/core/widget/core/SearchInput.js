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
 * # SearchInput Widget
 * The search input widget is used to search for list content.
 * This widget can be placed in the page content.
 *
 * ## Default selectors
 *
 *  Default selector for search widget is "input" element with type="search"
 *
 * ###HTML Examples
 *
 * ####Create simple search input in header
 *
 *		@example
 *		<div data-role="page" id="search-input-page">
 *			<div data-role="header">
 *			</div>
 *			<div data-role="content" id="search-bar-content">
 *			    <input type="search" name="search" id="search-bar"/>
 *			    <ul data-role="listview">
 *				    <li>Hairston</li>
 *				    <li>Hansbrough</li>
 *				    <li>Allred</li>
 *				    <li>Hanrahan</li>
 *				    <li>Egan</li>
 *				    <li>Dare</li>
 *				    <li>Edmonson</li>
 *				    <li>Calip</li>
 *				    <li>Baker</li>
 *				    <li>Fazekas</li>
 *				    <li>Garrity</li>
 *				</ul>
 *			</div>
 *		</div>
 *
 * #SearchInput Widget
 * @class ns.widget.SearchInput
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
    "use strict";
//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
    define(
        [
            "../../engine",
            "../../event",
            "../BaseWidget"
        ],
        function () {
            //>>excludeEnd("tauBuildExclude");
            var BaseWidget = ns.widget.BaseWidget,
                engine = ns.engine,
                SearchInput = function () {
                    var self = this;
                    self.options = {};
                },
                classes = {
                    SEARCHINPUT: "ui-search-input",
                    DISABLED: "ui-state-disabled"
                },

                prototype = new BaseWidget();

            SearchInput.classes = classes;
            SearchInput.prototype = prototype;

            /**
             * Build SearchInput
             * @method _build
             * @protected
             * @param {HTMLElement} element
             * @return {HTMLElement}
             * @member ns.widget.core.SearchInput
             */
            prototype._build = function (element) {
                var searchInputClassList = element.classList;

                searchInputClassList.add(classes.SEARCHINPUT);

                if (!element.getAttribute("placeholder")) {
                    element.setAttribute("placeholder", "Search");
                }

                return element;
            };

            /**
             * Enable SearchInput
             * @method _enable
             * @param {HTMLElement} element
             * @member ns.widget.core.SearchInput
             * @protected
             */
            prototype._enable = function (element) {
                if (element) {
                    element.classList.remove(classes.DISABLED);
                    element.removeAttribute("disabled");
                }
            };

            /**
             * Disable SearchInput
             * @method _disable
             * @param {HTMLElement} element
             * @member ns.widget.core.SearchInput
             * @protected
             */
            prototype._disable = function (element) {
                if (element) {
                    element.classList.add(classes.DISABLED);
                    element.setAttribute("disabled", true);
                }
            };

            /**
             * Bind events to SearchInput
             * @method _bindEvents
             * @param {HTMLElement} element
             * @member ns.widget.core.SearchInput
             * @protected
             */
            prototype._bindEvents = function (element) {
                return element;
            };

            /**
             * Destroy SearchInput
             * @method _destroy
             * @protected
             * @member ns.widget.core.SearchInput
             */
            prototype._destroy = function () {
                this.options = null;
            };


            ns.widget.core.SearchInput = SearchInput;

            engine.defineWidget(
                "SearchInput",
                "input[type='search'], .ui-search-input",
                [],
                SearchInput,
                "core"
            );
            //>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
            return ns.widget.core.SearchInput;
        }
    );
    //>>excludeEnd("tauBuildExclude");
}(window.document, ns));
