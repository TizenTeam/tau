/*global window, define */
/*jslint plusplus: true */
/**
 * #DOM Object
 * Utilities object with function to manipulation DOM
 * #How to replace jQuery methods  by ej methods
 * ##append vs {@link ej.utils.DOM#method-appendNodes}
 *
 * HTML code before manipulation
 *
 *	@example
 *	<div>
 *		<div id="first">Hello</div>
 *		<div id="second">And</div>
 *		<div id="third">Goodbye</div>
 *	</div>
 *
 * jQuery manipulation
 *
 *	@example
 *	$( "#second" ).append( "<span>Test</span>" );
 *
 * ej manipulation
 *
 *	@example
 *	var context = document.getElementById("second"),
 *		element = document.createElement("span");
 *	element.innerHTML = "Test";
 *	ej.utils.DOM.appendNodes(context, element);
 *
 * HTML code after manipulation
 *
 *	@example
 *	<div>
 *		<div id="first">Hello</div>
 *		<div id="second">And
 *			<span>Test</span>
 *		</div>
 *		<div id="third">Goodbye</div>
 *	</div>
 *
 * ##replaceWith vs {@link ej.utils.DOM#method-replaceWithNodes}
 *
 * HTML code before manipulation
 *
 *	@example
 *	<div>
 *		<div id="first">Hello</div>
 *		<div id="second">And</div>
 *		<div id="third">Goodbye</div>
 *	</div>
 *
 * jQuery manipulation
 *
 *	@example
 *	$('#second').replaceWith("<span>Test</span>");
 *
 * ej manipulation
 *
 *	@example
 *	var context = document.getElementById("second"),
 *		element = document.createElement("span");
 *	element.innerHTML = "Test";
 *	ej.utils.DOM.replaceWithNodes(context, element);
 *
 * HTML code after manipulation
 *
 *	@example
 *	<div>
 *		<div id="first">Hello</div>
 *		<span>Test</span>
 *		<div id="third">Goodbye</div>
 *	</div>
 *
 * ##before vs {@link ej.utils.DOM#method-insertNodesBefore}
 *
 * HTML code before manipulation
 *
 *	@example
 *	<div>
 *		<div id="first">Hello</div>
 *		<div id="second">And</div>
 *		<div id="third">Goodbye</div>
 *	</div>
 *
 * jQuery manipulation
 *
 *	@example
 *	$( "#second" ).before( "<span>Test</span>" );
 *
 * ej manipulation
 *
 *	@example
 *	var context = document.getElementById("second"),
 *		element = document.createElement("span");
 *	element.innerHTML = "Test";
 *	ej.utils.DOM.insertNodesBefore(context, element);
 *
 * HTML code after manipulation
 *
 *	@example
 *	<div>
 *		<div id="first">Hello</div>
 *		<span>Test</span>
 *		<div id="second">And</div>
 *		<div id="third">Goodbye</div>
 *	</div>
 *
 * ##wrapInner vs {@link ej.utils.DOM#method-wrapInHTML}
 *
 * HTML code before manipulation
 *
 *	@example
 *	<div>
 *		<div id="first">Hello</div>
 *		<div id="second">And</div>
 *		<div id="third">Goodbye</div>
 *	</div>
 *
 * jQuery manipulation
 *
 *	@example
 *	$( "#second" ).wrapInner( "<span class="new"></span>" );
 *
 * ej manipulation
 *
 *	@example
 *	var element = document.getElementById("second");
 *	ej.utils.DOM.wrapInHTML(element, "<span class="new"></span>");
 *
 * HTML code after manipulation
 *
 *	@example
 *	<div>
 *		<div id="first">Hello</div>
 *		<div id="second">
 *			<span class="new">And</span>
 *		</div>
 *		<div id="third">Goodbye</div>
 *	</div>
 *
 * @class ej.utils.DOM
 */
(function (window, document, ej) {
	"use strict";
	//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
	define(
		[
			"../../utils"
		],
		function () {
			//>>excludeEnd("ejBuildExclude");
			ej.utils.DOM = {};
			//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
			return ej.utils.DOM;
		}
	);
	//>>excludeEnd("ejBuildExclude");
}(window, window.document, window.ej));
