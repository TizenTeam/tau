(function() {
    "use strict";
    module("profile/tv/widget/SelectMenu", {});

    test("SelectMenu TV standard", function() {
        var selectTag = document.getElementById('select-custom-1'),
            widget = tau.widget.SelectMenu(selectTag),
            id = selectTag.id,
            placeHolder = document.getElementById(id+"-placeholder"),
            options = document.getElementById(id+"-options"),
            wrapper = document.getElementById(id+"-dropdownmenu");

        ok(wrapper.classList.contains("ui-dropdownmenu"), 'SelectMenu wrapper has ui-dropdownmenu class');
        ok(placeHolder.classList.contains("ui-dropdownmenu-placeholder"), "Placeholder has ui-dropdownmenu-placeholder class");
        ok(options.classList.contains("ui-dropdownmenu-options"), "Options container has ui-dropdownmenu-options class");

    });
}());