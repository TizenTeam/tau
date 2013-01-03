/*
 * swipe unit tests
 *
 * Hyunjung Kim <hjnim.kim@samsung.com>
 *
 */

( function ( $ ) {

	module("swipe");

	var unit_swipe = function( swipe, type ) {
		var	covers,
			cover,
			coverStart,
			item,
			slideLeftDone = function () {
				ok(true, "Animation Complete - sliding left");
				cover.unbind("animationComplete");
				equal(cover.position().left, coverStart, "Position - Cover");
				start();
			},
			slideRightDone = function () {
				ok(true, "Animation Complete - sliding right");
				setTimeout(function () {
					cover.unbind("animationComplete");
					cover.bind("animationComplete", slideLeftDone);
					item.trigger("swipeleft");
				}, 0);
			};

		$("#swipepage").page();
		swipe.swipe();
		ok(swipe.hasClass("ui-swipe"), "Create - Swipe");

		covers = swipe.find("div.ui-swipe-item-cover");
		cover = covers.first();

		coverStart = cover.position().left;
		item = swipe.find("div.ui-swipe-item").first();

		cover.bind("animationComplete", slideRightDone);
		cover.trigger("swiperight");
		stop();

		equal( swipe.find("div.ui-swipe-item").length , 1, "Count - Swipeable li");
		equal( covers.length , 1, "Count - cover");

		equal( covers.get(0).innerText,
				"Swipe2",
				"Check - Cover string value");
	};

	var unit_swipe_destroy = function(swipe, type) {
		var covers,
			new_page = $("#swipedestorypage");

		new_page.page();
		swipe.swipe();
		ok(swipe.hasClass("ui-swipe"),"Create - Swipe");
		covers = swipe.find("div.ui-swipe-item-cover");
		equal( swipe.find("div.ui-swipe-item").length , 1, "Count - Swipeable ui-swipe-item");

		equal( covers.length , 1, "Count - cover");

		swipe.swipe("destroy");

		equal(swipe.has('.ui-swipe').length, 0, "Destroy - swipe");
		equal(swipe.has('.ui-swipe-item').length, 0 , "Destroy - item" );
		equal(swipe.has('.ui-swipe-item-cover').length, 0, "Destroy - cover");

	};

	asyncTest( " swipe ", function() {
		expect(7);
		unit_swipe( $("#swipewidget"), "swipe" );
		start();
	});

	asyncTest( " swipe - destory", function() {
		expect(6),
		unit_swipe_destroy( $("#swipedestroy"), "swipedestroy"),
		start()
	});

} ) ( jQuery );
