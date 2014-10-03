(function(document, tau) {
    "use strict";
    module("widget.tv.Slider TV Slider widget", {});

    test("Slider", function() {
        var slider = document.getElementById('slider-1');

        window.tau.engine.createWidgets(document.getElementById('qunit-fixture'));

        equal(slider.getAttribute('data-tau-bound'), "TizenSlider", "Slider widget is created");
        ok(slider.classList.contains('ui-slider-input'), 'Slider has ui-slider-input class');
    });

    test("Popup Slider", function() {
        var slider = document.getElementById('slider-2');

        window.tau.engine.createWidgets(document.getElementById('qunit-fixture'));

        equal(slider.getAttribute('data-tau-bound'), "TizenSlider", "Slider widget is created");
        equal(slider.getAttribute('min'), "0", "Slider has minimum");
        equal(slider.getAttribute('max'), "100", "Slider has maximum");
        ok(slider.classList.contains('ui-slider-input'), 'Slider has ui-slider-input class');
    });

    test("Slider w/h icon", function() {
        var sliderBrightness = document.getElementById('slider-3'),
                sliderLoudness = document.getElementById('slider-4');

        window.tau.engine.createWidgets(document.getElementById('qunit-fixture'));

        equal(sliderBrightness.getAttribute('data-tau-bound'), "TizenSlider", "Slider widget is created");
        equal(sliderBrightness.getAttribute('data-icon'), "bright", "Slider has brightness icon");
        ok(sliderBrightness.classList.contains('ui-slider-input'), 'Slider has ui-slider-input class');

        equal(sliderLoudness.getAttribute('data-tau-bound'), "TizenSlider", "Slider widget is created");
        equal(sliderLoudness.getAttribute('data-icon'), "volume", "Slider has loudness icon");
        ok(sliderLoudness.classList.contains('ui-slider-input'), 'Slider has ui-slider-input class');
    });

    test("Slider without highlight", function() {
        var slider = document.getElementById('slider-5');

        window.tau.engine.createWidgets(document.getElementById('qunit-fixture'));

        equal(slider.getAttribute('data-tau-bound'), "TizenSlider", "Slider widget is created");
        equal(slider.getAttribute('data-highlight'), "false", "Slider has data-highlight set false");
        ok(slider.classList.contains('ui-slider-input'), 'Slider has ui-slider-input class');
    });

    test("Slider - focus & blur", function() {
        var slider = document.getElementById('slider-2'),
                sliderContainer,
                widget;

        window.tau.engine.createWidgets(document.getElementById('qunit-fixture'));
        sliderContainer = document.getElementById('slider-2-container');
        widget = window.tau.engine.getBinding(slider, "TizenSlider");

        ok(!sliderContainer.classList.contains('ui-focus'), 'Slider is not focused');
        widget._callbacks.onFocus();
        ok(sliderContainer.classList.contains('ui-focus'), 'Slider is focused');
        widget._callbacks.onBlur();
        ok(!sliderContainer.classList.contains('ui-focus'), 'Slider is blured');
    });

    test("Slider - showPopup", function() {
        var slider = document.getElementById('slider-2'),
                widget,
                keyDownEvent = jQuery.Event("keydown"),
                keyUpEvent = jQuery.Event("keyup"),
                popups,
                ctxpopup;

        window.tau.engine.createWidgets(document.getElementById('qunit-fixture'));
        widget = window.tau.engine.instanceWidget(slider, "TizenSlider");
        keyDownEvent.keyCode = 13;
        keyUpEvent.keyCode = 13;

        widget._callbacks.onKeydown(keyDownEvent);
        widget._callbacks.onKeyup(keyUpEvent);
        popups = document.getElementsByClassName('ui-popup');
        equal(popups.length, 1, "There is new popup");
        ctxpopup = popups[0];
        ok(ctxpopup.classList.contains('ui-ctxpopup'), 'Popup has ui-ctxpopup class after entering');
        ok(ctxpopup.classList.contains('ui-popup-arrow-t'), 'Popup has ui-popup-arrow-t class after entering');

        equal(ctxpopup.firstChild.innerText, slider.value, "Value displayed is the same as slider value");
    });

    test("Slider - destroy", function() {
        var slider = document.getElementById('slider-1'),
                widget;

        window.tau.engine.createWidgets(document.getElementById('qunit-fixture'));
        widget = window.tau.engine.instanceWidget(slider, "TizenSlider");

        window.tau.engine.destroyWidget(slider, "TizenSlider");
        widget = window.tau.engine.getBinding(slider, "TizenSlider");
        ok(widget === null, "Slider has been destroyed");
    });

    test("Slider - keys", function() {
        var slider = document.getElementById('slider-1'),
                widget,
                keyDownEvent = jQuery.Event("keydown"),
                keyUpEvent = jQuery.Event("keyup");

        window.tau.engine.createWidgets(document.getElementById('qunit-fixture'));
        widget = window.tau.engine.instanceWidget(slider, "TizenSlider");
        keyDownEvent.keyCode = 13;
        keyUpEvent.keyCode = 13;

        ok(!widget.status, "Status is false");
        widget._callbacks.onKeydown(keyDownEvent);
        widget._callbacks.onKeyup(keyUpEvent);
        ok(widget.status, "Status is true");
        widget._callbacks.onKeydown(keyDownEvent);
        widget._callbacks.onKeyup(keyUpEvent);
        ok(!widget.status, "Status is false");
    });
}(document, window.tau));