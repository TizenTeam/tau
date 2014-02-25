/*global window, define */
/*jslint plusplus: true */
/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/*
 * @author Jadwiga Sosnowska <j.sosnowska@partner.samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @author Maciej Moczulski <m.moczulski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 */
/**
 * # DOM Object
 * Utilities object with function to manipulation DOM
 *
 * # How to replace jQuery methods  by ns methods
 * ## append vs {@link ns.utils.DOM#method-appendNodes}
 *
 * #### HTML code before manipulation
 *
 *     @example
 *     <div>
 *         <div id="first">Hello</div>
 *         <div id="second">And</div>
 *         <div id="third">Goodbye</div>
 *     </div>
 *
 * #### jQuery manipulation
 *
 *     @example
 *     $( "#second" ).append( "<span>Test</span>" );

 * #### ns manipulation
 *
 *     @example
 *     var context = document.getElementById("second"),
 *         element = document.createElement("span");
 *     element.innerHTML = "Test";
 *     ns.utils.DOM.appendNodes(context, element);
 *
 * #### HTML code after manipulation
 *
 *     @example
 *     <div>
 *         <div id="first">Hello</div>
 *         <div id="second">And
 *             <span>Test</span>
 *         </div>
 *        <div id="third">Goodbye</div>
 *     </div>
 *
 * ## replaceWith vs {@link ns.utils.DOM#method-replaceWithNodes}
 *
 * #### HTML code before manipulation
 *
 *     @example
 *     <div>
 *         <div id="first">Hello</div>
 *         <div id="second">And</div>
 *         <div id="third">Goodbye</div>
 *     </div>
 *
 * #### jQuery manipulation
 *
 *     @example
 *     $('#second').replaceWith("<span>Test</span>");
 *
 * #### ns manipulation
 *
 *     @example
 *     var context = document.getElementById("second"),
 *         element = document.createElement("span");
 *     element.innerHTML = "Test";
 *     ns.utils.DOM.replaceWithNodes(context, element);
 *
 * #### HTML code after manipulation
 *
 *     @example
 *     <div>
 *         <div id="first">Hello</div>
 *         <span>Test</span>
 *         <div id="third">Goodbye</div>
 *     </div>
 *
 * ## before vs {@link ns.utils.DOM#method-insertNodesBefore}
 *
 * #### HTML code before manipulation
 *
 *     @example
 *     <div>
 *         <div id="first">Hello</div>
 *         <div id="second">And</div>
 *         <div id="third">Goodbye</div>
 *     </div>
 *
 * #### jQuery manipulation
 *
 *     @example
 *     $( "#second" ).before( "<span>Test</span>" );
 *
 * #### ns manipulation
 *
 *     @example
 *     var context = document.getElementById("second"),
 *         element = document.createElement("span");
 *     element.innerHTML = "Test";
 *     ns.utils.DOM.insertNodesBefore(context, element);
 *
 * #### HTML code after manipulation
 *
 *     @example
 *     <div>
 *         <div id="first">Hello</div>
 *         <span>Test</span>
 *         <div id="second">And</div>
 *         <div id="third">Goodbye</div>
 *     </div>
 *
 * ## wrapInner vs {@link ns.utils.DOM#method-wrapInHTML}
 *
 * #### HTML code before manipulation
 *
 *     @example
 *     <div>
 *         <div id="first">Hello</div>
 *         <div id="second">And</div>
 *         <div id="third">Goodbye</div>
 *     </div>
 *
 * #### jQuery manipulation
 *
 *     @example
 *     $( "#second" ).wrapInner( "<span class="new"></span>" );
 *
 * #### ns manipulation
 *
 *     @example
 *     var element = document.getElementById("second");
 *     ns.utils.DOM.wrapInHTML(element, "<span class="new"></span>");
 *
 * #### HTML code after manipulation
 *
 *     @example
 *     <div>
 *         <div id="first">Hello</div>
 *         <div id="second">
 *             <span class="new">And</span>
 *         </div>
 *         <div id="third">Goodbye</div>
 *     </div>
 *
 * @class ns.utils.DOM
 */
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
	define(
		[
			"../../utils"
		],
		function () {
			//>>excludeEnd("ejBuildExclude");
			ns.utils.DOM = {};
			//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
			return ns.utils.DOM;
		}
	);
	//>>excludeEnd("ejBuildExclude");
}(window, window.document, window.ej));
