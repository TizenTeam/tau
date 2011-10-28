// instead of calling a function here, we could set up a global
// object (e.g. called CONFIG) and assign a "deps" property to it; then
// load each of the files in the deps property inside bootstrap.js
S.load(
    'lib/jquery.ui.map.full.min.js',
    'theme.js',
    'init.js'
);

/* link custom stylesheet */
S.css.load(
    'css/aroundme.css'
);
