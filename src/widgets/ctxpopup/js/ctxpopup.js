/*
 * Copyright (c) 2011 Samsung Electronics Co., Ltd All Rights Reserved
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.

 * Author: Jung, Daehyeon <darrenh.jung@samsung.com>
 */

/**
 * A ctxpopup is a widget that, when shown, pops up a list of items. It 
 * automatically chooses an area inside screen to optimally fit into it. 
 * In the default theme, it will also point an arrow to it's top left 
 * position at the time one shows it. It is intended for a small number 
 * of items (hence the use of list, not genlist).
 *
 * HTML Attributes:
 *
 *  data-role: This widget must have 'ctxpopup' as data-role value.
 *  data-style: 'vlist', 'hlist', 'button', 'picker' 
 *  data-selector: (Optional) CSS Selector which desire to invoke popup.
 *
 * APIs:
 *  pop( x, y, owner )
 *   : Popup at x, y position with owner element's context.
 *  close( )
 *   : Close ctxpopup.
 *
 * Events:
 *  close: Raised when popup was closed.
 *
 * Examples:
 *
 * <a href="#" id="btn_text_only" data-role="button" data-inline="true">Text Only</a> 
 * <div id="pop_text_only" data-role="ctxpopup" data-selector="#btn_text_only">
 *     <ul data-role="listview">
 * 	       <li><a href="http://www.naver.com">www.naver.com</a></li>
 *         <li><a href="http://www.naver.com">www.naver.com</a></li>
 *         <li><a href="http://www.samsung.com">www.samsung.com</a></li>
 *         <li><a href="http://www.apple.com">www.apple.com</a></li>
 *     </ul>
 * </div>
 *
 * <a href="#" id="btn_buttons" data-role="button" data-inline="true">Buttons</a> 
 * <div id="pop_buttons" data-role="ctxpopup" data-selector="#btn_buttons" data-style="button">
 *     <div>
 *         <table>
 *             <tr><td><a href="#" data-role="button">Meenie</a></td><td><a href="#" data-role="button">Mynie</a></td><td><a href="#" data-role="button">Mo</a></td></tr>
 *             <tr><td><a href="#" data-role="button">Catch-a</a></td><td><a href="#" data-role="button">Tiger</a></td><td><a href="#" data-role="button">By-the</a></td></tr>
 *         </table>
 *     </div>
 * </div>
 *
 * Note:
 * 	any elements inside ctxpopup with "ui-btn-ctxpopup-close" class will invoke popup close.
 */

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
        supportedStyle: [ 'vlist', 'hlist', 'button', 'picker' ],
        style: 'vlist',
        vscrollPoint: 0.7,
        hscrollPoint: 0.7,
        horizontalPriority: [ 'up', 'down', 'left', 'right' ],
        directionPriority: [ 'left', 'right', 'up', 'down'],
        pickerCenterSelector: '.current',
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
 
    pop: function(x_where, y_where, owner) {
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
                                arrow.outerHeight( true )),
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
            container.pannig = false;
            container.circularview()
                .bind('vclick', function(e) {
                    //console.log("vclick");
                    if ( this.panning ) {
                        //console.log("prevent" );
                        e.preventDefault();
                        e.stopPropagation();
                    }
                })
                .bind('scrollstart', function(e) {
                    this.panning = true;
                    //console.log('scrollstart');
                })
                .bind('scrollstop', function() {
                    this.panning = false;
                    //console.log('scrollstop');
                });
            var current = container.find( this.options.pickerCenterSelector );
            if ( current ) {
                container.circularview( 'centerTo', this.options.pickerCenterSelector );
            }
 
            box.removeClass( "ui-selectmenu-hidden" ); 
            
            ownerHeight = 0;
            if ( owner ) {
                ownerHeight = owner.height();
            }

            // top
            if ( y_where + containerRect.h + arrowRect.h + ownerHeight < screenRect.h ) {
                
                box.css( "top", y_where + screenRect.y + ownerHeight );
                box.css( "left", 0 );

                arrow.css( "left", x_where - arrowRect.w / 2);
                arrow.css( "top", 0 );
                arrow.addClass("arrow-top");
            } else { // bottom
                box.css( "top", y_where - containerRect.h - arrowRect.h + screenRect.y - ownerHeight );
                box.css( "left", 0 );
                
                arrow.css( "left", x_where - arrowRect.w / 2);
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
        case 'vlist':
        case 'button': 
            this._checkVScroll( ul, container, containerRect, screenRect.h );
            break;
        case 'hlist':
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
                x_where + screenRect.x, y_where + screenRect.y );

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
        
        $( this.elem ).find( ".ui-btn" ).removeClass( "ui-btn-hover-s" ).removeClass( "ui-btn-down-s" ).addClass( "ui-btn-up" ).addClass( "ui-btn-up-s" );
        
        this.isOpen = false;
        $(this.elem).trigger('close');
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
        
        var selector = $(elem).jqmData("selector"); 
        if ( selector ) {
            $( selector ).live( "vclick", function( e ) {
                self.pop( e.clientX, e.clientY );
            });
        }
        
        $( ".ui-ctxpopup .ui-btn-ctxpopup-close" ).live( "vclick", function() {
            self.close();
            return false;
        });

        $.extend( self, {
            elem: elem,
            isOpen: false,
            ui: ui,
            thisPage: thisPage,
            owner: owner
        });
        
        var style = $(elem).jqmData("style")
        this.options.style = style || 'vlist';
   },

 
});

$(document).bind( "pagecreate create", function( e ) {
    $($.todons.ctxpopup.prototype.options.initSelector, e.target)
    .not( ":jqmData(role='none'), :jqmData(role='nojs')" )
    .ctxpopup();
});

})(jQuery);
