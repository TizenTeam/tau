System requirements:
	ThemeEditor works properly with WebKit browsers (e.g. Google Chrome, Safari)
	It's allowed to run preview application in the same domain. If you want to run preview application in other domain you have to update your browser security policy.

Quick User Guide;
	To add/remove new theme preview (new badge) choose proper button from top panel.
	To change active badge, click on badge border.
	To change property click on a property from left column and pick a color or update directly with Property Value box.
	You can change badge view in order to check responsivity of preview app. Just use sliders from proper icon.
	If you are working with few badges please feel free to use zoom to make more room in your workspace or look closer.
	If you have finished your theme, just click disc icon to save your and download CSS file.


 Simple properties
 var properties = {
	'Name of category': {
		'Name of property': {
			lessVar: '@less-variable-name',
			widget: {type: 'text', default: 'normal'}
		}
	},
	'Second name of category': {
		'My property': {
			lessVar: '@my-property',
			widget: {type: 'color', default: '#bf0000'}
		},
	}
}