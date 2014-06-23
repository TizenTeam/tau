System requirements:
	Device Viewer works properly with WebKit browsers (e.g. Google Chrome, Safari)
	It's allowed to run preview application in the same domain. If you want to run preview application in other domain you have to update your browser security policy.
	It' recommended to run application in browser application mode to hide unnecessary navigation bars e.g.:
		google-chrome --allow-file-access-from-files --disable-web-security --app=file:///path/to/DeviceViewer

	If specified application want to be provided edit ./js/config.js or call Device Viewer with proper JSON after # in URL e.g.:
		google-chrome --allow-file-access-from-files --disable-web-security --app=file:///path/to/DeviceViewer/#{"name":"DisplayedAppName", "path": "pathToApp"}
	or simply run shell script in DeviceViewer path
		./run.sh '{"name":"DisplayedAppName", "path": "pathToApp"}'

Quick User Guide;
	To add/remove new device preview (new badge) choose proper button from top panel.
	To change active badge, click on badge border.
	You can change badge view in order to check responsivity of preview app. Just use sliders from proper icon.
	If you mark global checkbox all badges will be reset and changes will affect to all badges.
	If you are working with few badges please feel free to use zoom to make more room in your workspace or look closer.
	Device properties box shows you current badge properties (physical resolution, device CSS resolution and pixel ratio).
	In simple way, the CSS resolution is number of pixels "viewed" from CSS.
