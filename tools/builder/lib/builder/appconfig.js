/*global JavaImporter, javax, org, java, exports, require */
(function (exports) {
	"use strict";
	JavaImporter(
		javax.xml.parsers.DocumentBuilderFactory,
		javax.xml.parsers.DocumentBuilder,
		org.w3c.dom.Document,
		org.w3c.dom.NodeList,
		org.w3c.dom.Node,
		org.w3c.dom.Element,
		java.io.File
	);
	var DocumentBuilderFactory = javax.xml.parsers.DocumentBuilderFactory,
		File = java.io.File,
		doc,
		logger = require("./logger.js");

	exports.load = function (path) {
		var f = new File(path),
			df = DocumentBuilderFactory.newInstance(),
			db = df.newDocumentBuilder();

		logger.info("loading applicaiton config: " + f.getCanonicalPath());
		doc = db.parse(f);
		doc.getDocumentElement().normalize();
		logger.info("config loaded");
	};

	exports.get = function (tag, attribute) {
		var el = doc.getElementsByTagName(tag);
		if (el.getLength() > 0) {
			if (attribute) {
				return el.item(0).getAttribute(attribute);
			}
			return el.item(0).getTextContent();
		}
		return null;
	};
}(exports));
