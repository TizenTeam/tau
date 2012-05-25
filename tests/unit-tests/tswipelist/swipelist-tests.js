/*
 * swipelist unit tests
 *
 * Hyunjung Kim <hjnim.kim@samsung.com>
 *
 */

( function ( $ ) {

	module("swipelist");

	var unit_swipe = function( swipelist, type ) {
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

		$("#swipelistpage").page();
		swipelist.swipelist();

		ok(swipelist.hasClass("ui-swipelist"),"Create - Swipelist");
		covers = swipelist.find("li *.ui-swipelist-item-cover");
		cover = covers.first();
		coverStart = cover.position().left;
		item = swipelist.find("li").first();

		cover.bind("animationComplete", slideRightDone);
		cover.trigger("swiperight");
		stop();

		equal( swipelist.find("li.ui-swipelist-item").length , 2, "Count - Swipeable li");
		equal( covers.length , 2, "Count - cover");

		equal(covers.find("span.ui-swipelist-item-cover-inner:contains('1line-leftsub1')").length,
				1,
				"Check - Cover string value");
	};

	var unit_swipe_destroy = function(swipelist, type) {
		var covers,
			new_page = $("#swipedestorypage");

		new_page.page();
		swipelist.swipelist();
		ok(swipelist.hasClass("ui-swipelist"),"Create - Swipelist");
		covers = swipelist.find("li *.ui-swipelist-item-cover");

		equal( swipelist.find("li.ui-swipelist-item").length , 2, "Count - Swipeable li");
		equal( covers.length , 2, "Count - cover");

		swipelist.swipelist("destroy");

		equal(new_page.has('.ui-swipelist').length, 0, "Destroy - list");
		equal(new_page.has('.ui-swipelist-item').length, 0 , "Destroy - item" );
		equal(new_page.has('.ui-swipelist-item-cover').length, 0, "Destroy - cover");

	};

	asyncTest( " swipelist ", function() {
		expect(7);
		unit_swipe( $("#swipewidget"), "swipelist" );
		start();
	});

	asyncTest( " swipelist - destory", function() {
		expect(6),
		unit_swipe_destroy( $("#swipedestroy"), "swipelistdestroy"),
		start()
	});

} ) ( jQuery );
