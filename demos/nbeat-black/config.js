// instead of calling a function here, we could set up a global
// object (e.g. called CONFIG) and assign a "deps" property to it; then
// load each of the files in the deps property inside bootstrap.js
S.load(
	'theme.js',
	'init.js',
	'widgets/checkbox/checkbox.js',
	'widgets/radio/radio.js',
	'widgets/popupwindow/popupwindow.js'
);
//TODO : fix load syntax....
S.css.load(
	'custom.css'
);
