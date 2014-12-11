(function(document, tau) {
    "use strict";
    module("ns.widget.tv.BaseKeyboardSupport Keyboard Support", {});
    var engine = tau.engine,
        keyboardSupport = tau.widget.tv.BaseKeyboardSupport;

    test("BaseKeyboardSupport basic functions test", function () {
        var input = document.getElementById("input-1"),
            button = document.getElementById("button"),
            page = document.getElementById("page"),
            pageWidget = engine.instanceWidget(page, "page"),
            inputWidget = engine.instanceWidget(input, "TextInput"),
            buttonWidget = engine.instanceWidget(button, "Button"),
            links;

        equal(inputWidget.getActiveSelector().indexOf(".ui-input-text")>=0, true, "Selector contains .ui-input-text");

        inputWidget.enableKeyboardSupport();
        buttonWidget.enableKeyboardSupport();
        equal(inputWidget._supportKeyboard, true, "Keyboard support is turned on properly")

        links = pageWidget._getNeighborhoodLinks();
        ok(links.top instanceof Array, "Neighbour elements is array.");
        equal(links.top[0], input, "Neighbour elements found on top.");

        inputWidget.disableKeyboardSupport();
        equal(inputWidget._supportKeyboard, false, "Keyboard support is turned off properly");
    });

    test("Registering and removing active selector", function() {
        var input = document.getElementById("input-1"),
            inputWidget = engine.instanceWidget(input, "TextInput"),
            selector = ".TEST_SELECTOR_CLASS",
            oldSelector,
            newSelector;
        oldSelector = inputWidget.getActiveSelector();
        keyboardSupport.registerActiveSelector(selector);
        newSelector = inputWidget.getActiveSelector();
        notEqual(newSelector, oldSelector, "Something was added to active selector");
        notEqual(newSelector.search(selector), -1, "Test selector has been added to active selector");
        keyboardSupport.unregisterActiveSelector(selector);
        equal(inputWidget.getActiveSelector(), oldSelector, "Selector has been successfully removed")
    });

    test("Events", function() {
        var input = document.getElementById("input-1"),
            inputWidget = engine.instanceWidget(input, "TextInput"),
            body = document.getElementsByTagName("body")[0],
            eventUp = document.createEvent("KeyboardEvent"),
            initMethod = typeof eventUp.initKeyboardEvent !== 'undefined' ? "initKeyboardEvent" : "initKeyEvent",
            focused,
            titleLink = document.getElementsByTagName("a")[0];

        eventUp[initMethod](
                   "keyup", // event type : keydown, keyup, keypress
                    true, // bubbles
                    true, // cancelable
                    window, // viewArg: should be window
                    false, // ctrlKeyArg
                    false, // altKeyArg
                    false, // shiftKeyArg
                    false, // metaKeyArg
                    40,// keyCodeArg : unsigned long the virtual key code, else 0
                    40 // charCodeArgs : unsigned long the Unicode character associated with the depressed key, else 0
        );
        eventUp.keyCode = 40;
        inputWidget.enableKeyboardSupport();

        keyboardSupport.focusElement(body, input);
        input.dispatchEvent(eventUp);
        focused = document.querySelector(":focus") || document.activeElement;
        equal(focused.className.indexOf("ui-input-text")>=0, true, "Element is properly focused");

        keyboardSupport.blurAll();
        keyboardSupport.focusElement(body, input);
        inputWidget._destroyEventKey();
        input.dispatchEvent(eventUp);
        focused = document.querySelector(":focus") || document.activeElement;
        equal(focused, input, "Input has not change it's state");
    });

    test("Focus and blur", function() {
        var titleLink = document.getElementsByTagName("a")[0],
            body = document.getElementsByTagName("body")[0],
            focused;

        keyboardSupport.focusElement(body, titleLink);
        focused = document.querySelector(":focus") || document.activeElement;
        equal(focused, titleLink, "Link is properly focused");
        keyboardSupport.blurAll();
        focused = document.querySelector(":focus") || document.activeElement;
        equal(focused, body, "Page blurred");
    });
}(document, tau));