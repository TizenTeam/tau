/*
 *	Goal
 *		- Run button/index.html -> buttonMarkup/index.html automatically in one browser
 *		- Summarize result of each test suite
 *			- pass current summary data by GET variables
 *			- Get current summary data by parsing URL to get those GET variables
 *
 * 	Issues
 * 		- Some testcases may change URL during test
 *	It is a not complete versionc. Optimization, refactoring is needed
 */
( function ( ) {

	var QueryString = function () {
		var query_string = {},
			vars,
			pair,
			arr,
			query = window.location.search.substring(1);

		vars = query.split("&");

		for (var i = 0 ; i < vars.length ; i++)
		{
			pair = vars[i].split("=");
			if (typeof query_string[pair[0]] === "undefined")
			{
				query_string[pair[0]] = pair[1];
			}
			else if (typeof query_string[pair[0]] === "string")
			{
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
		passCount = ( typeof QueryString.p === "undefined" ) ? 0 : parseInt( QueryString.p );
		failCount = ( typeof QueryString.f === "undefined" ) ? 0 : parseInt( QueryString.f );
		totalCount = ( typeof QueryString.t === "undefined" ) ? 0 : parseInt( QueryString.t );
		runTime = ( typeof QueryString.r === "undefined" ) ? 0 : parseInt( QueryString.r );

		loc = window.location.pathname;
		dirs = loc.substring(0, loc.lastIndexOf('/')).split('/');
		currentTest = dirs[dirs.length-1];
	} ( url ) );
	QUnit.log = function( obj ) {
		var tempUrl = url;
		if( obj.result ) {
			if ( tempUrl.indexOf("?")>-1 ) {
				tempUrl = tempUrl.substr(0,tempUrl.indexOf("?"));
			}
			$.post( tempUrl + "../../../../../../tests/jqm-tchelper/log.php", { currentTest : currentTest, obj : obj } , function(){});
		}
	};
	QUnit.done = function ( details ) {
		var nextTestURL;

		function getNextTestURL( currentTest, passCount, failCount, totalCount , runTime ) {
			var i = 0,
				nextUrl = "",
				updir = "../";
			for( i = 0 ; i < tests.length ; i++ )
			{
				if( tests[i] == currentTest )
				{
					break;
				}
			}

			if( tests.length -1 == i ||
				currentTest === "listview" ||
				currentTest === "event" )
			{
				//Goto result Page
				nextUrl ="../../../../../../tests/jqm-tchelper/result.php"  + "?" + "p=" + passCount + "&f=" + failCount + "&t=" + totalCount + "&r=" + runTime;
			}else{
				if( currentTest === "navigation"  )
				{
					updir += "../../";
				}
				nextUrl = updir +  tests[i + 1] +"/?" + "p=" + passCount + "&f=" + failCount + "&t=" + totalCount + "&r=" + runTime;
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
