(function() {
    var page = document.getElementById("gallery-page"),
        addBtn = document.getElementById("add"),
        deleteBtn = document.getElementById("delete"),
        sectionChangerElement = document.getElementById("gallerySection"),
        sectionChangerWidget,
        deleteBtnWidget,
        pageShowHandler,
        pageHideHandler,
        sections,
        sectionsLength,
        sectionsParentNode,
        indexAddImage = 0;

    function addImage () {
        var newSectionElement = document.createElement("section");
        newSectionElement.className = "gallery-section";
        newSectionElement.innerHTML = "<img src='images/add" + indexAddImage + ".jpg'>";

        sectionsParentNode.appendChild(newSectionElement);
        sectionChangerWidget.refresh();
        sectionChangerWidget.setActiveSection(sections.length);

        resetChildSectionInfo();
        deleteBtnWidget.enable();

        indexAddImage = (indexAddImage+1) % 4;
    }

    function deleteImage () {
        var activeIndex = sectionChangerWidget.getActiveSectionIndex();

        sectionsParentNode.removeChild(sections[activeIndex]);
        sectionChangerWidget.refresh();
        resetChildSectionInfo();

        if (sectionsLength == 1) {
            deleteBtnWidget.disable();
        }
    }

    function unbindEvents() {
        page.removeEventListener("pageshow", pageShowHandler);
        page.removeEventListener("pagehide", pageHideHandler);
        addBtn.removeEventListener("vclick", addImage);
        deleteBtn.removeEventListener("vclick", deleteImage);
    }
    function bindEvents() {
        addBtn.addEventListener("vclick", addImage);
        deleteBtn.addEventListener("vclick", deleteImage);
    }

    function resetChildSectionInfo () {
        sections = sectionChangerElement.querySelectorAll(".gallery-section");
        sectionsLength = sections.length;
    }

    pageShowHandler = function () {
        bindEvents();
        sectionChangerWidget = tau.widget.SectionChanger(sectionChangerElement);
        deleteBtnWidget = tau.widget.Button(deleteBtn);
        resetChildSectionInfo();
        sectionsParentNode = sections[0].parentNode;
    };
    
    pageHideHandler = function () {
        unbindEvents();
        sectionChangerWidget.destroy();
        deleteBtnWidget.destroy();
    };
    page.addEventListener("pageshow", pageShowHandler, false);
    page.addEventListener("pagehide", pageHideHandler, false);
}());
