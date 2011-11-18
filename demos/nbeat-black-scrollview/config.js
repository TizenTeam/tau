// instead of calling a function here, we could set up a global
// object (e.g. called CONFIG) and assign a "deps" property to it; then
// load each of the files in the deps property inside bootstrap.js
S.load(
	'theme.js',
	'jquery.easing.1.3.js',
	'jquery.mobile.scrollview.js',
	'scrollview.js',
	'init.js',
	'widgets/checkbox/checkbox.js',
	'widgets/radio/radio.js',
	'widgets/popupwindow/popupwindow.js',
	'tips/generate-elements-dynamically.js',
	'widgets/pagecontrol/pagecontrol-demo.js'
);
//TODO : fix load syntax....
S.css.load(
	'custom.css'
);
