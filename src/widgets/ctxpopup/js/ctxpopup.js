function SLPRect(x,y,w,h) {
        this.x = x || 0;
        this.y = y || 0;
        this.w = w || 0;
        this.h = h || 0;
}

(function( $, undefined ) {

$.widget( "todons.ctxpopup", $.mobile.widget, {
    options: {
        horizontal: false,
        title: undefined,
        transparency: false,
        ninepatch: true,
        verticalPriority: [ 'left', 'right', 'up', 'down'],
        horizontalPriority: [ 'up', 'down', 'left', 'right'],
        directionPriority: [ 'left', 'right', 'up', 'down'],
        maxWidth: 720,
        minWidth: 100,
        maxHeight: 1280,
        minHeight: 100,
        initSelector: ":jqmData(role='ctxpopup')",
    },
        
    _setTheme: function() {
        this.ui.container.addClass("border");

        if ( this.options.transparency ) {
            this.ui.container.addClass("transparency");
            this.ui.arrow.addClass("transparency");
        }
        
        if ( this.options.horizontal ) {
            this.options.directionPriority = this.options.horizontalPriority;
            this.ui.container.addClass("hlist");
            var div = this.ui.container.find("div div");
            switch ( div.length ) {
            case 3:
                div.addClass("h3-list");
            break;
            case 4:
                div.addClass("h4-list");
            break;
            default:
                if ( div.length > 4 ) {
                    div.addClass("h5-list");

                    var w = this.elem.width();
                    var scroll = this.ui.container.scrollview( {
                        direction: "x",
                        showScrollBars: false,
                    });
                    
                    scroll.width(div.outerWidth(true) * 5);
                    this.elem.width(w);
                    console.log(scroll);
                }
            break;
            }
        }

    },

    pop: function(x_where, y_where) {
        if ( this.isOpen ) return;

        this.isOpen = true;
        
        this._setTheme();

        var ui = $(this.ui),
            box = $(this.ui.box),
            arrow = $(this.ui.arrow),
//          owner = $(this.owner),
            container = $(this.ui.container);
        
        var arrowRect = new SLPRect(
                                0, 0, 
                                arrow.innerWidth(true),
                                arrow.innerWidth(true)),
            containerRect = new SLPRect(
                                0, 0, 
                                container.innerWidth(true),
                                container.innerHeight(true)),
//          ownerOffset = owner.offset(),
//          ownerRect = new SLPRect( ownerOffset.x, ownerOffset.y,
//                              owner.innerWidth(true),
//                              owner.innerHeight(true)),
            screenRect = new SLPRect( 
                                window.pageXOffset,
                                window.pageYOffset,
                                window.innerWidth,
                                window.innerHeight);
        this.ui.screen
            .height($(document).height())
            .removeClass("ui-screen-hidden");

        if (this.options.maxWidth < containerRect.w) { 
            containerRect.w = this.options.maxWidth;
            container.width( containerRect.w );
            //@TODO ADD SCROLL HERE
        }
        if (this.options.minWidth > containerRect.w) {
            containerRect.w = this.options.minWidth;
            container.width( containerRect.w );
        }
        if (this.options.maxHeight < containerRect.h) {
            containerRect.h = this.options.maxHeight;
            container.height( containerRect.h );
        }
        if (this.options.minHeight > containerRect.h) {
            containerRect.h = this.options.minHeight;
            container.height( containerRect.h );
        }
        
//        container.scrollview({
//            direction: "y", 
//            showScrollBars: false, 
//            scrollMethod: "translate"
//        });

       
        // get entire box location and direction
   
        var tX, tY, tW, tH, idx;
        var priority = this.options.directionPriority;
        for (idx = 0; idx < 4; idx++) {
            switch (priority[idx]) {
            case 'up':
                tW = containerRect.w;
                tH = containerRect.h + arrowRect.h;
                tX = x_where - tW / 2 + screenRect.x;
                tY = y_where + screenRect.y;
                if (tY + tH > screenRect.y + screenRect.h) 
                    continue;
                while (tX + tW > screenRect.x + screenRect.w) {
                    tX--;
                }
                while (tX < screenRect.x ) {
                    tX++;
                }
                break;
            case 'down':
                tW = containerRect.w;
                tH = containerRect.h + arrowRect.h;
                tX = x_where - tW / 2 + screenRect.x;
                tY = y_where - tH + screenRect.y;
                if (tY < screenRect.y)
                    continue;
                while (tX + tW > screenRect.x + screenRect.w) {
                    tX--;
                }
                while (tX < screenRect.x ) {
                    tX++;
                }

                break;
            case 'left':
                tW = containerRect.w + arrowRect.w;
                tH = containerRect.h;
                tX = x_where + screenRect.x;
                tY = y_where - tH / 2 + screenRect.y;
                if (tX + tW > screenRect.x + screenRect.w )
                    continue;
                while (tY + tH > screenRect.y + screenRect.h ) {
                    tY--;
                }
                while (tY < screenRect.y ) {
                    tY++;
                }
                break;
            case 'right':
                tW = containerRect.w + arrowRect.w;
                tH = containerRect.h;
                tX = x_where - tW + screenRect.x;
                tY = y_where - tH / 2 + screenRect.y;
                if (tX < screenRect.x) 
                    continue;
                while (tY + tH > screenRect.y + screenRect.h ) {
                    tY--;
                }
                while (tY < screenRect.y ) {
                    tY++;
                }
                 
                break;
            default:
                break;
            }
            break;
        }

        if( idx > 3 ) {
            alert("Can\'t open popup: (Out of space)");
            isOpen = false;
            return;
        }
        
        // setting up arrow direction and container location
        
        var border_width = container.outerWidth(true) - container.innerWidth(true);

        switch (priority[idx]) {
        case 'up':
            container.css("top", -border_width / 2);
            arrow.css("left", x_where - tX - arrowRect.w / 2);
            arrow.addClass("arrow-top");
            this.arrowReset = function(arrow) { 
                arrow.removeClass("arrow-top");  
            };
            break;
        case 'down':
            container.css("top", -arrowRect.h - border_width / 2);
            arrow.css("top", containerRect.h);
            arrow.css("left", x_where - tX - arrowRect.w / 2);
            arrow.addClass("arrow-bottom");
            this.arrowReset = function(arrow) {
                arrow.removeClass("arrow-bottom");
            };
            break;
        case 'left':
            container.css("left",arrowRect.w - border_width / 2);
            container.css("top",-arrowRect.h);
            arrow.css("top", y_where - tY - arrowRect.h / 2);
            arrow.addClass("arrow-left");
            this.arrowReset = function(arrow) { 
                arrow.removeClass("arrow-left");
            };
            break;
        case 'right':
            container.css("left",-arrowRect.w + border_width / 2);
            container.css("top",-arrowRect.h);
            arrow.css("left",containerRect.w);
            arrow.css("top", y_where - tY - arrowRect.h / 2);
            arrow.addClass("arrow-right");
            this.arrowReset = function(arrow) {
                arrow.removeClass("arrow-right");
            };
            break;
        }

        
        box.removeClass("ui-selectmenu-hidden");
        
        box.css("left", tX);
        box.css("top", tY);
       
    },

    arrowReset: function() { },

    close: function() {
        if ( !this.isOpen ) return;

        var self = this;
        this.ui.screen.addClass("ui-screen-hidden");
        this.ui.box.addClass("ui-selectmenu-hidden").removeAttr("style");
        this.arrowReset( this.ui.arrow );
        this.ui.container.removeAttr("style");
        this.ui.arrow.removeAttr("style");
        this.isOpen = false;
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
            elem: elem,
            isOpen: false,
            ui: ui,
            thisPage: thisPage,
            owner: owner
        });
        
        var horizontal = $(elem).attr("data-horizontal");
        this.options.horizontal = (horizontal == "true" || horizontal == "True");
        var transparency = $(elem).attr("data-transparency");
        this.options.transparency = (transparency == "true" || transparency == "True");
        var title = $(elem).attr("data-title");
        if (title) {
            this.options.title = title;
            if ( this.options.transparency ) {
                this.ui.container.prepend( '<div class="title-line">' + this.options.title + '</div>' );
            }
        }

   },

 
});

$(document).bind("pagecreate create", function(e) {
    $($.todons.ctxpopup.prototype.options.initSelector, e.target)
    .not(":jqmData(role='none'), :jqmData(role='nojs')")
    .ctxpopup();
});

})(jQuery);
