To add/remove new theme preview (new badge) choose proper button from top panel.
To change active badge, click on badge border.
To change property click on a property from left column and pick a color.



 Simple properties
 var properties = {
    'Name of category': {
        'Name of property': {
            lessVar: '@less-variable-name',
            widget: {type: 'text', default: 'normal'}
        }
    },
    'Second name of category': {
        'Name of property': {
            lessVar: '@second-category-name',
            widget: {type: 'slider', default: '10px', min: '5px', max: '30px'}
        },
        'Second name of property': {
            lessVar: '@second-category-second-name',
            widget: {type: 'text', default: 'Verdana'}
        },
    }
}