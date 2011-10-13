(function( $, undefined ) {

$.widget( "todons.ctxpopup", $.mobile.widget, {
    options: {
        initSelector: ":jqmData(role='ctxpopup')",
    },

    _calcSweetSpot: function() {
        

    },

    pop: function(x_where, y_where) {
       var popupWidth = $(this.ui.container).outerWidth(true),
           popupHeight = $(this.ui.container).outerHeight(true);

       console.log("Ive got the signals from :" + x_where + "," + y_where);
       console.log("Desired popup dimension is :" + popupWidth "x" + popupHeight);

       
    },

    attachContext: function(owner, target) {
        $(document).find("#"+target).bind("vclick", function(e) {
            owner.pop(e.clientX, e.clientY);
        });
    },

    close: function() {
        

    },

    _create: function() {
        var self = this,
            elem = this.element,
            o = this.options,
            thisPage = elem.closest(".ui-page"),
            ui = {
                screen:     "#ctxpopup-screen",
                container:  "#ctxpopup-container"
            };
        
        ui = $.mobile.todons.loadPrototype("ctxpopup", ui);
        thisPage.append(ui.screen);
        ui.container.insertAfter(ui.screen);
        ui.container.append(elem);

        $.extend( self, {
            ui: ui,
            thisPage: thisPage
        });

        $.mobile.todons.parseOptions(this, true);

        ui.screen.bind("vclick", function(e) {
            self.close();
        });
        var ctxid = $(elem).attr("data-ctxid"); 
        if (ctxid) {
            console.log(ctxid);
            self.attachContext(self, ctxid);
        }
    },

 
});

$(document).bind("pagecreate create", function(e) {
    $($.todons.ctxpopup.prototype.options.initSelector, e.target)
    .not(":jqmData(role='none'), :jqmData(role='nojs')")
    .ctxpopup();
});

})(jQuery);
