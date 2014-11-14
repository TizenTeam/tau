(function(document, tau) {
    "use strict";
    module("profile/tv/widget/Page", {});

        test("widget.tv.Page TV specific selectors", function () {
            var pageWidget = document.getElementById('first'),
                header = pageWidget.querySelector('.ui-header'),
                footer = pageWidget.querySelector('.ui-footer');
            ok(header, "Header has been correctly recognized.");
            ok(footer, "Footer has been correctly recognized.");
        });

        test("Page with buttons in header", function () {
            var page = document.getElementById('first'),
                button = document.getElementById('header_btn'),
                header = document.getElementById('main_header'),
                widget = window.tau.engine.instanceWidget(page, "Page");

            ok(widget, "Page has been created");
            ok(header.classList.contains('ui-header'), "Header has been created.");
            ok(button.classList.contains('ui-btn'), "Button has been added to the header.");
        });

        test("Page - destroy", function () {
            var page = document.getElementById('first'),
                widget;
            widget = window.tau.engine.instanceWidget(page, "Page");

            widget.destroy();
            widget = window.tau.engine.getBinding(page, "Page");
            ok(widget === null, "Page has been destroyed");
        });
}(document, window.tau));