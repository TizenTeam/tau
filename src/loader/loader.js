// domready.js (https://github.com/ded/domready)
// NB not minified, as it the minified version doesn't work
!function (context, doc) {
  var fns = [], ol, fn, f = false,
      testEl = doc.documentElement,
      hack = testEl.doScroll,
      domContentLoaded = 'DOMContentLoaded',
      addEventListener = 'addEventListener',
      onreadystatechange = 'onreadystatechange',
      loaded = /^loade|c/.test(doc.readyState);

  function flush(i) {
    loaded = 1;
    while (i = fns.shift()) { i() }
  }
  doc[addEventListener] && doc[addEventListener](domContentLoaded, fn = function () {
    doc.removeEventListener(domContentLoaded, fn, f);
    flush();
  }, f);


  hack && doc.attachEvent(onreadystatechange, (ol = function () {
    if (/^c/.test(doc.readyState)) {
      doc.detachEvent(onreadystatechange, ol);
      flush();
    }
  }));

  context['domReady'] = hack ?
    function (fn) {
      self != top ?
        loaded ? fn() : fns.push(fn) :
        function () {
          try {
            testEl.doScroll('left');
          } catch (e) {
            return setTimeout(function() { context['domReady'](fn) }, 50);
          }
          fn();
        }()
    } :
    function (fn) {
      loaded ? fn() : fns.push(fn);
    };

}(this, document);

/**
 * loader.js : Loader for web-ui-fw
 * Refactored from bootstrap.js
 *
 * By Youmin Ha <youmin.ha@samsung.com>
 *
 */
S = {
	libFileName : "web-ui-fw.js",

	frameworkData : {
		rootDir: 'web-ui-fw',
		version: '0.1',
		theme: "default",
		},

    cacheBust: (document.location.href.match(/debug=true/)) ?
               '?cacheBust=' + (new Date()).getTime() :
               '',

	util : {
		addElementToHead : function() {
			var head = document.getElementsByTagName('head')[0];
			for (var idx in arguments) {
				head.appendChild(arguments[idx]);
			}
		},
	},

	css : {
		load: function (path) {
			S.util.addElementToHead(this.makeLink(path + S.cacheBust));
		},

		makeLink : function (href) {
			var customstylesheetLink = document.createElement('link');
			customstylesheetLink.setAttribute('rel', 'stylesheet');
			customstylesheetLink.setAttribute('href', href);
			return customstylesheetLink;
		},
	},

	getParams: function() {
		/* Get data-* params from <script> tag, and set S.frameworkData.* values
		 * Returns true if proper <script> tag is found, or false if not.
		 */
		// Find current <script> tag element
		var scriptElems = document.getElementsByTagName('script'),
			val = null,
			foundScript = false;
		for (var idx in scriptElems) {
			var elem = scriptElems[idx],
				src = elem.getAttribute('src');
			if(src && src.match(this.libFileName)) {
				// Set version and theme, only when they are given.
				this.frameworkData.rootDir = elem.getAttribute('data-framework-root') || this.frameworkData.rootDir;
				this.frameworkData.version = elem.getAttribute('data-framework-version') || this.frameworkData.version;
				this.frameworkData.theme = elem.getAttribute('data-framework-theme') || this.frameworkData.theme;
				foundScript = true;
				break;
			}
		}
		return foundScript;
	},

	loadTheme: function() {
		var themePath = [
			this.frameworkData.rootDir, 
			this.frameworkData.version,
			'themes',
			this.frameworkData.theme
				].join('/');
		this.css.load([themePath, 'web-ui-fw-theme.css'].join('/'));

		// Run theme.js script
		var themejsPath = [themePath, 'theme.js'].join('/');
		$.ajax({
			url: themejsPath,
			dataType: 'script',
			async: false,
			success: null,
			error: function(jqXHR, textStatus, errorThrown) {
				var ignoreStatusList = [
					404,	// not found
					];
				if(-1 == $.inArray(jqXHR.status, ignoreStatusList)) {
					alert('Error while loading theme.js!\n' + jqXHR.status + ':' + jqXHR.statusText);
				}
			},
		});
	},

	setViewport: function () {
		var meta;
		if ( meta = document.createElement( "meta" )) {
			//set meta tags for view port
			meta.name = "viewport";

			//TODO: Modify after browser view port policy is created.
			var supportedRatio = 9/16;
			var screenRatio = new Number (screen.width/screen.height);

			if ( supportedRatio != screenRatio.toFixed(4) ) {
				//TODO : support high, medium, low resolution
				//meta.content = "width=720, initial-scale=1.0, maximum-scale=1.0, user-scalable=0";
				meta.content = "width=device-width, initial-scale=0.6, maximum-scale=0.6, user-scalable=0, target-densityDpi=device-dpi";
				console.log("screen size: (" + screen.width + ", " + screen.height + "), ratio["
						+ screenRatio.toFixed(4) + "]is not supported properly.");
			}
			//supported aspect-ratio : 720 X 1280 ---> 9/16
			else
				meta.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, target-densityDpi=device-dpi";

			var head = document.getElementsByTagName('head').item(0);
			head.insertBefore(meta, head.firstChild);
		}
	},
	
	beforeAct: function(S, $) {
		$.mobile.autoInitializePage = false;
		$('body').css('visibility', 'hidden');
	},
	startAct: function(S, $) {
		$.mobile.initializePage();
		$('body').css('visibility', 'visible');
	},
};


// Loader's jobs
(function (S, $, undefined) {
	S.beforeAct(S, $);
	domReady(function() {
		S.getParams();
		S.loadTheme();
		S.setViewport();
		S.startAct(S, $);
	});
 })(S, jQuery);
