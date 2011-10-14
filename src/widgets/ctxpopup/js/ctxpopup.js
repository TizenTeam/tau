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
        
        var boxRect = new SLPRect(),
            arrowRect = new SLPRect(
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
                                owner.innerHeight(true)),
            screenRect = new SLPRect( 
                                window.pageXOffset,
                                window.pageYOffset,
                                window.innerWidth,
                                window.innerHeight);
        this.ui.screen
            .height($(document).height())
            .removeClass("ui-screen-hidden");

        if (this.options.maxWidth < containerRect.w) 
            containerRect.w = this.options.maxWidth;
        if (this.options.minWidth > containerRect.w)
            containerRect.w = this.options.minWidth;
        if (this.options.maxHeight < containerRect.h)
            containerRect.h = this.options.maxHeight;
        if (this.options.minHeight > containerRect.h)
            containerRect.h = this.options.minHeight;
        
        // get entire box location and direction
        
        console.log( arrowRect );
        console.log( containerRect );
        console.log( screenRect );


        var tX, tY, tW, tH, idx;
        var priority = ['up', 'down', 'left', 'right'];
        for (idx = 0; idx < 4; idx++) {
            switch (priority[idx]) {
            case 'up':
                tW = containerRect.w;
                tH = containerRect.h + arrowRect.h;
                tX = x_where - tW / 2;
                tY = y_where;
                if (tY + tH > screenRect.y + screenRect.h) 
                    continue;
                while (tX + tW > screenRect.x + screenRect.w) {
                    tX--;
                }
                while (tX < screenRect.x ) {
                    tX++;
                }
                console.log("UP!");
                break;
            case 'down':
                tW = containerRect.w;
                tH = containerRect.h + arrowRect.h;
                tX = x_where - tW / 2;
                tY = y_where - tH;
                if (tY < screenRect.y)
                    continue;
                while (tX + tW > screenRect.x + screenRect.w) {
                    tX--;
                }
                while (tX < screenRect.x ) {
                    tX++;
                }
                console.log("DOWN");
                break;
            case 'left':
                tW = containerRect.w + arrowRect.w;
                tH = containerRect.h;
                tX = x_where;
                tY = y_where - tH / 2;
                if (tX + tW > screenRect.x + screenRect.w )
                    continue;
                while (tY + tH > screenRect.y + screenRect.h ) {
                    tY--;
                }
                while (tY < screenRect.y ) {
                    tY++;
                }
                console.log("LEFT");
                break;
            case 'right':
                tW = containerRect.w + arrowRect.w;
                tH = containerRect.h;
                tX = x_where - tW;
                tY = y_where - tH / 2;
                if (tX < screenRect.x) 
                    continue;
                while (tY + tH > screenRect.y + screenRect.h ) {
                    tY--;
                }
                while (tY < screenRect.y ) {
                    tY++;
                }
                console.log("RIGHT");
                break;
            default:
                break;
            }
            break;
        }
        
        // setting up arrow direction
        switch (priority[idx]) {
        case 'up':
            arrow.css("left", x_where - tX - arrowRect.w / 2);
            arrow.addClass("arrow-top");
            break;
        case 'down':
            container.css("top", -arrowRect.h);
            arrow.css("top", containerRect.h);
            arrow.css("left", x_where - tX - arrowRect.w / 2);
            arrow.addClass("arrow-bottom");
            break;
        case 'left':
            container.css("left",arrowRect.w);
            container.css("top",-arrowRect.h);
            arrow.css("top", y_where - tY - arrowRect.h / 2);
            arrow.addClass("arrow-left");
            break;
        case 'right':
            container.css("left",-arrowRect.w);
            container.css("top",-arrowRect.h);
            arrow.css("left",containerRect.w);
            arrow.css("top", y_where - tY - arrowRect.h / 2);
            arrow.addClass("arrow-right");
            break;
        }
        // adjust container location

        // adjust arrow location


        console.log( tX + "," + tY + "," + tW + "," + tH );
        box.removeClass("ui-selectmenu-hidden");
        container.removeClass("ui-selectmenu-hidden");
        arrow.removeClass("ui-selectmenu-hidden");
        box.css("left", tX);
        box.css("top", tY);
        
        this.ui.screen.height($(document).height());

    },

    close: function() {
        console.log("re close");
        $(this.ui.screen).addClass("ui-screen-hidden");
        $(this.ui.box).addClass("ui-selectmenu-hidden");
        $(this.ui.container).addClass("ui-selectmenu-hidden");
        $(this.ui.arrow).addClass("ui-selectmenu-hidden");
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
            console.log("request close");
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
