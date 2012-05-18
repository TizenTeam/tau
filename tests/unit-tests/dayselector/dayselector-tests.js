/*
 * Unit Test: Dayselector
 * modified by : Koeun Choi <koeun.choi@samsung.com>
 */

(function ($) {

	module( "Day selector" );

	var unit_dayselector = function (elt, expectedType, expectedTheme) {
		var days = 7,
			checkbox,
			label,
			expectedId,
			i;

		elt.dayselector();

		ok( elt.hasClass('ui-dayselector'), "day-selector has 'ui-dayselector' class.");
		// main element should be a controlgroup
		ok( elt.hasClass('ui-controlgroup'), "day-selector has 'ui-controlgroup' class." );

		equal( elt.attr('data-' + $.mobile.ns + 'type'), expectedType, "should have '" + expectedType + "' type" );

		for ( i = 0; i < days ; i++ ) {
			expectedId = elt.attr( 'id' ) + '_' + i;
			checkbox = elt.find( '.ui-checkbox :checkbox[value=' + i + '][id=' + expectedId + ']' );
			equal( checkbox.length, 1, "should be one checkbox per day" );
			equal( checkbox.prop('value'), String(i), "should have correct day value" );

			label = checkbox.siblings().first();
			equal( label.length, 1, "should be one label per day" );
			equal( label.attr('for'), expectedId, "should associate correctly with checkbox" );
			ok( label.hasClass('ui-dayselector-label-' + i), "should have the right label class" );
			equal( label.jqmData('theme'), expectedTheme, "should have '" + expectedTheme + "' theme" );
		}
	};

	/* Test 1. Default Configuration Check */
	asyncTest( "Default Configuration Check", function () {

		$.testHelper.pageSequence( [
			function () {
				$.testHelper.openPage( '#dayselector-test-configuration' );
			},

			function () {
				var expectedType = 'horizontal',
					testPage = $( '#dayselector-test-configuration' ),
					expectedTheme = 's',
					daySelector;

				// test default values are applied correctly
				daySelector = testPage.find( '#dayselector-test-configuration-default' );
				unit_dayselector( daySelector, expectedType, expectedTheme );

				start();
			}
		]);
	});

	/* Test 2. Theme Configuration Check */
	asyncTest( "Theme Configuration Check", function () {

		$.testHelper.pageSequence( [
			function () {
				$.testHelper.openPage( '#dayselector-test-configuration' );
			},

			function () {
				var expectedType = 'horizontal',
					testPage = $( '#dayselector-test-configuration' ),
					expectedTheme,
					daySelector;

				// test user theme is applied to dayselector winset correctly
				daySelector = testPage.find( '#dayselector-test-configuration-theme' );
				daySelector.dayselector();
				expectedTheme = daySelector.jqmData( 'theme' );
				equal( expectedTheme, 'a', "dayselector fieldset theme is 'a'" );
				unit_dayselector( daySelector, expectedType, expectedTheme );

				start();
			}

		]);
	});

	/* Test 3. Custom Configuration Check */
	asyncTest( "Custom Configuration Check", function () {

		$.testHelper.pageSequence( [
			function () {
				$.testHelper.openPage( '#dayselector-test-configuration' );
			},

			function () {
				var expectedType = 'vertical',
					testPage = $( '#dayselector-test-configuration' ),
					expectedTheme = 'a',
					daySelector;

				// test custom config is applied correctly
				daySelector = testPage.find( '#dayselector-test-configuration-custom' );

				daySelector.dayselector({ type: expectedType, theme: expectedTheme });
				unit_dayselector(daySelector, expectedType, expectedTheme );

				start();
			}

		]);
	});

	/* Test 4. Check Event and APIs */
	asyncTest( "Check Event and APIs", function () {

		$.testHelper.pageSequence([
			function () {
				$.testHelper.openPage( '#dayselector-test-select' );
			},

			function () {
				var testPage,
					daySelectorElem,
					wednesday,
					friday;
				testPage = $( '#dayselector-test-select' );
				ok( testPage.hasClass('ui-page-active') );

				// test defaults are applied correctly
				daySelectorElem = testPage.find( '#dayselector-test-select-1' );

				// nothing should be selected yet
				deepEqual( daySelectorElem.dayselector('value'), [] );

				// click on Wednesday and Friday to switch them on
				wednesday = daySelectorElem.find( '.ui-checkbox' )[3];
				$( wednesday ).find( 'label' ).trigger( 'click' );

				friday = daySelectorElem.find( '.ui-checkbox' )[5];
				$( friday ).find( 'label' ).trigger( 'click' );
				deepEqual( daySelectorElem.dayselector('value'), ['3', '5'] );

				// turn off Wednesday and Friday
				$( wednesday ).find( 'label' ).trigger( 'click' );
				$( friday ).find( 'label' ).trigger( 'click' );
				deepEqual( daySelectorElem.dayselector('value'), [] );

				// test the selectAll() method
				daySelectorElem.dayselector( 'selectAll' );
				deepEqual( daySelectorElem.dayselector('value'), ['0', '1', '2', '3', '4', '5', '6'] );

				start();
			}
		]);
	});
})(jQuery);
