/*
 *	Goal
 *		- Run button/index.html -> buttonMarkup/index.html automatically in one browser
 *		- Summarize result of each test suite
 *			- pass current summary data by GET variables
 *			- Get current summary data by parsing URL to get those GET variables
 *
 *	Issues
 *		- Some testcases may change URL during test
 *	It is a not complete versionc. Optimization, refactoring is needed
 *
 */

function setCookie( cookieName, cookieValue, expireDate) {
	var today = new Date();
		today.setDate( today.getDate() + parseInt( expireDate ) );
		document.cookie = cookieName + "=" + escape( cookieValue ) + "; path=/; expires=" + today.toGMTString() + ";";
}
function getCookie(name) {
	var cname = name + "=";
	var dc = document.cookie;
	if (dc.length > 0) {
		begin = dc.indexOf(cname);
			if (begin != -1) {
				begin += cname.length;
				end = dc.indexOf(";", begin);
					if (end == -1) {
						end = dc.length;
					}
				return unescape(dc.substring(begin, end));
			}
	}
	return null;
}

( function ( ) {

	var QueryString = function () {
		var query_string = {},
			vars,
			pair,
			arr,
			query = window.location.search.substring(1);

		vars = query.split("&");

		for (var i = 0 ; i < vars.length ; i++) {
			pair = vars[i].split("=");
			if (typeof query_string[pair[0]] === "undefined") {
				query_string[pair[0]] = pair[1];
			} else if (typeof query_string[pair[0]] === "string") {
				arr = [ query_string[pair[0]], pair[1] ];
				query_string[pair[0]] = arr;
			} else {
				query_string[pair[0]].push(pair[1]);
			}
		}
		return query_string;
	} ();
/*
	except : listview, event
*/
	var tests = [
		"listview",
		"event",
		"button",
		"button-markup",
		"navigation",
		"zoom",
		"checkboxradio",
		"collapsible",
		"controlgroup",
		"core",
		"degrade-inputs",
		"dialog",
		"field-contain",
		"fixed-toolbar",
		"init",
		"loader",
		"textinput",
		"support",
		"media",
		"kitchensink",
		"navbar",
		"page",
		"page-sections",
		"select",
		"slider",
		"widget"
	],

		passCount, failCount, totalCount, runtime,
		currenTest,
		url;

	function getCurrentURL ( ) {
		return window.location.href;
	}
	function getURLParameter(name) {
    return decodeURI(
        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
    );
}
	url = getCurrentURL( );

	( function parseURL ( url ) {
		// TODO
		var loc,
			dir;
		passCount = ( getCookie( "TizenP") === "undefined" ) ? 0 : parseInt( getCookie( "TizenP") );
		failCount = ( getCookie( "TizenF") === "undefined" ) ? 0 : parseInt( getCookie( "TizenF") );
		totalCount = ( getCookie( "TizenT") === "undefined" ) ? 0 : parseInt( getCookie( "TizenT") );
		runTime = ( getCookie( "TizenR") === "undefined" ) ? 0 : parseInt( getCookie( "TizenR") );

		loc = window.location.pathname;
		dirs = loc.substring(0, loc.lastIndexOf('/')).split('/');
		currentTest = dirs[dirs.length-1];
	} ( url ) );

	QUnit.done = function ( details ) {
		var nextTestURL;

		function getNextTestURL( currentTest, passCount, failCount, totalCount , runTime ) {
			var i = 0,
				nextUrl = "",
				updir = "../";
			for( i = 0 ; i < tests.length ; i++ )
			{
				if( tests[i] == currentTest ) {
					break;
				}
			}

			if( tests.length -1 == i )
			{
				//Goto result Page
				nextUrl ="../../../../../../tests/unit-tests-runner/result.php";
			}else{
				if( currentTest === "navigation"  ) {
					updir += "../../";
				} else if ( currentTest === "listview" ) {
					updir += "../";
				}
				setCookie( "TizenP", passCount );
				setCookie( "TizenF", failCount );
				setCookie( "TizenR", runTime );
				setCookie( "TizenT", totalCount );
				nextUrl = updir +  tests[i + 1];
			}

			return nextUrl;
		}
		function gotoURL( url ) {
			window.location.href = url;
			return;
		}

		passCount += details.passed;
		failCount += details.failed;
		totalCount +=  details.total;
		runTime += details.runtime;

		nextTestURL = getNextTestURL( currentTest, passCount, failCount, totalCount ,runTime );
		gotoURL( nextTestURL );

	};
} () );
