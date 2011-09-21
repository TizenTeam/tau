(function($, undefined) {

$.widget("mobile.switch", $.mobile.widget, {

  options: {
    checked: true,
    initSelector: ":jqmData(role='switch')"
  },

  _create: function() {
    var self = this,
        dstAttr = this.element.is("input") ? "checked" : "data-checked",
        myProto = $.mobile.todons.loadPrototype("switch").find("#switch")
          .appendTo(this.element),
        ui = {
          background: myProto,
          button: myProto.find("#switch-button").buttonMarkup({inline: true, corners: true})
        };

    ui.background.css("height",
      (ui.button.outerHeight(true)
        + parseInt(ui.button.css("padding-top"))
        + parseInt(ui.button.css("padding-bottom"))
        + parseInt(ui.button.css("border-bottom-width"))
        + parseInt(ui.button.css("border-top-width"))) * 3);

    $.extend(this, {
      ui: ui,
      dstAttr: dstAttr
    });

    $.mobile.todons.parseOptions(this, true);

    ui.button.bind("vclick", function(e) {
      self._toggle();
      e.stopPropagation();
    });

    ui.background.bind("vclick", function(e) {
      self._toggle();
      e.stopPropagation();
    });
  },

  _toggle: function() {
    this._setChecked(!(parseInt(this.ui.button.css("top")) === 0));
  },

  _setOption: function(key, value, unconditional) {
    if (undefined === unconditional)
      unconditional = false;
    if (key === "checked")
      this._setChecked(value, unconditional);
  },

  _setChecked: function(checked, unconditional) {
    var dst = checked ? 0 : this.ui.button.outerHeight();

    if (dst != parseInt(this.ui.button.css("top")) || unconditional) {
      this.ui.button.animate({"top" : dst + "px"}, "fast");
      if (checked)
        this.ui.background.addClass("ui-btn-active");
      else
        this.ui.background.removeClass("ui-btn-active");
      this.options.checked = checked;
      this.element.attr(this.dstAttr, checked ? "true" : "false");
      this.element.triggerHandler("changed", checked);
    }
  },
});

$(document).bind("pagecreate create", function(e) {
  $($.mobile.switch.prototype.options.initSelector, e.target)
    .not(":jqmData(role='none'), :jqmData(role='nojs')")
    .switch();
});

})(jQuery);
