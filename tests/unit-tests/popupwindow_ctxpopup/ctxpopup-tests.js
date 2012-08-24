$(document).ready( function () {

	module( "CtxPopup" );
	asyncTest( "Auto-initialization", function () {
		$.testHelper.pageSequence( [
			function () {
				var plain = $("#pop_plain"),
					plainBtn = $("#btn_plain"),
					horizontal = $("#pop_horizontal"),
					horizontalBtn = $("#btn_horizontal"),
					buttons = $("#pop_buttons"),
					buttonsBtn = $("#btn_buttons"),
					notCtxpopup  = $("#pop_not"),
					notCtxpopupBtn = $("#btn_not");

				ok( plain.data( "ctxpopup" ), "should Normal type ctxpopup created" );
				ok( horizontal.data( "ctxpopup" ), "should Horizontal type ctxpopup created" );
				ok( buttons.data( "ctxpopup" ), "should Button type ctxpopup created" );
				ok( !notCtxpopup.data( "ctxpopup" ), "should wihthout arrow ctxpopup not created" );
			},

			function () {
				expect( 4 );
				start();
			}
		]);
	});

	// ctxpopup shares code with popupwindow so only tests ctxpopup specific codes
	asyncTest( "Open and Placements", function () {
		$.testHelper.pageSequence( [
			function () {
				var plain = $("#pop_plain").ctxpopup(),
					horizontal = $("#pop_horizontal").ctxpopup(),
					buttons = $("#pop_buttons").ctxpopup();

				function placementsTest( popup ) {
					var width = $(window).width(),
						height = $(window).height(),
						x = 0,
						y = 0,
						parents = popup.parents(".ui-popupwindow"),
						popDim,
						popPosX = 0,
						popPosY = 0,
						segment = 5,
						closed = 0,
						open = 0;

					popup.bind( "popupafterclose", function () {
						// tests event trigger
						closed++;
						if ( closed == open ) {
							equal( closed, open, "should 'popupafterclose' triggered." );
							start();
						}
					});

					while ( y <= height ) {
						while ( x <= width ) {
							popup.popupwindow( "open", x, y );
							open++;
							popPosX = parseInt( parents.css("left") );
							popPosY = parseInt( parents.css("top") );
							popDim = {
								width: parents.width(),
								height: parents.height()
							};

							if ( popPosX < 0 || popPosY < 0 || popPosX > (width - popDim.width) || popPosY > (height - popDim.height) ) {
								throw "Pop up occured at wrong position: (" + popPosX + "," + popPosY + "," + popDim.width + "," + popDim.height + ")";
							}

							popup.popupwindow( "close" );
							x += width / segment;
						}
						y += height / segment;
						x = 0;
					}
					setTimeout( function() {
						if ( closed != open )
							throw "  Error, popupafterclose event was not triggering ";
					}, 1000 * 10 );
					stop();
					return true;
				}

				var testee = [
					{ name: "Plain", popup: plain },
					{ name: "Horizontal", popup: horizontal },
					{ name: "Buttons", popup: buttons }
				];

				for ( var i = 0; i < testee.length; i++ ) {
					ok( placementsTest( testee[i].popup ), "should " + testee[i].name + " pop up within window area" );
				}
			},

			function () {
				expect( 6 );
				start();
			}
		]);
	});
});
