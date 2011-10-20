function SLPRect( x, y, w, h ) {
        this.x = x || 0;
        this.y = y || 0;
        this.w = w || 0;
        this.h = h || 0;
}

(function( $, undefined ) {

$.widget( "todons.ctxpopup", $.mobile.widget, {
    options: {
        title: undefined,
        supportedStyle: [ 'vlist', 'hlist', 'image', 'image-title', 'icon', 'button', 'picker' ],
        style: 'vlist',
        horizontalPriority: [ 'up', 'down', 'left', 'right' ],
        directionPriority: [ 'left', 'right', 'up', 'down'],
        initSelector: ":jqmData(role='ctxpopup')",
    },
    
    getSupportedStyle: function() {
        return this.options.supportedStyle;
    },

    setDirectionPriority: function( priority ) {
        this.options.directionPriority = priority;
    },

    _setTheme: function() {
        
        switch (this.options.style) {
        case 'vlist':
            this.ui.container.addClass("vlist");       
            this.ui.arrow.addClass("vlist");
        break;
        case 'hlist':
            this.ui.container.addClass("hlist");
            this.ui.arrow.addClass("hlist");
            this.options.directionPriority = this.options.horizontalPriority;
        break;
        case 'image': // 'image-title' also use this
            this.ui.container.addClass("image");
            this.ui.arrow.addClass("image");
        break;
        case 'icon':
            this.ui.container.addClass("icon");
            this.ui.arrow.addClass("icon");
            this.options.directionPriority = this.options.horizontalPriority;
            /* 
             * followings are highly dependent to nbeat-theme.
             * need to find other way 
             */
            var div = this.ui.container.find( "li" );
            switch ( div.length ) {
            case 0:
            case 1:
            case 2:
            case 3:
                div.addClass( "ico-3-list" );
            break;
            case 4:
                div.addClass( "ico-4-list" );
            break;
            default:
                div.addClass( "ico-5-list" );
            break;
            }
        break;
        case 'picker':
            this.ui.container.addClass("picker");
            this.ui.arrow.addClass("picker");
            this.options.directionPriority = this.options.horizontalPriority;
        break;
        case 'button':
            this.ui.container.addClass("button");
            this.ui.arrow.addClass("button");
            this.options.directionPriority = this.options.horizontalPriority;
        break;
        }

    },

    pop: function(x_where, y_where) {
        if ( this.isOpen ) return;

        this.isOpen = true;
        
        this._setTheme();

        var ui = $(this.ui),
            box = $(this.ui.box),
            arrow = $(this.ui.arrow),
            container = $(this.ui.container);
        
        var arrowRect = new SLPRect(
                                0, 0, 
                                arrow.outerWidth( true ),
                                arrow.outerWidth( true )),
            containerRect = new SLPRect(
                                0, 0, 
                                container.outerWidth( true ),
                                container.outerHeight( true )),
            screenRect = new SLPRect( 
                                window.pageXOffset,
                                window.pageYOffset,
                                window.innerWidth,
                                window.innerHeight );
        this.ui.screen
            .height( $(document).height() )
            .removeClass( "ui-screen-hidden" );
        
        /* XXX: NEED TO REFACTOR THIS */
        if ( this.options.style == "picker" ) {
            container.scrollview( {
                direction: "x",
                showScrollBars: false,
            });
            
            var itemWidth = container.find("li").outerWidth();
            
            this.elem.width( itemWidth * container.find("li").length );
            
            container.width( screenRect.w );
            box.removeClass( "ui-selectmenu-hidden" ); 
            
            // top
            if ( y_where + containerRect.h + arrowRect.h < screenRect.h ) {
                box.css( "top", y_where + screenRect.y );
                box.css( "left", 0 );

                arrow.css( "left", x_where - arrowRect.w / 2 );
                arrow.addClass("arrow-top");
            } else { // bottom
                box.css( "top", y_where - containerRect.h - arrowRect.h + screenRect.y );
                box.css( "left", 0 );

                arrow.css( "left", x_where - arrowRect.w / 2 );
                arrow.addClass( "arrow-bottom" );
                arrow.css( "top", containerRect.h );

                container.css( "top", -arrowRect.h );
            }
           return;
        }

        // set box size
        switch (this.options.style) {
        default:
        case 'image':
        case 'vlist':
        case 'button':
            if ( this.elem.height() > container.height() ) {
                this.elem.scrollview( {
                    showScrollBars: false,
                    direction: "y",
                } );
            }
            break;
        case 'hlist':
        case 'icon':
            if ( this.elem.width() > container.width() ) {
                this.elem.scrollview( {
                    showScrollBars: false,
                    direction: "x",
                });
            }
            break;
        case 'picker': //already processed - never reach code.

            break;
        }

        // get entire box location and direction

        var tX, tY, tW, tH, idx;
        var priority = this.options.directionPriority;
        for ( idx = 0; idx < 4; idx++ ) {
            switch ( priority[ idx ] ) {
            case 'up':
                tW = containerRect.w;
                tH = containerRect.h + arrowRect.h;
                tX = x_where - tW / 2 + screenRect.x;
                tY = y_where + screenRect.y;
                if ( tY + tH > screenRect.y + screenRect.h )
                    continue;
                while ( tX + tW > screenRect.x + screenRect.w ) {
                    tX--;
                }
                while ( tX < screenRect.x ) {
                    tX++;
                }
                break;
            case 'down':
                tW = containerRect.w;
                tH = containerRect.h + arrowRect.h;
                tX = x_where - tW / 2 + screenRect.x;
                tY = y_where - tH + screenRect.y;
                if ( tY < screenRect.y )
                    continue;
                while ( tX + tW > screenRect.x + screenRect.w ) {
                    tX--;
                }
                while ( tX < screenRect.x ) {
                    tX++;
                }

                break;
            case 'left':
                tW = containerRect.w + arrowRect.w;
                tH = containerRect.h;
                tX = x_where + screenRect.x;
                tY = y_where - tH / 2 + screenRect.y;
                if ( tX + tW > screenRect.x + screenRect.w )
                    continue;
                while ( tY + tH > screenRect.y + screenRect.h ) {
                    tY--;
                }
                while ( tY < screenRect.y ) {
                    tY++;
                }
                break;
            case 'right':
                tW = containerRect.w + arrowRect.w;
                tH = containerRect.h;
                tX = x_where - tW + screenRect.x;
                tY = y_where - tH / 2 + screenRect.y;
                if ( tX < screenRect.x )
                    continue;
                while ( tY + tH > screenRect.y + screenRect.h ) {
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
            alert( "Can\'t open popup: (Out of space)" );
            isOpen = false;
            return;
        }
        
        // setting up arrow direction and container location
        
        var border_width = container.outerWidth( true ) - container.innerWidth( true );

        switch (priority[idx]) {
        case 'up':
            container.css( "top", -border_width / 2 );
            arrow.css( "left", x_where - tX - arrowRect.w / 2 );
            arrow.addClass("arrow-top");
            this.arrowReset = function( arrow ) { 
                arrow.removeClass( "arrow-top" );  
            };
            break;
        case 'down':
            container.css( "top", -arrowRect.h + border_width );
            arrow.css( "top", containerRect.h);
            arrow.css( "left", x_where - tX - arrowRect.w / 2 );
            arrow.addClass( "arrow-bottom" );
            this.arrowReset = function( arrow ) {
                arrow.removeClass( "arrow-bottom" );
            };
            break;
        case 'left':
            container.css( "left",arrowRect.w - border_width / 2 );
            container.css( "top",-arrowRect.h );
            arrow.css( "top", y_where - tY - arrowRect.h / 2 );
            arrow.addClass( "arrow-left" );
            this.arrowReset = function( arrow ) { 
                arrow.removeClass( "arrow-left" );
            };
            break;
        case 'right':
            container.css( "left", -arrowRect.w + border_width );
            container.css( "top", -arrowRect.h );
            arrow.css( "left", containerRect.w );
            arrow.css( "top", y_where - tY - arrowRect.h / 2 );
            arrow.addClass( "arrow-right" );
            this.arrowReset = function( arrow ) {
                arrow.removeClass( "arrow-right" );
            };
            break;
        }

        
        box.removeClass( "ui-selectmenu-hidden" );
        
        box.css( "left", tX );
        box.css( "top", tY );
       
    },

    arrowReset: function() { },

    close: function() {
        if ( !this.isOpen ) return;

        var self = this;
        this.ui.screen.addClass( "ui-screen-hidden" );
        this.ui.box.addClass( "ui-selectmenu-hidden" ).removeAttr( "style" );
        this.arrowReset( this.ui.arrow );
        this.ui.container.removeAttr( "style" );
        this.ui.arrow.removeAttr( "style" );
        this.isOpen = false;
    },

    _create: function() {
        var self = this,
            elem = this.element,
            owner = undefined,
            thisPage = elem.closest( ".ui-page" ),
            ui = {
                screen:     "#ctxpopup-screen",
                box:        "#ctxpopup-box",
                arrow:      "#ctxpopup-arrow",
                container:  "#ctxpopup-container"
            };
 
              
        ui = $.mobile.todons.loadPrototype( "ctxpopup", ui );
        thisPage.append( ui.screen );
        ui.box.insertAfter( ui.screen );
        ui.container.append( elem );
        $.mobile.todons.parseOptions( this, true );

        ui.screen.bind( "vclick", function( e ) {
            self.close();
        });
        
        var ctxid = $(elem).attr( "data-ctxid" ); 
        if ( ctxid ) {
            owner = $(document).find( "#" + ctxid );
            owner.bind( "vclick", function( e ) {
                self.pop( e.clientX, e.clientY );
            });
        }
        
        $.extend( self, {
            elem: elem,
            isOpen: false,
            ui: ui,
            thisPage: thisPage,
            owner: owner
        });
        
        var style = $(elem).attr("data-style");
        switch (style) {
        case 'picker':
            this.options.style = 'picker';
        break;
        case 'vlist':
            this.options.style = 'vlist';
        break;
        case 'hlist':
            this.options.style = 'hlist';
        break;
        case 'image':
            this.options.style = 'image';
        break;
        case 'image-title':
            this.options.style = 'image';
            this.ui.container.prepend( 
                '<div class="title-line">' + 
                $(elem).attr( "title" ) + 
                '</div');
        break;
        case 'button':
            this.options.style = 'button';
        break;
        case 'icon':
            this.options.style = 'icon';
        break;
        default:
            this.options.style = 'vlist';
        break;
        }

   },

 
});

$(document).bind( "pagecreate create", function( e ) {
    $($.todons.ctxpopup.prototype.options.initSelector, e.target)
    .not( ":jqmData(role='none'), :jqmData(role='nojs')" )
    .ctxpopup();
});

})(jQuery);
