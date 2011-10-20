// tracks progressbar update intervals to ensure each is not
// added more than once to any single progress bar
var progressbarAnimator = {
	intervals: {},
	justIntervals: [], // retained to make it easier to clear the intervals

	// pause: pause in ms between updates
	updateProgressBar: function (progressbarToUpdate, pause) {
		var id = progressbarToUpdate.attr('id');

		if (this.intervals[id]) {
			return;
		}

		var interval = setInterval(function () {
			var now = (new Date()).getTime();

			var progress = progressbarToUpdate.progressbar('value');
			progress++;

			if (progress > 100) {
				progress = 0;
			}
			progressbarToUpdate.progressbar('value', progress);
		}, pause);

		this.intervals[id] = interval;
		this.justIntervals.push(interval);
	   },

	updateProgressPending: function (progressbarToUpdate, pause) {
	       var id = progressbarToUpdate.attr('id');

	       if (this.intervals[id]) {
		       return;
	       }

	       progressbarToUpdate.progress_pending('start');

	       var pending_cb = function () {
		       progressbarToUpdate.progress_pending('hide');
		       progressbarToUpdate.progress_pending('increase');
		       progressbarToUpdate.progress_pending('show');
	       };

	       var interval = setInterval(pending_cb, pause);

	       this.intervals[id] = interval;
	       this.justIntervals.push(interval);
       },


	clearIntervals: function () {
		for (var i = 0; i < this.justIntervals.length; i++) {
			clearInterval(this.justIntervals[i]);
		}

		this.intervals = {};
	}
};

$(document).bind("pagecreate", function () {
    $('#spinner-demo').bind('pageshow', function (e) {
        $(this).find('li').each(function (index, element) {
            var randomWait = 500 * (Math.floor(Math.random() * 6) + 4);

            $(element).text("I am processing");

            $(element).bind('stopped', function () {
                $(element).text("I am done!");
            });

            $(element).spinner('start');

            setTimeout(function () {
                $(element).spinner('stop');
            }, randomWait);
        });
    });

    $('#spinnerbar-demo').bind('pageshow', function () {
        $(this).find(':jqmData(processing="spinnerbar")').each(function (index, element) {
            var randomWait = 500 * (Math.floor(Math.random() * 6) + 4);

            $(element).text("")

            $(element).bind('stopped', function () {
                $(element).text("I am done!");
            });

            $(element).spinnerbar('start');

            setTimeout(function () {
                $(element).spinnerbar('stop');
            }, randomWait);
        });
    });

    $('#scroller-demo').bind('pageshow', function (e) {
        $page = $(e.target);
        /*
         * many options cannot be set without subclassing since they're
         * used in the _create method - it seems as if these are for
         * internal use only and scrollDuration is only changable by
         * chance.
         */
        var $scroller2List = $('#scroller2').find('ul');
        $scroller2List.scrollview('option','scrollDuration','10000');

        // only works by manipulating css
        // the only other way is to use attribute 'scroll-method="scroll"' in html
        $('#scroller2 .ui-scrollbar').css('visibility','hidden');

        /*
         * make toggle button switch scroll bars on and off
         */
        var scrollBarVisible = $('#scroller2').find('.ui-scrollbar').css('visibility')==="visible";

        var $toggleScrollBars = $('#toggleScrollBars');
        $toggleScrollBars.attr("checked",scrollBarVisible).checkboxradio("refresh");
        /* the 'label' is the thing that is clicked, not the input element */
        var $label = $toggleScrollBars.siblings('label').attr('for','#toggleScrollBars');
        $label.bind("click", function() {
            var $scrollBar = $('#scroller2').find('.ui-scrollbar');
            var scrollBarVisible = $scrollBar.css('visibility')==="visible";
            var newVisibility = scrollBarVisible?"hidden":"visible";
            $scrollBar.css('visibility',scrollBarVisible?"hidden":"visible");
        })
    });
    
    $("#demo-date").bind("date-changed", function(e, newDate) { 
        $("#selected-date1").text(newDate.toString());
    });    
    $("#demo-date2").bind("date-changed", function(e, newDate) { 
        $("#selected-date2").text(newDate.toString());
    });
    $("#demo-date3").bind("date-changed", function(e, newDate) { 
        $("#selected-date3").text(newDate.toString());
    });


	$("#colorpicker-demo").bind("pagebeforeshow", function() {
	  $("#hsvpicker").bind("colorchanged", function(e, clr) {
		$("#colortitle").colortitle("option", "color", clr);
		$("#colorpalette").colorpalette("option", "color", clr);
	  });
	  $("#colortitle").bind("colorchanged", function(e, clr) {
		$("#hsvpicker").hsvpicker("option", "color", clr);
		$("#colorpalette").colorpalette("option", "color", clr);
	  });
	  $("#colorpalette").bind("colorchanged", function(e, clr) {
		$("#hsvpicker").hsvpicker("option", "color", clr);
		$("#colortitle").colortitle("option", "color", clr);
	  });
	  $("#colortitle").colortitle("option", "color", "#54a12d");
	});

    $('#progressbar-demo').bind('pageshow', function (e) {
        progressbarAnimator.updateProgressBar($(this).find('#progressbar'), 200);
        progressbarAnimator.updateProgressPending($(this).find('#pending'), 500);
    });

    $('#progressbar-demo').bind('pagehide', function (e) {
        progressbarAnimator.clearIntervals();
    });

    $('#groupindex-demo').bind('pageshow', function () {
        $('#groupindex').scrolllistview();
    });
    $("#popupwindow-demo").bind("pageshow", function() {
      $('#popupwindow-demo-transition-' + $("#popupContent2").popupwindow("option", "transition"))
        .attr("checked", "true")
        .checkboxradio("refresh");

        progressbarAnimator.updateProgressBar($(this).find('#progressbar'), 200);
    });
    $('input[name=popupwindow-demo-transition-choice]').bind("change", function(e) {
      $("#popupContent2").popupwindow("option", "transition", $(this).attr("id").split("-").pop());
    });

    $("#showVolumeButton").bind("vclick", function (e) {
        $("#myVolumeControl").volumecontrol("open");
    });
    $("#volumecontrol_setBasicTone").bind("change", function(e) {
      var basicTone = !($("#volumecontrol_setBasicTone").next('label').find(".ui-icon").hasClass("ui-icon-checkbox-on"));

      if (basicTone) {
        $("#myVolumeControl").volumecontrol("option", "basicTone", true);
        $("#myVolumeControl").volumecontrol("option", "title", "Basic Tone");
      }
      else {
        $("#myVolumeControl").volumecontrol("option", "basicTone", false);
        $("#myVolumeControl").volumecontrol("option", "title", "Volume");
      }
    });
});

$(document).bind("pagecreate", function() {
    var button = $('#calendarbutton');
    button.bind('vclick', function (e) {
        button.calendarpicker('open');
        button.unbind('selectedDate').bind('selectedDate',function(e,val) {
            $('#selectedCalendarDate').attr('value',val);
        });
    });
});
