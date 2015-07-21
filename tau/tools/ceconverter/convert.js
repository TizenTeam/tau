// Count all of the links from the io.js build page
var cheerio = require("cheerio"),
	fs = require("fs"),
	path = require("path"),
	widgetDefinitions = require("./definitions.json"),
	dirIn = process.argv[2],
	dirOut = process.argv[3],
	i,
	definition,
	elements;

/**
 * Look ma, it's cp -R.
 * @param {string} src The path to the thing to copy.
 * @param {string} dest The path to the new copy.
 */
function copyRecursiveSync(src, dest) {
	var exists = fs.existsSync(src),
		stats = exists && fs.statSync(src),
		isDirectory = exists && stats.isDirectory();
	if (exists && isDirectory) {
		if (!fs.existsSync(dest)) {
			fs.mkdirSync(dest);
		}
		fs.readdirSync(src).forEach(function (childItemName) {
			copyRecursiveSync(path.join(src, childItemName),
				path.join(dest, childItemName));
		});
	} else {
		if (src.indexOf(".html")>=0) {
			console.log("HTML " + src);
			convertHMTL(src, dest);
		} else {
			if (!fs.existsSync(dest)) {
				fs.linkSync(src, dest);
			}
		}
	}
}

function convertHMTL(src, dest) {
	var html = fs.readFileSync(src),
		$ = cheerio.load(html),
		$body = $("body");

	function convertElement(index, element) {
		var $element = $(element),
			attrs = $element.attr(),
			j,
			newJ,
			newElement = $("<tau-" + definition.name + "></tau-" + definition.name + ">");
		$element.replaceWith(newElement);
		for (j in attrs) {
			if (attrs.hasOwnProperty(j)) {
				newJ = j;
				if (j.indexOf("data") === 0) {
					newJ = j.substr(5);
				}
				newElement.attr(newJ, attrs[j]);
			}
			newElement.html($element.html());
		}
	}

	for (i in widgetDefinitions) {
		definition = widgetDefinitions[i];
		if (definition.selector && definition.name !== "pagecontainer") {
			elements = $(definition.selector);
			elements.each(convertElement);
		}
	}
	fs.writeFileSync(dest, $.html());
}

copyRecursiveSync(dirIn, dirOut);
