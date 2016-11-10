(function (tau) {
	"use strict";

	var uiControls = null,
		uiTrack = null,
		uiControlsTimeout = 2000,
		uiTrackTimeout = 3000,
		uiControlsTimeoutStart = 0,
		currentTime = 0,
		progressBarWidget = null,
		progressBarValue = 0,
		playing = false;

	window.addEventListener( "tizenhwkey", function( ev ) {
		if( ev.keyName === "back" ) {
			var activePopup = document.querySelector( ".ui-popup-active" ),
				page = document.getElementsByClassName( "ui-page-active" )[0],
				pageid = page ? page.id : "";

			if( pageid === "player" && !activePopup ) {
				/* eslint-disable no-empty */
				try {
					tizen.application.getCurrentApplication().exit();
				} catch (ignore) {}
				/* eslint-enable */
			} else {
				window.history.back();
			}
		}
	});

	function handleClick(event) {
		if (event.target.classList.contains("ui-play-pause") && uiControls.classList.contains("visible")) {
			playing = !playing;
			event.target.textContent = playing ? "Pause" : "Play";
		} else {
			if (uiControls && uiControls.classList.contains("visible") === false) {
				uiControls.classList.add("visible");
			}
			if (uiTrack && uiTrack.classList.contains("visible") === false) {
				uiTrack.classList.add("visible");
			}
		}
		if (playing) {
			uiControlsTimeoutStart = currentTime;
		}
	}

	function render(timestamp) {
		currentTime = timestamp;
		if (progressBarWidget) {
			if (playing) {
				progressBarValue += 0.1;
				if (progressBarValue > 100) {
					progressBarValue = 0;
				}
				progressBarWidget.value(progressBarValue);
			}
		}

		if (!playing) {
			uiControlsTimeoutStart = timestamp;
		} else {
			if (uiControls && uiControls.classList.contains("visible") && uiControlsTimeout < timestamp - uiControlsTimeoutStart) {
				uiControls.classList.remove("visible");
			}
			if (uiTrack && uiTrack.classList.contains("visible") && uiTrackTimeout < timestamp - uiControlsTimeoutStart) {
				uiTrack.classList.remove("visible");
			}
		}

		window.requestAnimationFrame(render);
	}

	function init() {
		var progressBar = document.querySelector(".ui-circle-progress");

		progressBarWidget = new tau.widget.CircleProgressBar(progressBar, {size: "full"});
		uiControls = document.querySelector(".ui-video-player .ui-controls");
		uiControlsTimeout = parseInt(uiControls.dataset.timeout, 10) || uiControlsTimeout;
		uiTrack = document.querySelector("footer");
		uiTrackTimeout = parseInt(uiTrack.dataset.timeout, 10) || uiTrackTimeout;

		// emualtion of track progress
		window.requestAnimationFrame(render);
	}

	document.addEventListener("DOMContentLoaded", init, false);
	document.addEventListener("click", handleClick, false);

}(window.tau));
