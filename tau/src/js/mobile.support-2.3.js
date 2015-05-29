/*global define, ns */
/**
 * #Tizen Advanced UI Framework Backward compatibility
 *
 * TAU framework Tizen 2.4 version has many changed feature for example component naming, API and structure.
 * But, We need to support previous version so we divide to previous support file and current version support file.
 * This file has previous support files.
 *
 * @class ns
 * @title Tizen Advanced UI Framework
 */
//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
(function (ns) {
	"use strict";
	define(
		[
			"require",
			"support/mobile/widget/Checkboxradio",
			"support/mobile/widget/ToggleSwitch.extra",
			"support/mobile/widget/DropdownMenu.extra",
			"support/mobile/widget/Progress.extra",
			"support/mobile/widget/Listview.extra",
			"support/mobile/widget/ExtendableList",
			"support/mobile/widget/ListviewAutodivider",
			"support/mobile/widget/Collapsible.extra",
			"support/mobile/widget/Collapsibleset.extra",
			"support/mobile/widget/Slider.extra",
			"support/mobile/widget/TizenSlider.extra",
			"support/mobile/widget/TextInput.extra"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			ns.info.profile = "mobile";
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
}(ns));
//>>excludeEnd("tauBuildExclude");
