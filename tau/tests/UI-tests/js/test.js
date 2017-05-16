/* global $, resemble */
$(function () {
	var testData = window.location.hash.substr(1).split("/"),
		resembleControl,
		buttons = $(".buttons button");

	function onComplete(mode, data) {
		var diffImage = new Image(),
			color = "red",
			percent = parseFloat(data.misMatchPercentage);

		if (mode === "show") {
			diffImage.src = data.getImageDataUrl();

			$("#image-diff").html(diffImage);

			$(".buttons").show();

			if (data.misMatchPercentage == 0) {
				$("#thesame").show();
				$("#diff-results").hide();
			} else {
				$("#mismatch").text(data.misMatchPercentage);
				if (!data.isSameDimensions) {
					$("#differentdimensions").show();
				} else {
					$("#differentdimensions").hide();
				}
				$("#diff-results").show();
				$("#thesame").hide();
			}
		} else {
			if (data.misMatchPercentage === "0.00") {
				color = "green";
			} else if (percent < 10) {
				color = "gold";
			} else if (percent < 25) {
				color = "darkorange";
			}
			$("#" + mode).text(data.misMatchPercentage).css("background-color", color);
		}
	}


	buttons.click(function () {
		var $this = $(this);

		$this.parent(".buttons").find("button").removeClass("active");
		$this.addClass("active");

		if ($this.is("#raw")) {
			resembleControl.ignoreNothing();
		}		else
		if ($this.is("#less")) {
			resembleControl.ignoreLess();
		}
		if ($this.is("#colors")) {
			resembleControl.ignoreColors();
		}		else
		if ($this.is("#antialising")) {
			resembleControl.ignoreAntialiasing();
		}		else
		if ($this.is("#same-size")) {
			resembleControl.scaleToSameSize();
		}		else
		if ($this.is("#original-size")) {
			resembleControl.useOriginalSize();
		}		else
		if ($this.is("#pink")) {
			resemble.outputSettings({
				errorColor: {
					red: 255,
					green: 0,
					blue: 255
				}
			});
			resembleControl.repaint();
		}		else
		if ($this.is("#yellow")) {
			resemble.outputSettings({
				errorColor: {
					red: 255,
					green: 255,
					blue: 0
				}
			});
			resembleControl.repaint();
		}		else
		if ($this.is("#flat")) {
			resemble.outputSettings({
				errorType: "flat"
			});
			resembleControl.repaint();
		}		else
		if ($this.is("#movement")) {
			resemble.outputSettings({
				errorType: "movement"
			});
			resembleControl.repaint();
		}		else
		if ($this.is("#flatDifferenceIntensity")) {
			resemble.outputSettings({
				errorType: "flatDifferenceIntensity"
			});
			resembleControl.repaint();
		}		else
		if ($this.is("#movementDifferenceIntensity")) {
			resemble.outputSettings({
				errorType: "movementDifferenceIntensity"
			});
			resembleControl.repaint();
		}		else
		if ($this.is("#opaque")) {
			resemble.outputSettings({
				transparency: 1
			});
			resembleControl.repaint();
		}		else
		if ($this.is("#transparent")) {
			resemble.outputSettings({
				transparency: 0.3
			});
			resembleControl.repaint();
		}
	});

	function show(profile, testName) {
		$("#dropzone1").html("<img src=\"result/" + profile + "/" + testName + ".png\"/>");
		$("#dropzone2").html("<img src=\"images/" + profile + "/" + testName + ".png\"/>");
		load(profile, testName, "show");
	}

	function load(profile, testName, mode) {
		var xhr = new XMLHttpRequest(),
			xhr2 = new XMLHttpRequest(),
			done = $.Deferred(),
			dtwo = $.Deferred();

		xhr.open("GET", "result/" + profile + "/" + testName + ".png", true);
		xhr.responseType = "blob";
		xhr.onload = function () {
			done.resolve(this.response);
		};
		xhr.send();

		xhr2.open("GET", "images/" + profile + "/" + testName + ".png", true);
		xhr2.responseType = "blob";
		xhr2.onload = function () {
			dtwo.resolve(this.response);
		};
		xhr2.send();

		$.when(done, dtwo).done(function (file, file1) {
			resembleControl = resemble(file).compareTo(file1).onComplete(onComplete.bind(null, mode || testName));
		});

		return false;
	}

	(function () {
		var xhr = new XMLHttpRequest(),
			xhr2 = new XMLHttpRequest(),
			done = $.Deferred(),
			dtwo = $.Deferred();

		xhr.open("GET", "app/mobile/_screenshots.json", true);
		xhr.onload = function () {
			var tests = JSON.parse(this.responseText);

			done.resolve(tests.map(function (item) {
				item.profile = "mobile";
				return item;
			}));
		};
		xhr.send();

		xhr2.open("GET", "app/wearable/_screenshots.json", true);
		xhr2.onload = function () {
			var tests = JSON.parse(this.responseText);

			dtwo.resolve(tests.map(function (item) {
				item.profile = "wearable";
				return item;
			}));
		};
		xhr2.send();

		$.when(done, dtwo).done(function (mobileTests, wearableTests) {
			var tests = mobileTests.concat(wearableTests);

			$("#list").html(tests.map(function (test) {
				load(test.profile, test.name);

				return "<a href='#" + test.profile + "/" + test.name + "'>" + test.name + " <span class='badge'>" + test.profile[0] + "</span> <span class='badge' id='" + test.name + "'></span></a>";
			}).join(""));
		});

		window.onhashchange = function () {
			var testData = window.location.hash.substr(1).split("/"),
				profile = testData[0],
				testName = testData[1];

			show(profile, testName);
		};
	}());

});