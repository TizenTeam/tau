(function (ns) {
	'use strict';
	module("api.ns.widget.Button", {
		});

	test ( "API ns.widget.Button" , function () {
		var widget, Button;
		equal(typeof ns, 'object', 'Class ns exists');
		equal(typeof ns.widget, 'object', 'Class ns.widget exists');
		equal(typeof ns.widget.mobile, 'object', 'Class ns.widget.mobile exists');
		equal(typeof ns.widget.mobile.Button, 'function', 'Class ns.widget.mobile.Button exists');

		widget = ns.engine.instanceWidget(document.getElementById("button"), "Button");
		Button = ns.widget.mobile.Button;

		equal(typeof widget.configure, 'function', 'Method button.configure exists');
		equal(typeof widget._configure, 'function', 'Method button._configure exists');
		equal(typeof widget._getCreateOptions, 'function', 'Method button._getCreateOptions exists');
		equal(typeof widget.build, 'function', 'Method button.build exists');
		equal(typeof widget.init, 'function', 'Method button.init exists');
		equal(typeof widget.bindEvents, 'function', 'Method button.bindEvents exists');
		equal(typeof widget.destroy, 'function', 'Method button.destroy exists');
		equal(typeof widget.disable, 'function', 'Method button.disable exists');
		equal(typeof widget.enable, 'function', 'Method button.enable exists');
		equal(typeof widget.refresh, 'function', 'Method button.refresh exists');
		equal(typeof widget.option, 'function', 'Method button.option exists');

		equal(typeof widget.options, 'object', 'Property button.options exists');
		equal(typeof widget.options.theme, 'string', 'Property button.options.theme exists');
		equal(typeof widget.options.icon, 'object', 'Property button.options.icon exists');
		equal(typeof widget.options.iconpos, 'object', 'Property button.options.iconpos exists');
		equal(typeof widget.options.inline, 'object', 'Property button.options.inline exists');
		equal(typeof widget.options.shadow, 'boolean', 'Property button.options.shadow exists');
		equal(typeof widget.options.iconshadow, 'boolean', 'Property button.options.iconshadow exists');
		equal(typeof widget.options.corners, 'boolean', 'Property button.options.corners exists');
		equal(typeof widget.options.bar, 'boolean', 'Property button.options.bar exists');
		equal(typeof widget.options.style, 'object', 'Property button.options.style exists');

		equal(typeof Button.classes, 'object', 'Property button.classes exists');
		equal(typeof Button.classes.uiDisabled, 'string', 'Property button.classes.uiDisabled exists');
		equal(typeof Button.classes.uiBtn, 'string', 'Property button.classes.uiBtn exists');
		equal(typeof Button.classes.uiBtnUpThemePrefix, 'string', 'Property button.classes.uiBtnUpThemePrefix exists');
		equal(typeof Button.classes.uiBtnDownThemePrefix, 'string', 'Property button.classes.uiBtnDownThemePrefix exists');
		equal(typeof Button.classes.uiShadow, 'string', 'Property button.classes.uiShadow exists');
		equal(typeof Button.classes.uiBtnCornerAll, 'string', 'Property button.classes.uiBtnCornerAll exists');
		equal(typeof Button.classes.uiBtnHidden, 'string', 'Property button.classes.uiBtnHidden exists');
		equal(typeof Button.classes.uiBtnBoxThemePrefix, 'string', 'Property button.classes.uiBtnBoxThemePrefix exists');
		equal(typeof Button.classes.uiBtnTextPaddingLeft, 'string', 'Property button.classes.uiBtnTextPaddingLeft exists');
		equal(typeof Button.classes.uiBtnTextPaddingRight, 'string', 'Property button.classes.uiBtnTextPaddingRight exists');
		equal(typeof Button.classes.uiBtnTextPaddingBottom, 'string', 'Property button.classes.uiBtnTextPaddingBottom exists');
		equal(typeof Button.classes.uiBtnTextPaddingTop, 'string', 'Property button.classes.uiBtnTextPaddingTop exists');
		equal(typeof Button.classes.uiBtnCornerCircle, 'string', 'Property button.classes.uiBtnCornerCircle exists');
		equal(typeof Button.classes.uiBtnHastxt, 'string', 'Property button.classes.uiBtnHastxt exists');
		equal(typeof Button.classes.uiBtnIconNobg, 'string', 'Property button.classes.uiBtnIconNobg exists');
		equal(typeof Button.classes.uiBtnIconOnly, 'string', 'Property button.classes.uiBtnIconOnly exists');
		equal(typeof Button.classes.uiBtnIconOnlyInner, 'string', 'Property button.classes.uiBtnIconOnlyInner exists');
		equal(typeof Button.classes.uiBtnRound, 'string', 'Property button.classes.uiBtnRound exists');
		equal(typeof Button.classes.uiMini, 'string', 'Property button.classes.uiMini exists');
		equal(typeof Button.classes.uiBtnInline, 'string', 'Property button.classes.uiBtnInline exists');
		equal(typeof Button.classes.uiBtnBlock, 'string', 'Property button.classes.uiBtnBlock exists');
		equal(typeof Button.classes.uiIcon, 'string', 'Property button.classes.uiIcon exists');
		equal(typeof Button.classes.uiIconPositionPrefix, 'string', 'Property button.classes.uiIconPositionPrefix exists');
		equal(typeof Button.classes.uiIconShadow, 'string', 'Property button.classes.uiIconShadow exists');
		equal(typeof Button.classes.uiBtnIconPositionPrefix, 'string', 'Property button.classes.uiBtnIconPostionPrefix exists');
		equal(typeof Button.classes.uiLink, 'string', 'Property button.classes.uiLink exists');
		equal(typeof Button.classes.uiBtnInner, 'string', 'Property button.classes.uiBtnInner exists');
		equal(typeof Button.classes.uiBtnText, 'string', 'Property button.classes.uiBtnText exists');
		equal(typeof Button.classes.uiFocus, 'string', 'Property button.classes.uiFocus exists');
		equal(typeof Button.classes.uiBtnEdit, 'string', 'Property button.classes.uiBtnEdit exists');
		equal(typeof Button.classes.uiBtnLeft, 'string', 'Property button.classes.uiBtnLeft exists');
		equal(typeof Button.classes.uiBtnRight, 'string', 'Property button.classes.uiBtnRight exists');
		equal(typeof Button.classes.uiSubmit, 'string', 'Property button.classes.uiSubmit exists');

		equal(typeof widget._build, 'function', 'Method button._build exists');
		equal(typeof widget._bindEvents, 'function', 'Method button._bindEvents exists');
		equal(typeof widget._init, 'function', 'Method button._bindEvents exists');
	});
}(ej));