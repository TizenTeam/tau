/**
 * @TODO delete tau namespace from this file
 */
(function($){
	module("router.micro.route.page");
	asyncTest("External pages", function(){
		expect(2);
		document.addEventListener("pageshow", function externalPagesTest(event) { 
			// 'pageshow' may come from different page, as we use asyncTests
			if(event.target.id !== "page-with-scripts") {
				return;
			}

			document.removeEventListener("pageshow", externalPagesTest);

			// External script defines a window property
			equal(typeof window.pageWithScripts, "function", "Scripts from page are parsed");
			if(window.pageWithScripts) {
				// Returns doubled value
				equal(window.pageWithScripts(1), 2, "Externally loaded method works");
			}

			// Go back to previous home page

			tau.changePage("../index.html");
			start();
		});

		// Requesting for txt file to avoid running html files with testing data through QUnit
		tau.changePage("./test-data/_externalPage.html");
		
	});

	asyncTest("External pages with external scripts", function(){
		expect(2);
		document.addEventListener("pageshow", function externalPagesTest(event) {
			// 'pageshow' may come from different page, as we use asyncTests
			if(event.target.id !== "page-with-external-scripts") {
				return;
			}

			document.removeEventListener("pageshow", externalPagesTest);

			// External script defines a window property
			equal(typeof window.pageWithExternalScripts, "function", "External script from external page was parsed");
			if(window.pageWithExternalScripts) {
				// Should return tripled value
				equal(window.pageWithExternalScripts(1), 3, "Externally loaded method works");
			}

			// Go back to previous home page
			tau.changePage("../index.html");
			start();
		});

		// Requesting for txt file to avoid running html files with testing data through QUnit
		tau.changePage( "./test-data/_externalPage2.html" );
	});

	asyncTest("External script has the same attributes", function() {
		expect(3);
		document.addEventListener("pageshow", function externalPagesTest(event) {
			var movedScript;

			if(event.target.id !== "page-with-external-scripts") {
				return;
			}

			document.removeEventListener("pageshow", externalPagesTest);

			movedScript = document.getElementById('external-script-tag');
			
			ok(!!movedScript, "Script with same ID exists");
			ok(!movedScript.getAttribute('src'), "Script has no 'src' attribute");
			equal(movedScript.getAttribute('data-test'), "5", "Script has same 'data-test' source");

			// Go back to previous home page
			tau.changePage("../index.html");
			start();
		});

		// Requesting for txt file to avoid running html files with testing data through QUnit
		tau.changePage( "./test-data/_externalPage2.html" );
	});

})(jQuery);