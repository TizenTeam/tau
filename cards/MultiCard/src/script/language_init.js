/*global window, Globalize */
(function (window, document) {
    "use strict";

    var body = document.body;

    function getLang(language) {
        var lang = language
                || document.getElementsByTagName('html')[0].getAttribute('lang')
                || window.navigator.language.split('.')[0]    // Webkit, Safari + workaround for Tizen
                || 'en',
            countryCode = null,
            countryCodeIdx = lang.lastIndexOf('-'),
            ignoreCodes = ['Cyrl', 'Latn', 'Mong'];    // Not country code!
        if (countryCodeIdx != -1) {    // Found country code!
            countryCode = lang.substr(countryCodeIdx + 1);
            if (ignoreCodes.join('-').indexOf(countryCode) < 0) {
                // countryCode is not found from ignoreCodes.
                // Make countryCode to uppercase.
                lang = [lang.substr(0, countryCodeIdx), countryCode.toUpperCase()].join('-');
            }
        }
        // NOTE: 'en' to 'en-US', because globalize has no 'en' culture file.
        lang = (lang == 'en' ? 'en-US' : lang);
        return lang;
    }

    function getNeutralLang(lang) {
        var neutralLangIdx = lang.lastIndexOf('-'),
            neutralLang;
        if (neutralLangIdx != -1) {
            neutralLang = lang.substr(0, neutralLangIdx);
        }
        return neutralLang;
    }

    function getCultureFilePath(lang, cultureDictionary) {
        var path = null;
        if (typeof lang === "string") {
            if (cultureDictionary && cultureDictionary[lang]) {
                path = cultureDictionary[lang];
            } else {
                // Default Globalize culture file path
                path = [
                    'lib',
                    'globalize',
                    'cultures',
                    ['globalize', 'culture', lang, 'js'].join('.')
                ].join('/');
            }
        }
        return path;
    }

    function loadCultureFile(path, errCB) {
        var script;
        if (path) {
            script = document.createElement('script');
            script.src = path;
            body.appendChild(script);
        }
    }

    function loadGlobalizeCulture(language, cultureDictionary) {
        var path,
            lang;
        lang = getLang(language);
        path = getCultureFilePath(lang, cultureDictionary);
        loadCultureFile(path,
            function (path) {
                var nLang,
                    npath;
                nLang = getNeutralLang(lang);
                npath = getCultureFilePath(nLang, cultureDictionary);
                loadCultureFile(npath, null);
            });
        return lang;
    }
    
    function setGlobalize() {
        var lang;
        /*
        * Tizen has rule that language was set by region setting
        */
        if (window.tizen) {
            window.tizen.systeminfo.getPropertyValue("LOCALE", function (locale) {
                var countryLang = locale.country;
                if (countryLang) {
                    countryLang = countryLang.replace("_", "-");
                }
                countryLang = loadGlobalizeCulture(countryLang);
                Globalize.culture(countryLang);
            });
        } else {
            lang = loadGlobalizeCulture();
            Globalize.culture(lang);
        }
    }

    function loadCustomGlobalizeCulture(cultureDictionary) {
        loadGlobalizeCulture(null, cultureDictionary);
    }

    setGlobalize();
}(window, window.document));
