$("#popupwindow-demo").bind("pageshow", function() {
      $('#popupwindow-demo-transition-' + $("#popupContent2").popupwindow("option", "transition"))
        .attr("checked", "true")
        .checkboxradio("refresh");

	$(this).find('#progressbar').progressbar('start');
});

$('input[name=popupwindow-demo-transition-choice]').bind("change", function(e) {
      $("#popupContent2").popupwindow("option", "transition", $(this).attr("id").split("-").pop());
});


