/**
 * Config file
 * If you want to learn how to use this file, please refer to README.txt.
 */

var properties = {
    /* ----------------------- BODY ----------------------- */
    'Body': {
        'Background color': {
            lessVar: '@color_bg',
            widget: {type: 'color', default: '#080808'}
        },
        'Default text color': {
            lessVar: '@color_text',
            widget: {type: 'color', default: '#FAFAFA'}
        },
        'Base px size': {
            lessVar: '@px_base',
            widget: {type: 'slider', default: '1', min: '0.5', max: '3'}
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
            widget: {type: 'color', default: '#080808'}
        },
        'More pressed background': {
            lessVar: '@color_actionbar_more_pressed_bg',
            widget: {type: 'color', default: '#080808'}
        },
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
    /* ----------------------- Progress Bar ----------------------- */
    'Processing': {
        'Text': {
            lessVar: '@color_processing_text',
            widget: {type: 'color', default: 'rgb(255, 255, 255)'}
        }
    },
    /* ----------------------- Progress Bar ----------------------- */
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
        'Border color': {
            lessVar: '@color_button_default_border',
            widget: {type: 'color', default: 'rgb(159, 151, 145)'}
        },
        'Normal background': {
            lessVar: '@color_button_default_normal_bg',
            widget: {type: 'color', default: 'rgb(72, 65, 60)'}
        },
        'Press background': {
            lessVar: '@color_button_default_press_bg',
            widget: {type: 'color', default: 'rgb(98, 92, 88)'}
        },
        'Focus background': {
            lessVar: '@color_button_default_focus_bg',
            widget: {type: 'color', default: 'rgb(72, 65, 60)'}
        },
        'Disabled background': {
            lessVar: '@color_button_default_disable_bg',
            widget: {type: 'color', default: 'rgb(28, 25, 23)'}
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
            widget: {type: 'color', default: 'rgb(88, 55, 49)'}
        },
        'Border color': {
            lessVar: '@color_button_red_border',
            widget: {type: 'color', default: 'rgb(255, 144, 0)'}
        },
        'Normal background': {
            lessVar: '@color_button_red_normal_bg',
            widget: {type: 'color', default: 'rgb(205, 34, 1)'}
        },
        'Press background': {
            lessVar: '@color_button_red_press_bg',
            widget: {type: 'color', default: 'rgb(220, 100, 77)'}
        },
        'Focus background': {
            lessVar: '@color_button_red_focus_bg',
            widget: {type: 'color', default: 'rgb(205, 34, 1)'}
        },
        'Disabled background': {
            lessVar: '@color_button_red_disable_bg',
            widget: {type: 'color', default: 'rgb(60, 9, 0)'}
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
            widget: {type: 'color', default: 'rgb(96, 72, 47)'}
        },
        'Border color': {
            lessVar: '@color_button_orange_border',
            widget: {type: 'color', default: 'rgb(255, 246, 0)'}
        },
        'Normal background': {
            lessVar: '@color_button_orange_normal_bg',
            widget: {type: 'color', default: 'rgb(236, 133, 0)'}
        },
        'Press background': {
            lessVar: '@color_button_orange_press_bg',
            widget: {type: 'color', default: 'rgb(241, 170, 76)'}
        },
        'Focus background': {
            lessVar: '@color_button_orange_focus_bg',
            widget: {type: 'color', default: 'rgb(236, 133, 0)'}
        },
        'Disabled background': {
            lessVar: '@color_button_orange_disable_bg',
            widget: {type: 'color', default: 'rgb(70, 39, 0)'}
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
            widget: {type: 'color', default: 'rgb(65, 79, 51)'}
        },
        'Border color': {
            lessVar: '@color_button_green_border',
            widget: {type: 'color', default: 'rgb(141, 255, 0)'}
        },
        'Normal background': {
            lessVar: '@color_button_green_normal_bg',
            widget: {type: 'color', default: 'rgb(97, 163, 16)'}
        },
        'Press background': {
            lessVar: '@color_button_green_press_bg',
            widget: {type: 'color', default: 'rgb(97, 163, 16)'}
        },
        'Focus background': {
            lessVar: '@color_button_green_focus_bg',
            widget: {type: 'color', default: 'rgb(236, 133, 0)'}
        },
        'Disabled background': {
            lessVar: '@color_button_green_disable_bg',
            widget: {type: 'color', default: 'rgb(28, 48, 4)'}
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
            widget: {type: 'color', default: 'rgb(51, 51, 51)'}
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
}