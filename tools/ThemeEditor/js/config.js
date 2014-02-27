/**
 * Config file
 * If you want to learn how to use this file, please refer to README.txt.
 */

var properties = {
	/* ----------------------- BODY ----------------------- */
	'Body': {
		'Main background color': {
			lessVar: '@color_bg',
			widget: {type: 'color', default: 'rgb(0, 0, 0)'}
		},
		'Main font color': {
			lessVar: '@color_text',
			widget: {type: 'color', default: 'rgb(250, 250, 250)'}
		},
		'Font Family': {
			lessVar: '@font_family',
			widget: {type: 'text', default: 'Samsung Sans, Helvetica'}
		}
	},
	/* ----------------------- Action Bar ----------------------- */
	'Action Bar': {
		'Title text': {
			lessVar: '@color_actionbar_title_text',
			widget: {type: 'color', default: 'rgb(255, 255, 255)'}
		},
		'Title text background': {
			lessVar: '@color_actionbar_title_bg',
			widget: {type: 'color', default: 'rgb(75, 66, 55)'}
		},
		'Border color': {
			lessVar: '@color_actionbar_border',
			widget: {type: 'color', default: 'rgb(107, 86, 61)'}
		},
		/*
		'More pressed background': {
			lessVar: '@color_actionbar_more_pressed_bg',
			widget: {type: 'color', default: '#080808'}
		},*/
		'More Detail Normal Background': {
			lessVar: '@icon_actionbar_more_detail_normal',
			widget: {type: 'text', default: './images/Actionbar/tw_ic_menu_detail_normal_holo_dark.png'}
		},
		'More Detail Disable Background': {
			lessVar: '@icon_actionbar_more_detail_disable',
			widget: {type: 'text', default: './images/Actionbar/tw_ic_menu_detail_disable_holo_dark.png'}
		},
		'More Overflow Normal Background': {
			lessVar: '@icon_actionbar_more_overflow_normal',
			widget: {type: 'text', default: './images/Actionbar/tw_ic_menu_moreoverflow_normal_holo_dark.png'}
		},
		'More Overflow Disable Background': {
			lessVar: '@icon_actionbar_more_overflow_disable',
			widget: {type: 'text', default: './images/Actionbar/tw_ic_menu_moreoverflow_disable_holo_dark.png'}
		},
		'More SelectAll Normal Background': {
			lessVar: '@icon_actionbar_more_selectall_normal',
			widget: {type: 'text', default: './images/Actionbar/tw_ic_menu_selectall_normal_holo_dark.png'}
		},
		'More SelectAll Disable Background': {
			lessVar: '@icon_actionbar_more_selectall_disable',
			widget: {type: 'text', default: './images/Actionbar/tw_ic_menu_selectall_disable_holo_dark.png'}
		},
		'Tab Navigation Active Background': {
			lessVar: '@color_actionbar_tab_nav_active_bg',
			widget: {type: 'color', default: 'rgb(255, 144, 0)'}
		}
	},
	/* ----------------------- Progress Bar ----------------------- */
	'Progress Bar': {
		'Text': {
			lessVar: '@color_progressbar_text',
			widget: {type: 'color', default: 'rgb(255, 255, 255)'}
		},
		'Normal background color': {
			lessVar: '@color_progressbar_normal_bg',
			widget: {type: 'color', default: 'rgb(17, 17, 17)'}
		},
		'Value background color': {
			lessVar: '@color_progressbar_value_bg',
			widget: {type: 'color', default: 'rgb(255, 134, 0)'}
		}
	},
	/* ----------------------- Processing ----------------------- */
	'Processing': {
		'Text': {
			lessVar: '@color_processing_text',
			widget: {type: 'color', default: 'rgb(255, 255, 255)'}
		}
	},
	/* ----------------------- Toggle Switch ----------------------- */
	'Toggle Switch': {
		'Text': {
			lessVar: '@color_switch_text',
			widget: {type: 'color', default: 'rgb(255, 255, 255)'}
		},
		'Background': {
			lessVar: '@color_switch_bg',
			widget: {type: 'color', default: 'rgb(255, 144, 0)'}
		},
		'Handler background': {
			lessVar: '@color_switch_handler_bg',
			widget: {type: 'color', default: 'rgb(255, 255, 255)'}
		},
		'Activation background (regular)': {
			lessVar: '@color_switch_activation_bg',
			widget: {type: 'color', default: 'rgb(38, 38, 38)'}
		},
		'Activation background (active)': {
			lessVar: '@color_swtich_activation_active_bg',
			widget: {type: 'color', default: 'rgb(64, 64, 64)'}
		},
		'Activation background (disabled)': {
			lessVar: '@color_switch_activation_disable_bg',
			widget: {type: 'color', default: 'rgb(26, 26, 26)'}
		},
		'Activation background (checked)': {
			lessVar: '@color_switch_activation_checked_bg',
			widget: {type: 'color', default: 'rgb(255, 144, 0)'}
		},
		'Activation background (active & checked)': {
			lessVar: '@color_switch_activation_active_checked_bg',
			widget: {type: 'color', default: 'rgb(255, 166, 51)'}
		},
		'Activation background (disabled & checked)': {
			lessVar: '@color_switch_activation_disable_checked_bg',
			widget: {type: 'color', default: 'rgb(76, 43, 0)'}
		}
	},
	/* ----------------------- Button default ----------------------- */
	'Button - default': {
		'Text': {
			lessVar: '@color_button_default_text',
			widget: {type: 'color', default: 'rgb(255, 255, 255)'}
		},
		'Text disabled': {
			lessVar: '@color_button_default_text_disable',
			widget: {type: 'color', default: 'rgb(51, 51, 51)'}
		},
		/*'Border color': {
			lessVar: '@color_button_default_border',
			widget: {type: 'color', default: 'rgb(159, 151, 145)'}
		},*/
		'Normal background': {
			lessVar: '@color_button_default_normal_bg',
			widget: {type: 'color', default: 'rgb(75, 66, 55)'}
		},
		'Focus background': {
			lessVar: '@color_button_default_focus_bg',
			widget: {type: 'color', default: 'rgb(75, 66, 55)'}
		},
		'Press background': {
			lessVar: '@color_button_default_press_bg',
			widget: {type: 'color', default: 'rgb(99, 93, 89)'}
		},
		'Disabled background': {
			lessVar: '@color_button_default_disable_bg',
			widget: {type: 'color', default: 'rgb(29, 26, 24)'}
		}
	},
	/* ----------------------- Button red ----------------------- */
	'Button - red': {
		'Text': {
			lessVar: '@color_button_red_text',
			widget: {type: 'color', default: 'rgb(255, 255, 255)'}
		},
		'Text disabled': {
			lessVar: '@color_button_red_text_disable',
			widget: {type: 'color', default: 'rgba(255, 255, 255, 0.15)'}
		},
		/*
		'Border color': {
			lessVar: '@color_button_red_border',
			widget: {type: 'color', default: 'rgb(255, 144, 0)'}
		},*/
		'Normal background': {
			lessVar: '@color_button_red_normal_bg',
			widget: {type: 'color', default: '#ce2302'}
		},
		'Focus background': {
			lessVar: '@color_button_red_focus_bg',
			widget: {type: 'color', default: '#ce2302'}
		},
		'Press background': {
			lessVar: '@color_button_red_press_bg',
			widget: {type: 'color', default: '#dd654e'}
		},
		'Disabled background': {
			lessVar: '@color_button_red_disable_bg',
			widget: {type: 'color', default: '#3d0a0a'}
		}
	},
	/* ----------------------- Button orange ----------------------- */
	'Button - orange': {
		'Text': {
			lessVar: '@color_button_orange_text',
			widget: {type: 'color', default: 'rgb(255, 255, 255)'}
		},
		'Text disabled': {
			lessVar: '@color_button_orange_text_disable',
			widget: {type: 'color', default: 'rgba(255, 255, 255, 0.15)'}
		},
		/*
		'Border color': {
			lessVar: '@color_button_orange_border',
			widget: {type: 'color', default: 'rgb(255, 246, 0)'}
		},*/
		'Normal background': {
			lessVar: '@color_button_orange_normal_bg',
			widget: {type: 'color', default: '#ed8600'}
		},
		'Focus background': {
			lessVar: '@color_button_orange_focus_bg',
			widget: {type: 'color', default: '#ed8600'}
		},
		'Press background': {
			lessVar: '@color_button_orange_press_bg',
			widget: {type: 'color', default: '#f0aa56'}
		},
		'Disabled background': {
			lessVar: '@color_button_orange_disable_bg',
			widget: {type: 'color', default: '#462805'}
		}
	},
	/* ----------------------- Button green ----------------------- */
	'Button - green': {
		'Text': {
			lessVar: '@color_button_green_text',
			widget: {type: 'color', default: 'rgb(255, 255, 255)'}
		},
		'Text disabled': {
			lessVar: '@color_button_green_text_disable',
			widget: {type: 'color', default: 'rgba(255, 255, 255, 0.15)'}
		},
		/*'Border color': {
			lessVar: '@color_button_green_border',
			widget: {type: 'color', default: 'rgb(141, 255, 0)'}
		},*/
		'Normal background': {
			lessVar: '@color_button_green_normal_bg',
			widget: {type: 'color', default: '#64a323'}
		},
		'Focus background': {
			lessVar: '@color_button_green_focus_bg',
			widget: {type: 'color', default: '#64a323'}
		},
		'Press background': {
			lessVar: '@color_button_green_press_bg',
			widget: {type: 'color', default: '#92be5e'}
		},
		'Disabled background': {
			lessVar: '@color_button_green_disable_bg',
			widget: {type: 'color', default: '#1e3108'}
		}
	},
	/* ----------------------- Popup ----------------------- */
	'Popup': {
		'Title text': {
			lessVar: '@color_popup_title_text',
			widget: {type: 'color', default: 'rgb(255, 144, 0)'}
		},
		'Background color': {
			lessVar: '@color_popup_bg',
			widget: {type: 'color', default: 'rgb(34, 34, 34)'}
		},
		'Border color': {
			lessVar: '@color_popup_border',
			widget: {type: 'color', default: 'rgb(67, 67, 67)'}
		},
		'Button background color': {
			lessVar: '@color_popup_button_bg',
			widget: {type: 'color', default: 'rgb(72, 65, 60)'}
		},
		'Press background color': {
			lessVar: '@color_popup_button_press_bg',
			widget: {type: 'color', default: 'rgb(99, 93, 89)'}
		}
	},
	/* ----------------------- List ----------------------- */
	'List': {
		'Title text': {
			lessVar: '@color_list_border',
			widget: {type: 'color', default: 'rgb(51, 51, 51)'}
		},
		'Background color': {
			lessVar: '@color_list_press_bg',
			widget: {type: 'color', default: 'rgb(99, 93, 89)'}
		}
	},
	/* ----------------------- Index Scrollbar (vertical) ----------------------- */
	'Index Scrollbar': {
		'Background': {
			lessVar: '@color_indexscrollbar_bg',
			widget: {type: 'color', default: '#222222'}
		},
		'Main text color': {
			lessVar: '@color_indexscrollbar_text',
			widget: {type: 'color', default: 'rgb(89, 89, 89)'}
		},
		'Selected index background': {
			lessVar: '@color_indexscrollbar_selected_bg',
			widget: {type: 'color', default: '#f99107'}
		},
		'Selected index text color': {
			lessVar: '@color_indexscrollbar_selected_text',
			widget: {type: 'color', default: 'rgb(255, 255, 255)'}
		},
		'Indicator background': {
			lessVar: '@color_indexscrollbar_indicator_bg',
			widget: {type: 'color', default: 'rgb(88, 73, 58)'}
		},
		'Indicator text color': {
			lessVar: '@color_indexscrollbar_indicator_text',
			widget: {type: 'color', default: 'rgb(255, 255, 255)'}
		}
	}
};