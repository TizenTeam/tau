/*global window, console, test, equal, module, ej, asyncTest, start, HTMLElement, HTMLDivElement */
/*jslint nomen: true */
(function (window, document) {
    "use strict";

    module("Marquee tests", {
        teardown: function () {
            tau.engine._clearBindings();
        }
    });

    test("simple marquee div test", 10, function () {
        var marqueeEl = document.getElementById("marquee"),
            marqueeWidget = tau.widget.Marquee(marqueeEl, {runOnlyOnEllipsisText:false}),
            marqueeObject = marqueeEl.querySelector(".ui-marquee-content");

        equal(marqueeObject.tagName, 'DIV', 'Marquee created DIV for marquee content');
        // check default marquee Style (slide)
        equal(marqueeWidget.option("marqueeStyle"), 'slide', 'Default marquee style is Slide');
        equal(marqueeWidget.option("timingFunction"), 'linear', 'Default marquee timing function is linear');
        equal(marqueeWidget.option("iteration"), 1, 'Default iteration count is 1');
        equal(marqueeWidget.option("speed"), 60, 'Default speed of marquee is 60(px/sec)');
        equal(marqueeWidget.option("delay"), 0, 'Default delay time is 0');
        equal(marqueeWidget.option("autoRun"), true, 'Default autoRun option is true');
        equal(marqueeWidget.option("ellipsisEffect"), 'gradient', 'Default ellipsisEffect option is gradient');
        equal(marqueeObject.style.webkitAnimationName, marqueeWidget.option("marqueeStyle") + "-" + marqueeEl.id, 'Marquee Animation Name set');


        marqueeWidget.destroy();
        // after destroy, check resetDOM.
        equal(marqueeEl.innerHTML, '<p>Marquee Test sample with Only text</p>', 'original marquee element has proper innerHTML');
    });

    test("marquee with several element", 2, function () {
        var marqueeEl = document.getElementById("marquee2"),
            marqueeWidget = tau.widget.Marquee(marqueeEl, {runOnlyOnEllipsisText:false}),
            marqueeObject = marqueeEl.querySelector(".ui-marquee-content");

        equal(marqueeObject.childElementCount, 2, 'All childNodes in original element copied to marquee Object DOM');
        equal(marqueeObject.children[0].innerHTML, 'Marquee Text with image file', 'Text copied well into Marquee object DOM');

        marqueeWidget.destroy();
    });

    test("marquee Style and animation name Check", 6, function () {
        var marqueeSlideWidget = tau.widget.Marquee(document.getElementById("marqueeSlide"), {marqueeStyle:"slide", runOnlyOnEllipsisText:false}),
            marqueeScrollWidget = tau.widget.Marquee(document.getElementById("marqueeScroll"), {marqueeStyle:"scroll", runOnlyOnEllipsisText:false}),
            marqueeAlternateWidget = tau.widget.Marquee(document.getElementById("marqueeAlternate"), {marqueeStyle:"alternate", runOnlyOnEllipsisText:false});

        equal(marqueeSlideWidget.option("marqueeStyle"), 'slide', 'Marquee widget has marqueeStyle=slide option');
        equal(marqueeSlideWidget._ui.marqueeInnerElement.style.webkitAnimationName, 'slide-marqueeSlide', 'Marquee Animation Name check');
        equal(marqueeScrollWidget.option("marqueeStyle"), 'scroll', 'Marquee widget has marqueeStyle=scroll option');
        equal(marqueeScrollWidget._ui.marqueeInnerElement.style.webkitAnimationName, 'scroll-marqueeScroll', 'Marquee Animation Name check');
        equal(marqueeAlternateWidget.option("marqueeStyle"), 'alternate', 'Marquee widget has marqueeStyle=alternate option');
        equal(marqueeAlternateWidget._ui.marqueeInnerElement.style.webkitAnimationName, 'alternate-marqueeAlternate', 'Marquee Animation Name check');

        marqueeSlideWidget.destroy();
        marqueeScrollWidget.destroy();
        marqueeAlternateWidget.destroy();
    });

    test("change option and refresh test for marquee", 5, function () {
        var marqueeWidget = tau.widget.Marquee(document.getElementById("optionsTest"), {marqueeStyle:"slide", runOnlyOnEllipsisText:false});

        equal(marqueeWidget.option("marqueeStyle"), 'slide', 'Marquee widget has marqueeStyle=slide option');
        marqueeWidget.option("marqueeStyle", "alternate");
        equal(marqueeWidget.option("marqueeStyle"), 'alternate', 'Marquee style has been changed');
        marqueeWidget.option("iteration", "infinite");
        equal(marqueeWidget._ui.marqueeInnerElement.style.webkitAnimationIterationCount, 'infinite', 'Marquee iteration count has been changed');
        marqueeWidget.option("autoRun", false);
        ok(marqueeWidget._ui.marqueeInnerElement.classList.contains('ui-marquee-anim-stopped'), 'after option autoRun be false, it has paused');
        marqueeWidget.option("runOnlyOnEllipsisText", true);
        equal(marqueeWidget._ui.marqueeInnerElement.style.webkitAnimationName, "", 'after option runOnlyOnEllipsisText be true, it does not have any animation style');

        marqueeWidget.destroy();
    });

    test("method test for marquee", 2, function () {
        var marqueeEl = document.getElementById("methodTest"),
            marqueeWidget = tau.widget.Marquee(marqueeEl, {marqueeStyle:"alternate", iteration:"infinite", autoRun: false, runOnlyOnEllipsisText:false}),
            eventsCalled = {};

        marqueeEl.addEventListener("marqueestart", function(e) {
            eventsCalled[e.type] = true;
        });
        marqueeEl.addEventListener("marqueestopped", function(e) {
            eventsCalled[e.type] = true;
        });

        marqueeWidget.start();
        ok(eventsCalled.marqueestart, 'Marquee is started');

        marqueeWidget.stop();
        ok(eventsCalled.marqueestopped, 'Marquee is stopped');

        marqueeWidget.destroy();

    });

}(window, window.document));
