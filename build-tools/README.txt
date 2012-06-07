Tizen Web UI Framework includes following tools used on build;

* less (http://lesscss.org)
	* Description: A dynamic CSS language compiler based on node.js
	* Mods
		* Support rem unit (build-tools/lib/less/parser.js)
	* License: Apache License Version 2.0 (build-tools/lib/less/LICENSE)

* UglifyJS (https://github.com/mishoo/UglifyJS)
	* Description: A javascript code compressor/uglifier based on node.js
	* Mods
		* Add relative lib directory to work with UglifyJS libs (build-tools/bin/uglifyjs)
		* Change lib directory structure: lib/ to lib/uglifyjs/ (build-tools/bin/uglifyjs, build-tools/lib/uglify-js)
	* License: BSD License (build-tools/lib/uglifyjs/LICENSE)

* node-jslint (http://github.com/reid/node-jslint)
	* Version: 3/2/2012 Update (node-jslint: 0.1.6)
	* Description: The JavaScript Code Quality Tool for Node.js
	* Mods
		* Change lib directory structure: lib/ to lib/jslint/ (build-tools/bin/jslint, build-tools/lib/jslint)
	* License
		* node-jslint: BSD License (build-tools/lib/jslint/LICENSE)
		* jslint: Customized MIT License (build-tools/lib/jslint/jslint.js)
		* nopt, abbrev: MIT License (build-tools/lib/jslint/nopt/LICENSE)

* clean-css (http://github.com/GoalSmashers/clean-css)
	* Version: 0.4.0
	* Description: A CSS code minifier
	* Mods
		* Fix local library path and name
	* License
		* MIT license (build-tools/lib/cleancss/LICENSE)

* optimist (http://github.com/substack/node-optimist)
	* Version: 0.3.4
	* Description: A node.js command-line option parser libraryr, used by clean-css.
	* License
		* MIT/X11 license (build-tools/lib/optimist/LICENSE)

* wordwrap (http://github.com/substack/node-wordwrap)
	* Version: b026541 (Released at Apr. 30 2012)
	* Description: Word-wrapping library, used by optimist.
	* License
		* MIT license (build-tools/lib/wordwrap/LICENSE)
