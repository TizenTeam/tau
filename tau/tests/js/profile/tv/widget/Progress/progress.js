page = document.getElementById('test_progress_page');
page.addEventListener("pageshow", function() {
    "use strict";

    module("widget.tv.Slider TV Slider widget", {});

    test("Progress - infinite bar", function() {
        ej.engine.createWidgets(document);
        var progress = document.getElementById('progress-1');

        equal(progress.getAttribute('data-tau-bound'), "Progress", "Progress widget is created");
        equal(progress.getAttribute('data-tau-built'), "Progress", "Progress widget is built");
        equal(progress.getAttribute('data-tau-name'), "Progress", "Progress is set as data-tau-name");
        equal(progress.getAttribute('data-appeariance'), "bar", "Progress widget is a bar");
        equal(progress.getAttribute('data-infinite'), "true", "Progress widget is infinite");
        equal(progress.getAttribute('max'), "100", "Proper max ");
        equal(progress.getAttribute('value'), "100", "Progress widget is infinite");
        ok(progress.classList.contains('ui-progress-indeterminate'), 'Progress has ui-progress-indeterminate class');
    });

    test("Progress - simpliest finite bar", function() {
        ej.engine.createWidgets(document);
        var progress = document.getElementById('progress-2');

        equal(progress.getAttribute('data-tau-bound'), "Progress", "Progress widget is created");
        equal(progress.getAttribute('data-tau-built'), "Progress", "Progress widget is built");
        equal(progress.getAttribute('data-tau-name'), "Progress", "Progress is set as data-tau-name");
        equal(progress.getAttribute('max'), "100", "Proper max ");
        equal(progress.getAttribute('value'), "90", "Progress widget is infinite");
    });

    test("Progress - circle", function() {
        ej.engine.createWidgets(document);
        var progress = document.getElementById('progress-3');

        equal(progress.getAttribute('data-appeariance'), "circle", "Progress widget is a circle");
        ok(progress.classList.contains('ui-progress-processing'), 'Progress has ui-progress-processing class');
    });

    test("Progress - disabled progress bar", function() {
        ej.engine.createWidgets(document);
        var progress = document.getElementById('progress-4');

        equal(progress.getAttribute('data-tau-bound'), "Progress", "Progress widget is created");
        equal(progress.getAttribute('data-tau-built'), "Progress", "Progress widget is built");
        equal(progress.getAttribute('data-tau-name'), "Progress", "Progress is set as data-tau-name");
        equal(progress.getAttribute('min'), "0", "Progress widget has minimum");
        equal(progress.getAttribute('value'), "20", "Progress widget is infinite");
        equal(progress.getAttribute('max'), "100", "Progress widget has maximum");
        equal(progress.getAttribute('disabled'), "disabled", "Progress widget is disabled");
        ok(progress.classList.contains('ui-progress-controllable'), 'Progress has ui-progress-controllable class');
        ok(progress.classList.contains('disabled'), 'Progress has disabled class');
    });

    test("Progress - progress bar", function() {
        ej.engine.createWidgets(document);
        var progress = document.getElementById('progress-5');

        equal(progress.getAttribute('data-tau-bound'), "Progress", "Progress widget is created");
        equal(progress.getAttribute('data-tau-built'), "Progress", "Progress widget is built");
        equal(progress.getAttribute('data-tau-name'), "Progress", "Progress is set as data-tau-name");
        equal(progress.getAttribute('min'), "0", "Progress widget has minimum");
        equal(progress.getAttribute('value'), "50", "Progress widget is infinite");
        equal(progress.getAttribute('max'), "100", "Progress widget has maximum");
        ok(progress.classList.contains('ui-progress-controllable'), 'Progress has ui-progress-controllable class');
    });

    test("Progress - _setValue & _getValue", function() {
        ej.engine.createWidgets(document);
        var progress = document.getElementById('progress-4'),
                widget = ej.engine.getBinding(progress, "Progress");

        widget._setValue(1);
        equal(widget._getValue(), 1, "Progress has working getter and setter for value.");
    });

    test("Progress - focus & blur", function() {
        ej.engine.createWidgets(document);
        var progress = document.getElementById('progress-5'),
                widget = ej.engine.getBinding(progress, "Progress");

        ok(!progress.classList.contains('ui-focus'), 'There is no focus prior to using focus function');
        widget.focus();
        ok(progress.classList.contains('ui-focus'), 'Focus function works. Before blur function.');
        widget.blur();
        ok(!progress.classList.contains('ui-focus'), 'Blur function works');
    });
}(window.tau));

//focus blur