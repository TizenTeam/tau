/**
 * Config file
 *
 * Properties JSON
 * {
 *	'Name of category': {
 *	}
 * }
 */

var properties = {
	'Body': {
		'Px Base': {
			lessVar: '@px_base',
			widgets: [
				{type: 'slider', default: '1', min: '0.5', max: '3'},
			]
		},

		'Font Family': {
			lessVar: '@font_family',
			widgets: [
				{type: 'text', default: 'Verdana'}
			]
		},

		'Background color': {
			lessVar: '@color_bg',
			widgets: [
				{type: 'color', default: '#bf0000'}
			]
		},

		'Body text color': {
			lessVar: '@color_text',
			widgets: [
				{type: 'color', default: ''}
			]
		}
	},

	'Button': {
		'Not implemented' : {}
	},

	'Button 2': {
		'Not implemented' : {}
	}
}