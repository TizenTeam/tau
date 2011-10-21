function SLPRect( x, y, w, h ) {
        this.x = x || 0;
        this.y = y || 0;
        this.w = w || 0;
        this.h = h || 0;

        this.applyTo = function( target ) {
            target.css( "left", this.x );
            target.css( "top", this.y );
        }
}

(function( $, undefined ) {

$.widget( "todons.ctxpopup", $.mobile.widget, {
    options: {
        title: undefined,
        supportedStyle: [ 'vlist', 'hlist', 'image', 'image-title', 'icon', 'button', 'picker' ],
        style: 'vlist',
        vscrollPoint: 0.7,
        hscrollPoint: 0.7,
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

    _initStyle: function() {
        
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
        
        this._initStyle();

        var ui = $(this.ui),
            box = $(this.ui.box),
            arrow = $(this.ui.arrow),
            container = $(this.ui.container);
        
        var boxRect = new SLPRect(),
            arrowRect = new SLPRect(
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

        var ul = this.elem.find("li"); 
        // set box size
        switch (this.options.style) {
        default:
        case 'image':
        case 'vlist':
        case 'button': 
            this._checkVScroll( ul, container, containerRect, screenRect.h );
            break;
        case 'hlist':
        case 'icon': 
            this._checkHScroll( ul, container, containerRect, screenRect.w );
            break;
        case 'picker': //already processed - never reach code.

            break;
        }

        // get entire box location and direction
        var idx;
        var priority = this.options.directionPriority;
        for ( idx = 0; idx < 4; idx++ ) {
            switch ( priority[ idx ] ) {
            case 'up':
            case 'down':
                boxRect.w = containerRect.w;
                boxRect.h = containerRect.h + arrowRect.h;
                boxRect.x = x_where - boxRect.w / 2 + screenRect.x;
                if ( priority[idx] == 'up' ) {
                    boxRect.y = y_where + screenRect.y;
                    if ( boxRect.y + boxRect.h > screenRect.y + screenRect.h ) {
                        continue;
                    }
                } else { // 'down'
                    boxRect.y = y_where - boxRect.h + screenRect.y;
                    if ( boxRect.y < screenRect.y ) {
                        continue;
                    }
                }
                
                if ( boxRect.x + boxRect.w > screenRect.x + screenRect.w ) {
                    boxRect.x = screenRect.x + screenRect.w - boxRect.w;
                }
                if ( boxRect.x < screenRect.x ) {
                    boxRect.x = screenRect.x;
                }
                break;
            case 'left':
            case 'right':
                boxRect.w = containerRect.w + arrowRect.w;
                boxRect.h = containerRect.h;
                boxRect.y = y_where - boxRect.h / 2 + screenRect.y;
                if ( priority[ idx ] == 'left' ) {
                    boxRect.x = x_where + screenRect.x;
                    if ( boxRect.x + boxRect.w > screenRect.x + screenRect.w ) {
                        continue;
                    }
                } else { // 'right'
                    boxRect.x = x_where - boxRect.w + screenRect.x;
                    if ( boxRect.x < screenRect.x ) {
                        continue;
                    }
                }
                if ( boxRect.y + boxRect.h > screenRect.y + screenRect.h ) {
                    boxRect.y = screenRect.y + screenRect.h - boxRect.h;
                }
                if ( boxRect.y < screenRect.y ) {
                    boxRect.y = screenRect.y;
                }
                break;
            default:
                break;
            }
            break;
        }

        if( idx < priority.length ) { // normaly located
            this._alignContainerArrow( priority[idx], 
                container, arrow, 
                containerRect, arrowRect, boxRect, 
                x_where, y_where );

            arrowRect.applyTo( arrow );

        } else { // can't locate position. bring to center of screen 
            boxRect.w = containerRect.w; // remove tail
            boxRect.h = containerRect.h; 
            boxRect.x = x_where - boxRect.w / 2 + screenRect.x;
            boxRect.y = y_where - boxRect.h / 2 + screenRect.y;
           
            arrow.addClass("ui-selectmenu-hidden");
            this._arrowReset = function(arrow) {
                arrow.removeClass("ui-selectmenu-hidden");
            }
        }
 
        box.removeClass( "ui-selectmenu-hidden" );
        boxRect.applyTo( box );
        containerRect.applyTo( container );
    },

    _checkHScroll: function( ul, container, containerRect, screenWidth ) {
        var isScroll = false,
            length = 0;

        for ( var idx = 0; idx < ul.length; idx++ ) {
            var tW = $(ul[idx]).outerWidth(true);
            if ( length + tW > screenWidth * this.options.hscrollPoint && !isScroll ) {
                this.elem.scrollview( {
                    showScrollBars: false,
                    direction: "x",
                } );
                container.width( length );
                containerRect.w = container.outerWidth(true);
                this.elem.width( length );
                isScroll = true;
            }
            length += tW;
        }
            
        if ( isScroll ) {
            this.elem.children().first().width( length );
        }
    },

    _checkVScroll: function( ul, container, containerRect, screenHeight ) {
        var isScroll = false,
            length = 0;

        for ( var idx = 0; idx < ul.length; idx++ ) {
            var tH = $(ul[idx]).outerHeight( true );
            if ( length + tH > screenHeight * this.options.vscrollPoint && !isScroll ) {
                this.elem.scrollview( {
                    showScrollBars: false,
                    direction: "y"
                } );
                container.height( length );
                containerRect.h = container.outerHeight( true );
                this.elem.height( length );
                isScroll = true;
            }
            length += tH;
        }

        if ( isScroll ) {
            this.elem.children().first().height( length );
        }
    },


    _alignContainerArrow: function( direction, container, arrow, 
            containerRect, arrowRect, boxRect, x, y) {
         // setting up arrow direction and container location        
        var border_width = container.outerWidth( true ) - container.innerWidth( true );
        switch (direction) {
        case 'up':
            containerRect.y = -border_width / 2;
            arrowRect.x = x - boxRect.x - arrowRect.w / 2;
            arrow.addClass("arrow-top");
            this._arrowReset = function( arrow ) { 
                arrow.removeClass( "arrow-top" );  
            };
            break;
        case 'down':
            containerRect.y = -arrowRect.h + border_width;
            arrowRect.y = containerRect.h
            arrowRect.x = x - boxRect.x - arrowRect.w / 2;
            arrow.addClass( "arrow-bottom" );
            this._arrowReset = function( arrow ) {
                arrow.removeClass( "arrow-bottom" );
            };
            break;
        case 'left':
            containerRect.x = arrowRect.w - border_width / 2;
            containerRect.y = -arrowRect.h;
            arrowRect.y = y - boxRect.y - arrowRect.h / 2;
            arrow.addClass( "arrow-left" );
            this._arrowReset = function( arrow ) { 
                arrow.removeClass( "arrow-left" );
            };
            break;
        case 'right':
            containerRect.x = -arrowRect.w + border_width;
            containerRect.y = -arrowRect.h;
            arrowRect.x = containerRect.w;
            arrowRect.y = y - boxRect.y - arrowRect.h / 2;
            arrow.addClass( "arrow-right" );
            this._arrowReset = function( arrow ) {
                arrow.removeClass( "arrow-right" );
            };
            break;
        }
    },

    _arrowReset: function() { },

    close: function() {
        if ( !this.isOpen ) return;

        this.ui.screen.addClass( "ui-screen-hidden" );
        this.ui.box.addClass( "ui-selectmenu-hidden" ).removeAttr( "style" );
        this._arrowReset( this.ui.arrow );
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
