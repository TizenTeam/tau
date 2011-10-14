function SLPRect(x,y,w,h) {
        this.x = x || 0;
        this.y = y || 0;
        this.w = w || 0;
        this.h = h || 0;
}

(function( $, undefined ) {

$.widget( "todons.ctxpopup", $.mobile.widget, {
    options: {
        maxWidth: 720,
        minWidth: 10,
        maxHeight: 1280,
        minHeight: 10,
        initSelector: ":jqmData(role='ctxpopup')",
    },
    

    _calcSweetSpot: function() {
        

    },

    _getDirection: function(boxWidth, boxHeight) {
        var rectWidth = boxWidth || this.options.minWidth,
            rectHeight = boxHeight || this.options.minHeight;





    },

    pop: function(x_where, y_where) {
        var ui = $(this.ui),
            box = $(this.ui.box),
            arrow = $(this.ui.arrow),
            owner = $(this.owner),
            container = $(this.ui.container);

        var arrowRect = new SLPRect( 
                                0, 0, 
                                arrow.outerWidth(true),
                                arrow.outerWidth(true)),
            containerRect = new SLPRect(
                                0, 0, 
                                container.outerWidth(true),
                                container.outerHeight(true)),
            ownerOffset = owner.offset(),
            ownerRect = new SLPRect( ownerOffset.x, ownerOffset.y,
                                owner.innerWidth(true),
                                owner.innerHeight(true));
        console.log(ownerRect);
        console.log(containerRect);
        console.log(arrowRect);
                                

        if (this.options.maxWidth < containerRect.w) 
            containerRect.w = this.options.maxWidth;
        if (this.options.minWidth > containerRect.w)
            containerRect.w = this.options.minWidth;
        if (this.options.maxHeight < containerRect.h)
            containerRect.h = this.options.maxHeight;
        if (this.options.minHeight > containerRect.h)
            containerRect.h = this.options.minHeight;
        
//        for (idx = 0; idx < 4; idx++) {




    },

    close: function() {
        

    },

    _create: function() {
        var self = this,
            elem = this.element,
            owner = undefined,
            thisPage = elem.closest(".ui-page"),
            ui = {
                screen:     "#ctxpopup-screen",
                box:        "#ctxpopup-box",
                arrow:      "#ctxpopup-arrow",
                container:  "#ctxpopup-container"
            };
        
        ui = $.mobile.todons.loadPrototype("ctxpopup", ui);
        thisPage.append(ui.screen);
        ui.box.insertAfter(ui.screen);
        ui.container.append(elem);
        $.mobile.todons.parseOptions(this, true);

        ui.screen.bind("vclick", function(e) {
            self.close();
        });

        var ctxid = $(elem).attr("data-ctxid"); 
        if (ctxid) {
            owner = $(document).find("#" + ctxid);
            owner.bind("vclick", function(e) {
                self.pop(e.clientX, e.clientY);
            });
        }
 
        $.extend( self, {
            ui: ui,
            thisPage: thisPage,
            owner: owner
        });

   },

 
});

$(document).bind("pagecreate create", function(e) {
    $($.todons.ctxpopup.prototype.options.initSelector, e.target)
    .not(":jqmData(role='none'), :jqmData(role='nojs')")
    .ctxpopup();
});

})(jQuery);
