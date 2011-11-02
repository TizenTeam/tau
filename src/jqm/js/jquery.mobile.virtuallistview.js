/*
* jQuery Mobile Framework : "Virtual listview" plugin
* Copyright (c) Lee, Wongi (wongi11.lee@samsung.com)
* Dual licensed under the MIT or GPL Version 2 licenses.
* http://jquery.org/license
*/

(function( $, undefined ) {

//Keeps track of the number of lists per page UID
//This allows support for multiple nested list in the same page
//https://github.com/jquery/jquery-mobile/issues/1617
var listCountPerPage = {};

/* Code for Virtual List Demo */
var	INIT_LIST_NUM = 50;
var	TOTAL_ITEMS = 500;
var	PAGE_BUF = (INIT_LIST_NUM/2);
var	NO_SCROLL = 0;
var	SCROLL_DOWN = 1;
var	SCROLL_UP = -1;
var LINE_H = 0;
var TITLE_H = 0;	
var CONTAINER_W = 0;

var i =0, j=0, k=0;
var ex_windowTop = 0;
var direction = NO_SCROLL;
var start_index = 0; 				//first item's index on screen.
var first_index = 0;				//first id of <li> element.
var last_index = INIT_LIST_NUM -1;	//last id of <li> element.

var demo_names = [
		"Aaliyah","Aamir","Aaralyn","Aaron","Abagail","Babitha","Bahuratna","Bandana",
		"Bulbul","Cade","Caldwell","CaptainFantasticFasterThanSuperman",
		"Chandan", "Caster", "Dagan ", "Daulat", "Dag", "Earl", "Ebenzer",
		"Ellison", "Elizabeth", "Filbert", "Fitzpatrick", "Florian",
		"Fulton", "Frazer", "Gabriel", "Gage", "Galen", "Garland",
		"Gauhar", "Hadden", "Hafiz", "Hakon", "Haleem", "Hank", "Hanuman",
		"Jabali ", "Jaimini", "Jayadev", "Jake", "Jayatsena", "Jonathan",
		"Kamaal", "Jeirk", "Jasper", "Jack", "Mac", "Macy", "Marlon",
		"Milson", "Aaliyah", "Aamir", "Aaralyn", "Aaron", "Abagail",
		"Babitha", "Bahuratna", "Bandana", "Bulbul", "Cade", "Caldwell",
		"Chandan", "Caster", "Dagan ", "Daulat", "Dag", "Earl", "Ebenzer",
		"Ellison", "Elizabeth", "Filbert", "Fitzpatrick", "Florian",
		"Fulton", "Frazer", "Gabriel", "Gage", "Galen", "Garland",
		"Gauhar", "Hadden", "Hafiz", "Hakon", "Haleem", "Hank", "Hanuman",
		"Jabali ", "Jaimini", "Jayadev", "Jake", "Jayatsena", "Jonathan",
		"Kamaal", "Jeirk", "Jasper", "Jack", "Mac", "Macy", "Marlon",
		"Milson" ];		


$.widget( "mobile.virtuallistview", $.mobile.widget, {
	options: {
		theme: "s",
		countTheme: "c",
		headerTheme: "b",
		dividerTheme: "b",
		splitIcon: "arrow-r",
		splitTheme: "b",
		inset: false,
		liststyle: "3-1-1",	/* Default : 3-1-1 */
		initSelector: ":jqmData(role='virtuallistview')"
	},

	_initList: function() {
		var o = this.options;
		
		for (i = 0; i < INIT_LIST_NUM; i++)
		{
			/* For list style demo */
			if (o.liststyle == "3-1-1")	/* Default */
			{
				$('ul.ui-virtual-list-container').append($("<li class='ui-li-" + o.liststyle +"'></li>").text('<' + i + '> ' + demo_names[(i % (demo_names.length))]).attr('id', 'li_'+i));			
			}
			else if (o.liststyle == "3-1-4")
			{
				$('ul.ui-virtual-list-container')
				.append($("<li class='ui-li-" + o.liststyle +"'><span class='ui-li-text-main'>"+('<' + i + '> ' + demo_names[(i % (demo_names.length))]) +"</span><div data-role='button' data-inline='true'>Text Button</div></li>")
				/*.text('<' + i + '> ' + demo_names[(i % (demo_names.length))])*/
				.attr('id', 'li_'+i));				
				
				/*<span class="ui-li-text-main">3.1.4</span>
				<div data-role="button" data-inline="true">Text Button</div>*/			
			}
			else if (o.liststyle == "3-1-6")
			{
				/*<span class="ui-li-text-main">3.1.6</span>
				<form><input type="checkbox" data-style="onoff"/></form>*/
			}
			else if (o.liststyle == "3-1-14")
			{
				/*<span class="ui-li-text-main">3.1.14</span>
				<img src="thumbnail.jpg" class="ui-li-bigicon">
				<div data-role="button" data-inline="true" data-icon="plus" data-style="circle"></div>*/
			}
			else if (o.liststyle == "3-2-7")
			{
				/*<span class="ui-li-text-main">3.2.7</span>
				<img src="00_winset_icon_favorite_on.png" class="ui-li-icon-sub">
				<span class="ui-li-text-sub">Subtext</span>
				<span class="ui-li-text-sub2">Subtext2</span>*/
			}

			j++;
		}
		
		this.refresh(true);
	},

	_reposition: function(){
		TITLE_H = $('ul.ui-virtual-list-container li:eq(0)').position().top;
		/*LINE_H = $('ul.ui-virtual-list-container li:eq(1)').position().top - TITLE_H + 7;*/ /* 7 is margin for border line. later, it should be removed. */
		/*LINE_H = $('ul.ui-virtual-list-container li:first').outerHeight();*/ 
		LINE_H = $('ul.ui-virtual-list-container li:first').innerHeight();

		CONTAINER_W = $('ul.ui-virtual-list-container').innerWidth();
		
		var padding = parseInt($("ul.ui-virtual-list-container li").css("padding-right")); 
		padding += parseInt($("ul.ui-virtual-list-container li").css("border-left-width"));
		
		$("ul.ui-virtual-list-container li").addClass("position_absolute");

		$('ul.ui-virtual-list-container li').each(function(index){
			$(this).css("top", TITLE_H + LINE_H*index + 'px')
			.css("width", CONTAINER_W - padding*2);
		});

		/* Set Max List Height */
		$('ul.ui-virtual-list-container').height(TOTAL_ITEMS * LINE_H);
	},
	
	_scrollmove: function(){
		var windowTop = Math.floor($(document).scrollTop());
		var windowHeight = Math.floor($(window).height());
		var velocity = 0;
		
		//Move older item to bottom
		var _moveTopBottom= function(v_firstIndex, v_lastIndex, num)
		{
			if (v_firstIndex < 0)
				return;
			
			for (i=0; i<num; i++)
			{
				if (v_lastIndex + i > TOTAL_ITEMS)
					break;
				
				var cur_item = $('#li_' + (v_firstIndex + i));
				
				if (cur_item)
				{
					$(cur_item).attr('id', 'li_'+ (v_lastIndex+1+i));
					$(cur_item).css('top', TITLE_H + LINE_H*(v_lastIndex+i));
					$(cur_item).find(".ui-li-text-main").text('<' + (v_lastIndex+i) + '> ' + demo_names[((v_lastIndex+i) % (demo_names.length))]);
				}
				else
					break;
			}
		};

		// Move older item to bottom
		var _moveBottomTop= function(v_firstIndex, v_lastIndex, num)
		{
			if (v_firstIndex < 0)
				return;
			
			for (i=0; i<num; i++)
			{
				var cur_item = $('#li_' + (v_lastIndex - i));

				if (cur_item)
				{
					if (v_firstIndex-1-i < 0)
						break;
					
					$(cur_item).attr('id', 'li_'+ (v_firstIndex -1-i));
					$(cur_item).css('top', TITLE_H + LINE_H*(v_firstIndex-1-i));
					$(cur_item).find(".ui-li-text-main").text('<' + (v_firstIndex-1-i) + '> ' + demo_names[((v_firstIndex-1-i) % (demo_names.length))]);
				}
				else
					break;
			}
		};

		// Get scroll direction and velocity
		if (ex_windowTop < windowTop)
		{
			direction = SCROLL_DOWN;
			velocity = Math.ceil((Math.abs(ex_windowTop - windowTop))/ LINE_H);
		}
		else if (ex_windowTop > windowTop)
		{
			direction = SCROLL_UP;
			velocity = Math.ceil((Math.abs(ex_windowTop - windowTop))/ LINE_H);
		}
		else
		{
			direction = NO_SCROLL;
			return;
		}

		ex_windowTop = windowTop;

		//Calculate first index on screen
		if(direction == SCROLL_DOWN)
		{
			start_index += velocity;
		}
		else if(direction == SCROLL_UP)
		{
			start_index -= velocity;
			
			if (start_index < 0)
				start_index = 0;
		}

		// Move items
		if (direction == SCROLL_DOWN && start_index < PAGE_BUF)
		{
			//Don't move	
		}
		else if(direction == SCROLL_UP && start_index < PAGE_BUF)	//Fill full all buffers
		{
			_moveBottomTop(first_index, last_index, first_index+1);
			last_index -= first_index;
			first_index -= first_index;
		}
		else
		{
			if(direction == SCROLL_DOWN)
			{
				_moveTopBottom(first_index, last_index, velocity);
				first_index += velocity;
				last_index += velocity;
			}
			else if(direction == SCROLL_UP)
			{
				_moveBottomTop(first_index, last_index, velocity);
				first_index -= velocity;
				last_index -= velocity;
			}
		}
		
	},

	_create: function(event) {
		var t = this;
		
		// create listview markup
		t.element.addClass(function( i, orig ) {
			return orig + " ui-listview ui-virtual-list-container" + ( t.options.inset ? " ui-listview-inset ui-corner-all ui-shadow " : "" );
		});

        var $el = this.element,
        o = this.options,
        shortcutsContainer = $('<div class="ui-virtuallist"/>'),
        shortcutsList = $('<ul></ul>'),
        dividers = $el.find(':jqmData(role="virtuallistview")'),
        lastListItem = null,
        shortcutscroll = this;

        /* Get Style */
        if (this.element.data('style'))
        {
        	o.liststyle = t.element.data('style');
        }
        
		ex_windowTop = Math.floor($(document).scrollTop());
	    
		t._initList(); //Initialize Widget
		
	    $('ul.ui-virtual-list-container').bind("pagehide", function(e){
			$('ul.ui-virtual-list-container').empty();
		});
	    
	    $(document).bind("pageshow", t._reposition);
	    $(document).bind('scrollstop', t._scrollmove);
		
		t.refresh( true );
	},
	
	destroy : function(){
		$(document).unbind("pageshow");
		$(document).unbind("scrollstop");
	},
	
	_itemApply: function( $list, item ) {
		var $countli = item.find( ".ui-li-count" );
		if ( $countli.length ) {
			item.addClass( "ui-li-has-count" );
		}
		$countli.addClass( "ui-btn-up-" + ( $list.jqmData( "counttheme" ) || this.options.countTheme ) + " ui-btn-corner-all" );

		// TODO class has to be defined in markup
		item.find( "h1, h2, h3, h4, h5, h6" ).addClass( "ui-li-heading" ).end()
			.find( "p, dl" ).addClass( "ui-li-desc" ).end()
			.find( ">img:eq(0), .ui-link-inherit>img:eq(0)" ).addClass( "ui-li-thumb" ).each(function() {
				item.addClass( $(this).is( ".ui-li-icon" ) ? "ui-li-has-icon" : "ui-li-has-thumb" );
			}).end()
			.find( ".ui-li-aside" ).each(function() {
				var $this = $(this);
				$this.prependTo( $this.parent() ); //shift aside to front for css float
			});
	},

	_removeCorners: function( li, which ) {
		var top = "ui-corner-top ui-corner-tr ui-corner-tl",
			bot = "ui-corner-bottom ui-corner-br ui-corner-bl";

		li = li.add( li.find( ".ui-btn-inner, .ui-li-link-alt, .ui-li-thumb" ) );

		if ( which === "top" ) {
			li.removeClass( top );
		} else if ( which === "bottom" ) {
			li.removeClass( bot );
		} else {
			li.removeClass( top + " " + bot );
		}
	},

	_refreshCorners: function( create ) {
		var $li,
			$visibleli,
			$topli,
			$bottomli;

		if ( this.options.inset ) {
			$li = this.element.children( "li" );
			// at create time the li are not visible yet so we need to rely on .ui-screen-hidden
			$visibleli = create?$li.not( ".ui-screen-hidden" ):$li.filter( ":visible" );

			this._removeCorners( $li );

			// Select the first visible li element
			$topli = $visibleli.first()
				.addClass( "ui-corner-top" );

			$topli.add( $topli.find( ".ui-btn-inner" ) )
				.find( ".ui-li-link-alt" )
					.addClass( "ui-corner-tr" )
				.end()
				.find( ".ui-li-thumb" )
					.not(".ui-li-icon")
					.addClass( "ui-corner-tl" );

			// Select the last visible li element
			$bottomli = $visibleli.last()
				.addClass( "ui-corner-bottom" );

			$bottomli.add( $bottomli.find( ".ui-btn-inner" ) )
				.find( ".ui-li-link-alt" )
					.addClass( "ui-corner-br" )
				.end()
				.find( ".ui-li-thumb" )
					.not(".ui-li-icon")
					.addClass( "ui-corner-bl" );
		}
	},

	refresh: function( create ) {
		this.parentPage = this.element.closest( ".ui-page" );
		this._createSubPages();

		var o = this.options,
			$list = this.element,
			self = this,
			dividertheme = $list.jqmData( "dividertheme" ) || o.dividerTheme,
			listsplittheme = $list.jqmData( "splittheme" ),
			listspliticon = $list.jqmData( "spliticon" ),
			li = $list.children( "li" ),
			counter = $.support.cssPseudoElement || !$.nodeName( $list[ 0 ], "ol" ) ? 0 : 1,
			item, itemClass, itemTheme,
			a, last, splittheme, countParent, icon;

		if ( counter ) {
			$list.find( ".ui-li-dec" ).remove();
		}

		for ( var pos = 0, numli = li.length; pos < numli; pos++ ) {
			item = li.eq( pos );
			itemClass = "ui-li";

			// If we're creating the element, we update it regardless
			if ( create || !item.hasClass( "ui-li" ) ) {
				itemTheme = item.jqmData("theme") || o.theme;
				a = item.children( "a" );

				if ( a.length ) {
					icon = item.jqmData("icon");

					item.buttonMarkup({
						wrapperEls: "div",
						shadow: false,
						corners: false,
						iconpos: "right",
						/* icon: a.length > 1 || icon === false ? false : icon || "arrow-r",*/
						icon: false,	/* Remove unnecessary arrow icon */
						theme: itemTheme
					});

					if ( ( icon != false ) && ( a.length == 1 ) ) {
						item.addClass( "ui-li-has-arrow" );
					}

					a.first().addClass( "ui-link-inherit" );

					if ( a.length > 1 ) {
						itemClass += " ui-li-has-alt";

						last = a.last();
						splittheme = listsplittheme || last.jqmData( "theme" ) || o.splitTheme;

						last.appendTo(item)
							.attr( "title", last.getEncodedText() )
							.addClass( "ui-li-link-alt" )
							.empty()
							.buttonMarkup({
								shadow: false,
								corners: false,
								theme: itemTheme,
								icon: false,
								iconpos: false
							})
							.find( ".ui-btn-inner" )
								.append(
									$( "<span />" ).buttonMarkup({
										shadow: true,
										corners: true,
										theme: splittheme,
										iconpos: "notext",
										icon: listspliticon || last.jqmData( "icon" ) || o.splitIcon
									})
								);
					}
				} else if ( item.jqmData( "role" ) === "list-divider" ) {

					itemClass += " ui-li-divider ui-btn ui-bar-" + dividertheme;
					item.attr( "role", "heading" );

					//reset counter when a divider heading is encountered
					if ( counter ) {
						counter = 1;
					}

				} else {
					itemClass += " ui-li-static ui-body-" + itemTheme;
				}
			}

			if ( counter && itemClass.indexOf( "ui-li-divider" ) < 0 ) {
				countParent = item.is( ".ui-li-static:first" ) ? item : item.find( ".ui-link-inherit" );

				countParent.addClass( "ui-li-jsnumbering" )
					.prepend( "<span class='ui-li-dec'>" + (counter++) + ". </span>" );
			}

			item.add( item.children( ".ui-btn-inner" ) ).addClass( itemClass );

			self._itemApply( $list, item );
		}

		this._refreshCorners( create );
	},

	//create a string for ID/subpage url creation
	_idStringEscape: function( str ) {
		return str.replace(/[^a-zA-Z0-9]/g, '-');
	},

	_createSubPages: function() {
		var parentList = this.element,
			parentPage = parentList.closest( ".ui-page" ),
			parentUrl = parentPage.jqmData( "url" ),
			parentId = parentUrl || parentPage[ 0 ][ $.expando ],
			parentListId = parentList.attr( "id" ),
			o = this.options,
			dns = "data-" + $.mobile.ns,
			self = this,
			persistentFooterID = parentPage.find( ":jqmData(role='footer')" ).jqmData( "id" ),
			hasSubPages;

		if ( typeof listCountPerPage[ parentId ] === "undefined" ) {
			listCountPerPage[ parentId ] = -1;
		}

		parentListId = parentListId || ++listCountPerPage[ parentId ];

		$( parentList.find( "li>ul, li>ol" ).toArray().reverse() ).each(function( i ) {
			var self = this,
				list = $( this ),
				listId = list.attr( "id" ) || parentListId + "-" + i,
				parent = list.parent(),
				nodeEls = $( list.prevAll().toArray().reverse() ),
				nodeEls = nodeEls.length ? nodeEls : $( "<span>" + $.trim(parent.contents()[ 0 ].nodeValue) + "</span>" ),
				title = nodeEls.first().getEncodedText(),//url limits to first 30 chars of text
				id = ( parentUrl || "" ) + "&" + $.mobile.subPageUrlKey + "=" + listId,
				theme = list.jqmData( "theme" ) || o.theme,
				countTheme = list.jqmData( "counttheme" ) || parentList.jqmData( "counttheme" ) || o.countTheme,
				newPage, anchor;

			//define hasSubPages for use in later removal
			hasSubPages = true;

			newPage = list.detach()
						.wrap( "<div " + dns + "role='page' " +	dns + "url='" + id + "' " + dns + "theme='" + theme + "' " + dns + "count-theme='" + countTheme + "'><div " + dns + "role='content'></div></div>" )
						.parent()
							.before( "<div " + dns + "role='header' " + dns + "theme='" + o.headerTheme + "'><div class='ui-title'>" + title + "</div></div>" )
							.after( persistentFooterID ? $( "<div " + dns + "role='footer' " + dns + "id='"+ persistentFooterID +"'>") : "" )
							.parent()
								.appendTo( $.mobile.pageContainer );

			newPage.page();

			anchor = parent.find('a:first');

			if ( !anchor.length ) {
				anchor = $( "<a/>" ).html( nodeEls || title ).prependTo( parent.empty() );
			}

			anchor.attr( "href", "#" + id );

		}).virtuallistview();

		// on pagehide, remove any nested pages along with the parent page, as long as they aren't active
		// and aren't embedded
		if( hasSubPages &&
			parentPage.is( ":jqmData(external-page='true')" ) &&
			parentPage.data("page").options.domCache === false ) {

			var newRemove = function( e, ui ){
				var nextPage = ui.nextPage, npURL;

				if( ui.nextPage ){
					npURL = nextPage.jqmData( "url" );
					if( npURL.indexOf( parentUrl + "&" + $.mobile.subPageUrlKey ) !== 0 ){
						self.childPages().remove();
						parentPage.remove();
					}
				}
			};

			// unbind the original page remove and replace with our specialized version
			parentPage
				.unbind( "pagehide.remove" )
				.bind( "pagehide.remove", newRemove);
		}
	},

	// TODO sort out a better way to track sub pages of the virtuallistview this is brittle
	childPages: function(){
		var parentUrl = this.parentPage.jqmData( "url" );

		return $( ":jqmData(url^='"+  parentUrl + "&" + $.mobile.subPageUrlKey +"')");
	}
});

//auto self-init widgets
//Virtual list is made on pageshow.
$( document ).bind( "pagecreate create", function( e ){
	$( $.mobile.virtuallistview.prototype.options.initSelector, e.target ).virtuallistview();
});


/*$(document).bind( "pageshow", function (e) {
	// auto self-init widgets
	$($.mobile.virtuallistview.prototype.options.initSelector, e.target)
    	.not(":jqmData(role='none'), :jqmData(role='nojs')")
    	.virtuallistview();
});
*/
})( jQuery );