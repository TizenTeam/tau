<?php
$type = 'text/javascript';

// 3rd party
$thirdFiles = array(
	'jquery.easing.1.3.js',
	'jquery.tmpl.js',
	'globalize.js',
	'gl-matrix.js'
);

$jqmPath = "jquery-mobile-1.2.0/js";
$files = array(
	'../LICENSE-INFO.txt',
	// note that define is only included here as a means
	// to revert to the pre async include, and should not be
	// used in other build methods
	'jquery.mobile.define.js',
	'jquery.ui.widget.js',
	'jquery.mobile.core.js',
	'jquery.mobile.widget.js',
	'jquery.mobile.media.js',
	'jquery.mobile.support.touch.js',
	'jquery.mobile.support.orientation.js',
	'jquery.mobile.support.js',
	'jquery.mobile.vmouse.js',
	'events/touch.js',
	'events/throttledresize.js',
	'events/orientationchange.js',
	'jquery.hashchange.js',
	'widgets/page.js',
	'widgets/loader.js',
	'jquery.mobile.navigation.js',
	'jquery.mobile.navigation.pushstate.js',
	'jquery.mobile.transition.js',
	'transitions/pop.js',
	'transitions/slide.js',
	'transitions/slidedown.js',
	'transitions/slideup.js',
	'transitions/flip.js',
	'transitions/flow.js',
	'transitions/turn.js',
	'jquery.mobile.degradeInputs.js',
	'widgets/dialog.js',
	'widgets/page.sections.js',
	'widgets/collapsible.js',
	'widgets/collapsibleSet.js',
	'jquery.mobile.fieldContain.js',
	'jquery.mobile.grid.js',
	'widgets/navbar.js',
	'widgets/listview.js',
	'widgets/listview.filter.js',
	'widgets/listview.autodividers.js',
	'jquery.mobile.nojs.js',
	'widgets/forms/checkboxradio.js',
	'widgets/forms/button.js',
	'widgets/forms/slider.js',
	'widgets/forms/textinput.js',
	'widgets/forms/select.custom.js',
	'widgets/forms/select.js',
	'jquery.mobile.buttonMarkup.js',
	'jquery.mobile.controlGroup.js',
	'jquery.mobile.links.js',
	'widgets/fixedToolbar.js',
	'widgets/popup.js',
	'jquery.mobile.zoom.js',
	'jquery.mobile.zoom.iosorientationfix.js',
	'jquery.mobile.init.js'
);

// Get the filetype and array of files
if ( ! isset($type) || ! isset($files) || ! isset($thirdFiles) )
{
	echo '$type and $files must be specified!';
	exit;
}

$thirdContents = '';
// Loop through the files adding them to a string
foreach ( $thirdFiles as $file ) {
	$content = file_get_contents($file). "\n\n";
	$thirdContents .= preg_replace('/^\/\/>>excludeStart\(.*?\);.*?^\/\/>>excludeEnd\(.*?\);/msi', "", $content);
}

$contents = 'var __version__ = "dev";';
foreach ( $files as $file ) {
	$content = file_get_contents($jqmPath."/".$file). "\n\n";
	$contents .= preg_replace('/^\/\/>>excludeStart\(.*?\);.*?^\/\/>>excludeEnd\(.*?\);/msi', "", $content);
}

// Set the content type, filesize and an expiration so its not cached
header('Content-Type: ' . $type);
header('Content-Length: ' . (strlen($thirdContents) + strlen($contents)));
header('Expires: Fri, 01 Jan 2010 05:00:00 GMT');

// Deliver the file
echo $thirdContents;
echo $contents;
