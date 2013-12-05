<?php
$type = 'text/javascript';
$files = array(
	'util/ensurens.js',
	'util/range.js',
	'jquery.mobile.tizen.configure.js',
	'jquery.mobile.tizen.core.js',
	'jquery.mobile.tizen.clrlib.js',
	'jquery.mobile.tizen.pinch.js',
	'jquery.mobile.tizen.scrollview.js',
	'jquery.mobile.tizen.loadprototype.js',
	'jquery.mobile.tizen.loader.js',
	'widgets/components/imageloader.js',
	'widgets/components/motionpath.js',
	'widgets/components/webgl.js',
	'widgets/jquery.mobile.tizen.widgetex.js',
	'widgets/jquery.mobile.tizen.gallery3d.js',
	'widgets/jquery.mobile.tizen.multimediaview.js',
	'widgets/jquery.mobile.tizen.button.js',
	'widgets/jquery.mobile.tizen.scrollview.handler.js',
	'widgets/jquery.mobile.tizen.popupwindow.js',
	'widgets/jquery.mobile.tizen.triangle.js',
	'widgets/jquery.mobile.tizen.popupwindow.ctxpopup.js',
	'widgets/jquery.mobile.tizen.datetimepicker.js',
	'widgets/jquery.mobile.tizen.slider.js',
	'widgets/jquery.mobile.tizen.swipe.js',
	'widgets/jquery.mobile.tizen.listdivider.js',
	'widgets/jquery.mobile.tizen.notification.js',
	'widgets/jquery.mobile.tizen.pagelayout.js',
	'widgets/jquery.mobile.tizen.checkbox.js',
	'widgets/jquery.mobile.tizen.splitview.js',
	'widgets/jquery.mobile.tizen.virtualgrid.js',
	'widgets/jquery.mobile.tizen.searchbar.js',
	'widgets/jquery.mobile.tizen.gallery.js',
	'widgets/jquery.mobile.tizen.circularview.js',
	'widgets/jquery.mobile.tizen.virtuallistview.js',
	'widgets/jquery.mobile.tizen.progress.js',
	'widgets/jquery.mobile.tizen.fastscroll.js',
	'widgets/jquery.mobile.tizen.tabbar.js',
	'widgets/jquery.mobile.tizen.tokentextarea.js',
	'widgets/jquery.mobile.tizen.progressbar.js',
	'widgets/jquery.mobile.tizen.extendablelist.js'
);

function getGitHeadPath() {
	$gitRoot = "../";
	$gitDir = ".git";
	$path = $gitRoot . $gitDir;

	if ( is_file( $path ) && is_readable( $path ) ) {
		$contents = file_get_contents( $path );
		if ( $contents ) {
			$contents = explode( " ", $contents );
			if ( count( $contents ) > 1 ) {
				$contents = explode( "\n", $contents[ 1 ] );
				if ( $contents && count( $contents ) > 0 ) {
					$path = $gitRoot . $contents[ 0 ];
				}
			}
		}
	}

	return $path . "/logs/HEAD";
}

function getCommitId() {
	$gitHeadPath = getGitHeadPath();

	if ( $gitHeadPath ) {
		$logs = ( is_readable( $gitHeadPath ) ? file_get_contents( $gitHeadPath ) : false );
		if ( $logs ) {
			$logs = explode( "\n", $logs );
			$n_logs = count( $logs );
			if ( $n_logs > 1 ) {
				$log = explode( " ", $logs[ $n_logs - 2 ] );
				if ( count( $log ) > 1 ) {
					return $log[ 1 ];
				}
			}
		}
	}

	return false;
}

$comment = getCommitId();
if ( !$comment ) {
	unset( $comment );
} else {
	$comment = "/* git commitid " . $comment . " */\n";
}

// Get the filetype and array of files
if ( ! isset($type) || ! isset($files) )
{
	echo '$type and $files must be specified!';
	exit;
}

$contents = '';

if ( isset( $comment ) ) {
	$contents .= $comment;
}

// Loop through the files adding them to a string
foreach ( $files as $file ) {
	$contents .= file_get_contents($file). "\n\n";
}

// Remove requirejs define
$contents = preg_replace('/^\/\/>>excludeStart\(.*?\);.*?^\/\/>>excludeEnd\(.*?\);/msi', "", $contents);

// Set the content type, filesize and an expiration so its not cached
header('Content-Type: ' . $type);
header('Content-Length: ' . strlen($contents));
header('Expires: Fri, 01 Jan 2010 05:00:00 GMT');

// Deliver the file
echo $contents;

