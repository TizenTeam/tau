(function($){

	var popupEvents = "popupbeforecreate popupcreate popupbeforehide popupbeforeshow popuphide popupshow".split(" "),

		eventStack = [],

		checkPopupLayout = function( popup ) {
			var screenWidth = $(window).width(),
				screenHeight = $(window).height(),
				$popup = $( popup ),
				popupHeaderHeight = $popup.children(".ui-popup-header").outerHeight(),
				popupFooterHeight = $popup.children(".ui-popup-footer").outerHeight(),
				popupContentHeight = $popup.children(".ui-popup-content").outerHeight();
//			console.log('header ', popupHeaderHeight, 'footer', popupFooterHeight, 'content', popupContentHeight, 'all', $popup.innerHeight())
			return Math.abs(popupHeaderHeight + popupFooterHeight + popupContentHeight - $popup.innerHeight()) <= 6
				&& $popup.outerHeight(true) === screenHeight;
		},

		checkActivePopup = function( popup ) {
			var active = $(".ui-popup-active"),
				popupkey = "popup=true";
			return location.hash.indexOf( popupkey ) > -1 &&
				active.length === 1 &&
				active[0] === $(popup)[0];
		},

		checkHasNotActivePopup = function( ) {
			var active = $(".ui-popup-active"),
				popupkey = "popup=true";
			return location.hash.indexOf( popupkey ) === -1 &&
			active.length === 0;
		};

		popupEvents.forEach(function(eventName, idx) {
			document.addEventListener(eventName, function( event ) {
				eventStack.push({
					type: event.type,
					target: event.target
				});
			}, false);
		});

	asyncTest( "fire popup events", function() {
		var popup = $("#popup")[0];

		helper.one(document, "popupshow", function() {
			ok(eventStack[0].type === "popupbeforecreate" && eventStack[0].target === popup, "popupbeforecreate event is fired");
			ok(eventStack[1].type === "popupcreate" && eventStack[1].target === popup, "popupcreate event is fired");
			ok(eventStack[2].type === "popupbeforeshow" && eventStack[2].target === popup, "popupbeforeshow event is fired");
			ok(eventStack[3].type === "popupshow" && eventStack[3].target === popup, "popupshow event is fired");

			helper.one(document, "popuphide", function() {
				ok(eventStack[4].type === "popupbeforehide" && eventStack[3].target === popup, "popupbeforehide event is fired");
				ok(eventStack[5].type === "popuphide" && eventStack[3].target === popup, "popuphide event is fired");

				eventStack.length = 0;
				start();
			});

			tau.closePopup();
		});

		eventStack.length = 0;
		tau.openPopup(popup);
	});

	asyncTest( "test popup apis", function(){
		helper.popupSequence([
			function() {
				tau.openPopup( "#layout-test-header-footer" );
			},

			function() {
				ok(checkActivePopup("#layout-test-header-footer"), "call tau.openPopup() with dom element id");
				tau.closePopup();
			},

			function() {
				tau.openPopup( "path-test/external.html" );
			},

			function() {
				ok(checkActivePopup("#externalPopup"), "open external popup.");
				tau.closePopup();
			},

			function() {
				tau.openPopup( "#layout-test-header" );
			},

			function() {
				ok(checkActivePopup("#layout-test-header"), "call open popup alreay another popup is opend");
				tau.closePopup();
			},

			function() {
				tau.openPopup( $("#layout-test-footer")[0] );
			},

			function() {
				ok(checkActivePopup("#layout-test-footer"), "call tau.openPopup() with dom element ");
				tau.closePopup();
			},

			function() {
				ok(checkHasNotActivePopup(), "call tau.closePopup()");
			}

		], true);
	});

	asyncTest( "various popup layout", function(){
		helper.popupSequence([
			function() {
				tau.openPopup( "#layout-test-header-footer" );
			},

			function() {
				ok(checkPopupLayout("#layout-test-header-footer"), "set popup layout with header and footer");
				tau.closePopup();
			},

			function() {
				tau.openPopup( "#layout-test-header" );
			},

			function() {
				ok(checkPopupLayout("#layout-test-header"), "set popup layout with header");
				tau.closePopup();
			},

			function() {
				tau.openPopup( "#layout-test-footer" );
			},

			function() {
				ok(checkPopupLayout("#layout-test-footer"), "set popup layout with footer");
				tau.closePopup();
			},

			function() {
				tau.openPopup( "#layout-test-content-padding" );
			},

			function() {
				ok(checkPopupLayout("#layout-test-content-padding"), "set popup layout with custom content");
				tau.closePopup();
			},

			function() {
			}

		], true);
	});

	asyncTest( "Open internal popup in external page", function() {
		helper.pageSequence([
			function() {
				tau.changePage( "path-test/externalPage.html" );
			},

			function() {
				helper.popupSequence([
					function() {
						tau.openPopup( "#popup-in-externl-page" );
					},

					function() {
						ok(checkActivePopup("#popup-in-externl-page"), "open internal popup in external page");
						tau.closePopup();
					},

					function() {
						tau.back();
					}
				]);
			},

			function() {
			}
		], true);
	});

	asyncTest( "Navigating away from the page closes the popup", function() {
		var popup = $("#has-external-link-popup");

		helper.pageSequence([
			function() {
				helper.one(document, "popupshow", function() {
					popup.find("a")[0].click();
				});

				tau.openPopup( popup );
			},

			function() {
				ok(checkHasNotActivePopup(), "closed popup fastOn page change.");

				helper.one(document, "popupshow", function() {
					tau.changePage( "../index.html" );
				});

				tau.openPopup( "#popup-in-externl-page" );
			},

			function() {
				ok(checkHasNotActivePopup(), "closed popup fastOn tau.back().");
			}
		], true);
	});

	asyncTest( "Opening another popup from the popup closes the popup", function() {
		var popup = $( "#has-popup-link-popup" );

		helper.popupSequence([
			function() {
				tau.openPopup( popup );
			},

			function() {
				// another popup link click.
				popup.find( "a" )[0].click();
			},

			function() {
				ok( !popup.hasClass(".ui-popup-active"), "old popup closed" );
			},

			function() {
				ok(checkActivePopup("#another-popup"), "new popup opened ");
				tau.closePopup();
			},

			function() {
			}

		], true);
	});

	asyncTest( "Opening another page from the popup leaves no trace of the popup in history", function() {
		var popup = $("#has-external-link-popup");

		helper.pageSequence([
			function() {
				helper.one(document, "popupshow", function() {
					popup.find("a")[0].click();
				});

				tau.openPopup( popup );
			},

			function() {
				ok(checkHasNotActivePopup(), "closed popup fastOn page change.");
				tau.back();
			},

			function() {
				ok(checkHasNotActivePopup(), "doesn't have popup hash.");
			}
		], true);
	});

})(jQuery);