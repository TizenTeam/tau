(function() {

        module("profile/tv/widget/Button", {});

        test("Button", function() {
            var button = document.getElementById('button-0');

            tau.widget.Button(button);

            equal(button.getAttribute('data-tau-built'), "Button", "Button widget is built");
            equal(button.getAttribute('data-tau-bound'), "Button", "Button widget is bound");
            equal(button.getAttribute('data-role'), "button", "Button has proper data-role");
            equal(button.getAttribute('aria-disabled'), "false", "Button is enabled");
            equal(button.getAttribute('data-tau-name'), "Button", "Button has correct widget name");

            ok(button.classList.contains('ui-btn'), 'Button has ui-btn class');
            ok(button.classList.contains('ui-btn-box-s'), 'Button has ui-btn-box-s class');
            ok(button.classList.contains('ui-shadow'), 'Button has ui-shadow class');
            ok(button.classList.contains('ui-btn-up-s'), 'Button has ui-btn-up-s class');

            equal(button.childElementCount, 2, "Button has 2 children");
            var innerSpan = button.childNodes[1];
            ok(innerSpan.classList.contains('ui-btn-inner'), 'Span has ui-btn-inner class');
            ok(innerSpan.classList.contains('ui-btn-hastxt'), 'Span has ui-btn-hastxt class');

            equal(innerSpan.childElementCount, 1, "inner span has one children");
            var deepSpan = innerSpan.childNodes[0];
            ok(deepSpan.classList.contains('ui-btn-text'), 'Span has ui-btn-text class');
        });

        test("Inline Button", function() {
            var button = document.getElementById('button-1');

            tau.widget.Button(button);

            equal(button.getAttribute('data-tau-bound'), "Button", "Button widget is created");
            ok(button.classList.contains('ui-btn'), 'Button has ui-btn class');
            ok(button.classList.contains('ui-btn-inline'), 'Button has ui-btn-inline class');
            ok(button.getAttribute('data-inline'), true, 'Button is inline');
        });

        test("Disabled Button", function() {
            var button = document.getElementById('button-3');

            tau.widget.Button(button);

            equal(button.getAttribute('data-tau-bound'), "Button", "Button widget is created");
            ok(button.classList.contains('ui-btn'), 'Button has ui-btn class');
            ok(button.classList.contains('ui-disabled'), 'Button has ui-disabled class');
            ok(button.getAttribute('disabled'), 'disabled', 'Button is disabled');
        });

        test("Stock icon Button", function() {
            var button = document.getElementById('button-4');

            tau.widget.Button(button);

            equal(button.getAttribute('data-tau-bound'), "Button", "Button widget is created");
            ok(button.classList.contains('ui-btn'), 'Button has ui-btn class');
            ok(button.classList.contains('ui-btn-icon-top'), 'Button has ui-btn-icon-top class');
        });

        test("Destroy Button", function() {
            var button = document.getElementById('button-4'),
                widget;
            widget = tau.engine.instanceWidget(button, "Button");
            ok(widget !== null, "Button is present");

            widget.destroy(button, "Button");
            widget = tau.engine.getBinding(button, "Button");
            ok(widget === null, "Button has been destroyed");
        });
}());