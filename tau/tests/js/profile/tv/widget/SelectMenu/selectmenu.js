(function() {
    "use strict";
    module("profile/tv/widget/SelectMenu", {});

    test("SelectMenu TV standard", function() {
        var selectTag = document.getElementById('select-custom-1'),
            widget = tau.widget.SelectMenu(selectTag),
            id = selectTag.id,
            placeHolder = document.getElementById(id+"-placeholder"),
            options = document.getElementById(id+"-options"),
            wrapper = document.getElementById(id+"-selectmenu"),
            changeValue = options.children[3],
            screenFilter = document.getElementById(id+"-screen");

        ok(wrapper.classList.contains("ui-selectmenu"), 'SelectMenu wrapper has ui-selectmenu class');
        ok(placeHolder.classList.contains("ui-selectmenu-placeholder"), "Placeholder has ui-selectmenu-placeholder class");
        ok(options.classList.contains("ui-selectmenu-options"), "Options container has ui-selectmenu-options class");
        ok(!screenFilter, "Screen Filter not exists");

    });
}());