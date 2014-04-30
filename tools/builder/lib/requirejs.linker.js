/*global print load, environment */

// this is excluded from main app
// since rjs adapter is conflicting
// with rhino commonjs methods
// and without commonjs we have to hack
// moodule loading to get commons.js

function showHelp() {
	print("");
	print("TAU Linker");
	print("");
	print('--inputFile="PATH" input file (requirejs entry point)');
	print('--outputFile="PATH" [OPTIONAL] output file');
	print('--root-ns="NAME" [OPTIONAL] tau base namespace (window.tau => window.[NAME])');
	print("");
}

function parseArguments(args) {
	"use strict";
	var parsed = {},
		arg,
		prop,
		cleanprop,
		spl;

	for (prop in args) {
		if (args.hasOwnProperty(prop)) {
			arg = args[prop];
			if (arg.indexOf("--") > -1) {
				cleanprop = arg.replace(/--/i, "");
				if (cleanprop.indexOf("=") > -1) {
					spl = cleanprop.split("=");
					parsed[spl[0].trim()] = spl[1].trim();
				} else {
					parsed[cleanprop] = true;
				}
			}
		}
	}

	return parsed;
}

var requirejsAsLib = true,
	args = parseArguments(arguments),
	appDir = args["builder-app-dir"],
	inFile = (args["inputFile"] || "").replace(/"+/g, ''),
	outFile = (args["outputFile"]).replace(/"+/g, ''),
	rootNS = (args["root-ns"] || "tau").replace(/"+/g, ''),
	sep = environment["file.separator"],
	userHome = environment["user.home"],
	inFileArr = inFile.split(sep),
	inFileName = inFileArr.pop(),
	tempName = inFileName.split("."),
	base = "";

if (inFile.length === 0) {
	print("ERROR: no input specified");
	showHelp();
	quit(1);
}

base = inFileArr.join(sep);
tempName.pop();
baseFileName = tempName.join(".");

// create output file path if none given
if (!outFile) {
	outFile = base + sep + inFileName + ".out";
}

// replace relative home paths
inFile = inFile.replace(/^~/i, userHome).replace(/"/gi, "");
outFile = outFile.replace(/^~/i, userHome).replace(/"/gi, "");

load(appDir + sep + "lib" + sep + "r.js");
requirejs.onError = function (err) {
	print("ERROR: " + err);
	quit(1);
};
try {
	requirejs.optimize({
		baseUrl: base,
		name: baseFileName,
		out: outFile,
		logLevel: 4,
		pragmasOnSave: {
			tauBuildExclude: true,
			tauDebug: true,
			ejBuildExclude: true,
			ejDebug: true
		},
		onBuildRead: function (moduleName, path, contents) {
			print("INFO: reading module " + moduleName);
			return contents;
		},
		onBuildWrite: function (moduleName, path, contents) {
			print("INFO: writing module " + moduleName);
			return contents;
		},
		wrap: {
			start: '(function(window, document) {\n' +
					'"use strict";\n' +
					'var ns = window.' + rootNS + ' || {},\n' +
					'nsConfig = window.' + rootNS + 'Config || {};\n' +
					'nsConfig.rootNamespace = "' + rootNS + '";\n' +
					'nsConfig.fileName= "' + rootNS + '";\n',
			end: '}(window, window.document));\n'
		},
		findNestedDependiencies: true,
		preserveLicenseComments: true,
		optimize: "none"
	}, function () {
		print("INFO: linking done");
		quit(0);
	});
} catch (e) {
	print("ERROR: " + e.message);
	quit(1);
}

quit(1);
