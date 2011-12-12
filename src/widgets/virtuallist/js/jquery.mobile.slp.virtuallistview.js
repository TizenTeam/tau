/*
	Copyright (c) 2011 Samsung Electronics Co., Ltd All Rights Reserved

	Licensed under the Apache License, Version 2.0 (the "License");
	you may not use this file except in compliance with the License.
	You may obtain a copy of the License at

	http://www.apache.org/licenses/LICENSE-2.0

	Unless required by applicable law or agreed to in writing, software
	distributed under the License is distributed on an "AS IS" BASIS,
	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	See the License for the specific language governing permissions and
	limitations under the License.
*/

(function( $, undefined ) {

//Keeps track of the number of lists per page UID
//This allows support for multiple nested list in the same page
//https://github.com/jquery/jquery-mobile/issues/1617
var listCountPerPage = {};

/* Code for Virtual List Demo */
var	INIT_LIST_NUM = 100;
var	PAGE_BUF = (INIT_LIST_NUM/2);
var	TOTAL_ITEMS = 0;
var LINE_H = 0;
var TITLE_H = 0;	
var CONTAINER_W = 0;

/* ENUM */
var	NO_SCROLL = 0;	
var	SCROLL_DOWN = 1;
var	SCROLL_UP = -1;

var i =0;
var direction = NO_SCROLL;
var first_index = 0;				//first id of <li> element.
var last_index = INIT_LIST_NUM -1;	//last id of <li> element.

var num_top_items = 0;				//By scroll move, number of hidden elements.

$.widget( "mobile.virtuallistview", $.mobile.widget, {
	options: {
		theme: "s",
		countTheme: "c",
		headerTheme: "b",
		dividerTheme: "b",
		splitIcon: "arrow-r",
		splitTheme: "b",
		inset: false,
		id:	"",			/* Virtual list UL elemet's ID */
		childSelector: " li",	/* To support swipe list */
		dbtable: "",
		template : "",
		dbkey: false,			/* Data's unique Key */
		scrollview: false,
		initSelector: ":jqmData(role='virtuallistview')"
	},

	_stylerMouseUp: function()
	{
		$(this).addClass("ui-btn-up-s");
		$(this).removeClass("ui-btn-down-s");
	},

	_stylerMouseDown: function()
	{
		$(this).addClass("ui-btn-down-s");
		$(this).removeClass("ui-btn-up-s");
	},
	
	_stylerMouseOver: function()
	{
		$(this).toggleClass("ui-btn-hover-s");		
	},
	
	_stylerMouseOut: function()
	{
		$(this).toggleClass("ui-btn-hover-s");
	},

	_pushData: function ( template, data ) {
		var o = this.options;
		
		var dataTable = data;
		
		var myTemplate = $("#" + template);
		
		var lastIndex = (INIT_LIST_NUM > data.length ? data.length : INIT_LIST_NUM); 
		
		for (i = 0; i < lastIndex; i++) 
		{
			var htmlData = myTemplate.tmpl( dataTable[i]);
			$(o.id).append($(htmlData).attr( 'id', 'li_'+i ));
		}
		
		/* After push data, re-style virtuallist widget */
		$(o.id).trigger( "create" );
	}, 

	_reposition: function(event){
		var o;
		
		if (event.data) {
			o = event.data;
		}
		else {
			o = event;
		}
		
		var t = this;
		
		TITLE_H = $(o.id + o.childSelector + ':first').position().top;
		LINE_H = $(o.id + o.childSelector + ':first').outerHeight();
		
		CONTAINER_W = $(o.id).innerWidth();
		
		var padding = parseInt($(o.id + o.childSelector).css("padding-left")) + parseInt($(o.id + o.childSelector).css("padding-right"));
		
		/* Add style */
		$(o.id + ">" + o.childSelector).addClass("position_absolute").addClass("ui-btn-up-s")
											.bind("mouseup", t._stylerMouseUp)
											.bind("mousedown", t._stylerMouseDown)		
											.bind("mouseover", t._stylerMouseOver)
											.bind("mouseout", t._stylerMouseOut);

		$(o.id + ">" + o.childSelector).each(function(index){
			$(this).css("top", TITLE_H + LINE_H*index + 'px')
			.css("width", CONTAINER_W - padding);
		});

		/* Set Max List Height */
		$(o.id).height(TOTAL_ITEMS * LINE_H);
	},
	
	_resize: function(event)
	{
		var o;
		
		if (event.data) {
			o = event.data;
		}
		else {
			o = event;
		}
		
		var t = this;		
		
		CONTAINER_W = $(o.id).innerWidth();
		
		var padding = parseInt($(o.id + o.childSelector).css("padding-left")) + parseInt($(o.id + o.childSelector).css("padding-right"));
		
		$(o.id + o.childSelector).each(function(index){
			$(this).css("width", CONTAINER_W - padding);
		});
	},
	
	_scrollmove: function(event){
		var velocity = 0;
		var o = event.data;
		var dataList = window[o.dbtable];
		
		/* Text & image src replace function */
		var _replace= function(oldItem, newItem, key)
		{
			$(oldItem).find(".ui-li-text-main",".ui-li-text-sub","ui-btn-text").each(function(index)
			{
				var oldObj = $(this);
				var newText = $(newItem).find(".ui-li-text-main",".ui-li-text-sub","ui-btn-text").eq(index).text();
				
	            $(oldObj).contents().filter(function(){ return(this.nodeType == 3);}).get(0).data = newText;
			});
			
			$(oldItem).find("img").each(function(imgIndex)
			{
				var oldObj = $(this);

				var newImg = $(newItem).find("img").eq(imgIndex).attr("src");
				
				$(oldObj).attr("src", newImg);
			});
			
			if (key)
			{
				$(oldItem).data(key, $(newItem).data(key));
			}
	    };
		
		//Move older item to bottom
		var _moveTopBottom= function(v_firstIndex, v_lastIndex, num, key)
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
					/* Make New <LI> element from template. */
					var myTemplate = $("#" + o.template);
					var htmlData = myTemplate.tmpl(dataList[v_lastIndex + i]);
					
					/* Copy all data to current item. */
					_replace(cur_item, htmlData, key);
					
					/* Set New Position */
					(cur_item).css('top', TITLE_H + LINE_H*(v_lastIndex + 1 + i)).attr( 'id', 'li_' +(v_lastIndex + 1+ i));
				}
				else
					break;
			}
		};

		// Move older item to bottom
		var _moveBottomTop= function(v_firstIndex, v_lastIndex, num, key)
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
				
					/* Make New <LI> element from template. */
					var myTemplate = $("#" + o.template);
					var htmlData = myTemplate.tmpl(dataList[v_firstIndex-1-i]);
					
					/* Copy all data to current item. */
					_replace(cur_item, htmlData, key);

					/* Set New Position */
					$(cur_item).css('top', TITLE_H + LINE_H*(v_firstIndex-1-i)).attr( 'id', 'li_' +(v_firstIndex-1-i));
				}
				else
					break;
			}
		};
		
		/* Matrix to Array function written by Blender@stackoverflow. nnikishi@emich.edu*/
		var matrixToArray = function(matrix) {
		    var contents = matrix.substr(7);
		    contents = contents.substr(0, contents.length - 1);

		    return contents.split(', ');
		};		
		
		// Get scroll direction and velocity
		/* with Scroll view */
		if (o.scrollview)
		{
			var $el = $(o.id).parentsUntil(".ui-page").find(".ui-scrollview-view");
			var transformValue = matrixToArray($el.css("-webkit-transform"));
			
			var curWindowTop = Math.abs(transformValue[5]);	/* Y vector */
		}
    	else
    	{
    		var curWindowTop = $(window).scrollTop() - LINE_H;
    	}
		
		var cur_num_top_itmes = $(o.id + o.childSelector).filter(function(){return (parseInt($(this).css("top")) < curWindowTop);}).size(); 
		
		if (num_top_items < cur_num_top_itmes)
		{
			direction = SCROLL_DOWN;
			velocity = cur_num_top_itmes - num_top_items;
			num_top_items = cur_num_top_itmes;
		}
		else if (num_top_items > cur_num_top_itmes)
		{
			direction = SCROLL_UP;
			velocity = num_top_items - cur_num_top_itmes;
			num_top_items = cur_num_top_itmes;
		}

		// Move items
		if(direction == SCROLL_DOWN)
		{
			if (cur_num_top_itmes > PAGE_BUF)
			{
				if (last_index + velocity > TOTAL_ITEMS)
				{
					velocity = TOTAL_ITEMS - last_index -1;
				}
				
				/* Prevent scroll touch event while DOM access */
				$(document).bind("touchstart", function(event) {
					  event.preventDefault();
				});				
				
				_moveTopBottom(first_index, last_index, velocity, o.dbkey);
				first_index += velocity;
				last_index += velocity;
				num_top_items -= velocity;
				
				/* Unset prevent touch event */
				$(document).unbind("touchstart");
			}
		}
		else if(direction == SCROLL_UP)
		{
			if (cur_num_top_itmes <= PAGE_BUF)
			{
				if (first_index < velocity)
				{
					velocity = first_index;
				}

				/* Prevent scroll touch event while DOM access */
				$(document).bind("touchstart", function(event) {
					  event.preventDefault();
				});		
				
				_moveBottomTop(first_index, last_index, velocity, o.dbkey);
				first_index -= velocity;
				last_index -= velocity;
				num_top_items += velocity;
				
				/* Unset prevent touch event */
				$(document).unbind("touchstart");				
			}
			
			if (first_index < PAGE_BUF)
			{
				num_top_items = first_index;
			}
		}
	},
	
	recreate: function(newArray){
		var t = this;
		var o = this.options;
		
		$(o.id).empty();
		
		TOTAL_ITEMS = newArray.length;
		direction = NO_SCROLL;
		first_index = 0;
		last_index = INIT_LIST_NUM -1;		
		
		t._pushData((o.template), newArray);
		
		if (o.childSelector == " ul")
		{
			$(o.id + " ul").swipelist();	
		}
		
		$(o.id).virtuallistview();
		
		t._reposition(o);
		
		t.refresh( true );
	},

	_initList: function(){
		var t = this;
		var o = this.options;
		
		/* After AJAX loading success */
		o.dbtable = t.element.data("dbtable");
		
		TOTAL_ITEMS = $(window[o.dbtable]).size();
		
        /* Make Gen list by template */
    	t._pushData((o.template), window[o.dbtable]);
    	
    	$(o.id).parentsUntil(".ui-page").parent().one("pageshow", o, t._reposition);

    	/* Scrollview */
    	if (o.scrollview) {
    		$(o.id).parentsUntil(".ui-page").parent().bind("vmouseup", t.options, t._scrollmove);
    		$(o.id).parentsUntil(".ui-page").parent().bind("touchend", t.options, t._scrollmove);
    	}
    	else {
    		$(document).bind('scrollstop', t.options, t._scrollmove);
    	}
	    
	    $(window).resize(o, t._resize);

	    if (o.childSelector == " ul")
		{
			$(o.id + " ul").swipelist();
		}
	    
		t.refresh( true );
	},
	
	create: function()
	{
		var o = this.options;
		/* external API for AJAX callback */
		this._create("create");
		
		this._reposition(o);
	},
	
	_create: function(event) {
		var t = this;
		var o = this.options; 
		
		// create listview markup
		t.element.addClass(function( i, orig ) {
			return orig + " ui-listview ui-virtual-list-container" + ( t.options.inset ? " ui-listview-inset ui-corner-all ui-shadow " : "" );
		});

        var $el = this.element,
        shortcutsContainer = $('<div class="ui-virtuallist"/>'),
        shortcutsList = $('<ul></ul>'),
        dividers = $el.find(':jqmData(role="virtuallistview")'),
        lastListItem = null,
        shortcutscroll = this;
		
        o.id = "#" + $el.attr("id");
        
	    $(o.id).bind("pagehide", function(e){
			$(o.id).empty();
		});
	    
	    /* Scroll view */
	    ($(".ui-scrollview-clip").size()>0)?o.scrollview=true:o.scrollview=false;

	    /* After DB Load complete, Init Vritual list */
	    if ($(o.id).hasClass("vlLoadSuccess"))
	    {
	    	$(o.id).empty();	    	
	    	
		    if ($el.data("template"))
			{
				o.template = $el.data("template");
				
		        /* to support swipe list, <li> or <ul> can be main node of virtual list. */
				if ($el.data("swipelist") == true)
				{
					o.childSelector = " ul";
				}
				else
				{
					o.shildSelector = " li";
				}
			}
			
			/* Set data's unique key */
			if ($el.data("dbkey"))
			{
				o.datakey = $el.data("dbkey");
			}

			t._initList();
	    }
	},
	
	destroy : function(){
		var o = this.options;
		
		$(document).unbind("scrollstop");
		
		if (o.scrollview) {
			$(o.id).parentsUntil(".ui-page").parent().unbind("vmouseup");
    		$(o.id).parentsUntil(".ui-page").parent().unbind("touchend");
		}
		$(window).unbind("resize");

		/* Unset prevent touch event */
		/*$(document).unbind("touchstart");*/
		
		$(o.id).empty();
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
$( document ).bind( "pagecreate create", function( e ){
	$( $.mobile.virtuallistview.prototype.options.initSelector, e.target ).virtuallistview();
});

})( jQuery );
