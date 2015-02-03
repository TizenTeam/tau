page = document.getElementById('test_progress_page');
page.addEventListener("pageshow", function() {
    "use strict";

    module("profile/tv/widget/Progress", {});

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

    test("Progress - _setValue & _getValue", function() {
        ej.engine.createWidgets(document);
        var progress = document.getElementById('progress-2'),
                widget = ej.engine.getBinding(progress, "Progress");

        widget.option("value", 1);
        equal(widget.option("value"), 1, "Progress has working getter and setter for value.");
    });

    test("Progress - focus & blur", function() {
        ej.engine.createWidgets(document);
        var progress = document.getElementById('progress-1'),
                widget = ej.engine.getBinding(progress, "Progress");

        ok(!progress.classList.contains('ui-focus'), 'There is no focus prior to using focus function');
        widget.focus();
        ok(progress.classList.contains('ui-focus'), 'Focus function works. Before blur function.');
        widget.blur();
        ok(!progress.classList.contains('ui-focus'), 'Blur function works');
    });
}(window.tau));

//focus blur