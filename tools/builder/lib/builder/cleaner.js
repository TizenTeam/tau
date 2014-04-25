/*global JavaImporter, javax, org, java, exports, require */
/**
 * @author Piotr Karny <p.karny@samsung.com>
 */
(function (exports) {
	"use strict";
	JavaImporter(
		org.jsoup.Jsoup,
		org.jsoup.nodes.Document,
		org.jsoup.nodes.Element,
		org.jsoup.select.Elements,
		java.io.File,
		java.io.PrintWriter,
		org.apache.commons.codec.binary.Base64,
		java.util.Arrays,
		java.lang.String
	);
	var File = java.io.File,
		PrintWriter = java.io.PrintWriter,
		Jsoup = org.jsoup.Jsoup,
		Base64 = org.apache.commons.codec.binary.Base64,
		JavaString = java.lang.String;

	exports.replaceScripts = function (path) {
		var fin = new File(path),
			fout = new File(path),
			writer,
			doc = Jsoup.parse(fin, null),
			htmlDump,
			tempScript,
			i,
			frameworkLib = doc.select("script[data-framework=tau]"),
			allScripts = doc.select("script");

		if (frameworkLib.size() < 1) {
			throw new Error("Aborting replace scripts. Framework library not found.");
		}

		function replaceTag(replacedElement) {
			var tempNode,
				encodedHTML;

			if(replacedElement.attr("data-framework") != "tau") {
				tempNode = doc.createElement("script");

				encodedHTML = Base64.encodeBase64String(replacedElement.outerHtml().toString().getBytes());

				tempNode.attr("data-type", "replacement");
				tempNode.attr("data-content", encodedHTML);

				replacedElement.replaceWith(tempNode);
			}
		}

		i = allScripts.size();

		while (i--) {
			tempScript = allScripts.get(i);
			replaceTag(tempScript);
		}

		htmlDump = doc.toString();

		writer = new PrintWriter(fout);
		writer.write(htmlDump);
		writer.close();

		return true;
	};

	exports.restoreScripts = function (path) {
		var fin = new File(path),
			fout = new File(path),
			writer,
			doc = Jsoup.parse(fin, null),
			htmlDump,
			tempScript,
			i,
			allScripts = doc.select("script[data-type=replacement]");

		function restoreTag(replacedElement) {
			var encodedHTML = replacedElement.attr("data-content"),
				rawHTML = new JavaString(Base64.decodeBase64(encodedHTML));

			replacedElement.before(rawHTML);
			replacedElement.remove();
		}

		i = allScripts.size();

		while (i--) {
			tempScript = allScripts.get(i);
			restoreTag(tempScript);
		}

		htmlDump = doc.toString();

		writer = new PrintWriter(fout);
		writer.write(htmlDump);
		writer.close();

		return true;
	};
}(exports));
