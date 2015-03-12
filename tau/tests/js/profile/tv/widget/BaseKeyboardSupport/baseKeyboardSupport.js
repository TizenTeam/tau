(function (document, tau) {
    module("ns.widget.tv.BaseKeyboardSupport Keyboard Support", {});
    var engine = tau.engine,
        keyboardSupport = tau.widget.tv.BaseKeyboardSupport;

    test("BaseKeyboardSupport basic functions test", function () {
        var input = document.getElementById("input-1"),
            button = document.getElementById("button"),
            page = document.getElementById("page"),
            pageWidget = engine.instanceWidget(page, "Page"),
            inputWidget = engine.instanceWidget(input, "TextInput"),
            buttonWidget = engine.instanceWidget(button, "Button"),
            links;

        inputWidget.enableKeyboardSupport();
        buttonWidget.enableKeyboardSupport();
        equal(inputWidget._supportKeyboard, true, "Keyboard support is turned on properly");

        inputWidget.disableKeyboardSupport();
        equal(inputWidget._supportKeyboard, false, "Keyboard support is turned off properly");
    });

    test("Registering and removing active selector", function () {
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

    test("focusElement", function () {
        var button = document.getElementById("input-1"),
            //inputWidget = engine.instanceWidget(input, "TextInput"),
			buttonWidget = engine.instanceWidget(button, "Button"),
            body = document.getElementsByTagName("body")[0],
            eventUp = document.createEvent("KeyboardEvent"),
            initMethod = "initKeyboardEvent",
            focused,
            titleLink = document.getElementsByTagName("a")[0];

		buttonWidget.enableKeyboardSupport();

        keyboardSupport.focusElement(body, button);
        focused = document.querySelector(":focus") || document.activeElement;
        equal(focused, buttonWidget.element, "Element is properly focused");

        keyboardSupport.blurAll();
        keyboardSupport.focusElement(body, 0);
        focused = document.querySelector(":focus") || document.activeElement;
        notEqual(focused, button, "Input has not change it's state");

        keyboardSupport.blurAll();
        keyboardSupport.focusElement(body);
        focused = document.querySelector(":focus") || document.activeElement;
        notEqual(focused, button, "Input has not change it's state");
    });

    if (!window.navigator.userAgent.match("PhantomJS")) {

        function triggerKeyEvent(element, value) {
            var eventUp = document.createEvent("KeyboardEvent");

            Object.defineProperty(eventUp, 'keyCode', {
                get: function () {
                    return this.keyCodeVal;
                }
            });
            Object.defineProperty(eventUp, 'which', {
                get: function () {
                    return this.keyCodeVal;
                }
            });

            eventUp.initKeyboardEvent(
                "keyup", // event type : keydown, keyup, keypress
                true, // bubbles
                true, // cancelable
                window, // viewArg: should be window
                value,// keyCodeArg : unsigned long the virtual key code, else 0
                value,// charCodeArgs : unsigned long the Unicode character associated with the depressed key, else 0
                "", "", false, ""
            );

            eventUp.keyCodeVal = value;

            element.dispatchEvent(eventUp);

        }

        test("Events", function () {
            var input = document.getElementById("input-1"),
                inputWidget = engine.instanceWidget(input, "TextInput"),
                input2 = document.getElementById("input-2"),
                input3 = document.getElementById("input-3"),
                input4 = document.getElementById("input-4"),
                inputWidget2 = engine.instanceWidget(input2, "TextInput"),
                body = document.getElementsByTagName("body")[0],
                focused,
                titleLink = document.getElementsByTagName("a")[0];

            engine.instanceWidget(input3, "TextInput");
            keyboardSupport.registerActiveSelector("[name=input-4]");
            keyboardSupport.blurAll();

            triggerKeyEvent(input, keyboardSupport.KEY_CODES.left);
            focused = document.querySelector(":focus") || document.activeElement;
            equal(focused, input4, "Element is properly focused on input");

            triggerKeyEvent(input, keyboardSupport.KEY_CODES.up);
            focused = document.querySelector(":focus") || document.activeElement;
            equal(focused, input3, "Element is properly focused on label");

            triggerKeyEvent(input, keyboardSupport.KEY_CODES.right);
            focused = document.querySelector(":focus") || document.activeElement;
            equal(focused, input3, "Element is properly focused on input");

            triggerKeyEvent(input, keyboardSupport.KEY_CODES.down);
            focused = document.querySelector(":focus") || document.activeElement;
            equal(focused, input4, "Element is properly focused on label");
            keyboardSupport.unregisterActiveSelector("[name=input-4]");
        });
    }

    test("Focus and blur", function () {
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