/*
 *	Author: Wongi Lee <wongi11.lee@samsung.com>
*/

/**
 * Extendable List Widget for unlimited data.
 * To support more then 1,000 items, special list widget developed. 
 * Fast initialize and append some element into the DOM tree repeatedly.
 * DB connection and works like DB cursor.     
 * 
 * HTML Attributes:
 *
 *		data-role:	extendablelist
 *		data-template : jQuery.template ID that populate into extendable list. A button : a <DIV> element with "data-role : button" should be included on data-template. 
 *		data-dbtable : DB Table name. It used as window[DB NAME]. Loaded data should be converted as window object.
 *		data-extenditems : Number of elements to extend at once. 
 *		
 *		ID : <UL> element that has "data-role=extendablelist" must have ID attribute.
 *		Class : <UL> element that has "data-role=extendablelist" should have "vlLoadSuccess" class to guaranty DB loading is completed.
 *		tmp_load_more : Template ID for "load more" message and button. 
 *
 *
 * APIs:
 *
 *		create ( void )
 *			: API to call _create method. API for AJAX or DB loading callback.
 *
 *		recreate ( Array )
 *			: Update extendable list with new data array. For example, update with search result. 
 *
 * Examples:
 * 
 * 		<script id="tmp-3-1-1" type="text/x-jquery-tmpl">
 *			<li class="ui-li-3-1-1"><span class="ui-li-text-main">${NAME}</span></li>
 *		</script>
 * 
 *		<script id="tmp_load_more" type="text/x-jquery-tmpl"> 
 * 			<li class="ui-li-3-1-1" style="text-align:center; margin:0 auto">
 * 				<div data-role="button">Load ${NUM_MORE_ITEMS} more items</div>
 * 			</li>
 * 		</script>
 * 	
 * 		<ul id = "extendable_list_main" data-role="extendablelist" data-extenditems="50" data-template="tmp-3-1-1" data-dbtable="JSON_DATA">
 * 		</ul>
 * 
 */


(function( $, undefined ) {

//Keeps track of the number of lists per page UID
//This allows support for multiple nested list in the same page
//https://github.com/jquery/jquery-mobile/issues/1617
var listCountPerPage = {};

var	TOTAL_ITEMS = 0;

var i =0;
var last_index = 0;

$.widget( "tizen.extendablelist", $.mobile.widget, {
	options: {
		theme: "s",
		countTheme: "c",
		headerTheme: "b",
		dividerTheme: "b",
		splitIcon: "arrow-r",
		splitTheme: "b",
		inset: false,
		id:	"",						/* Extendable list UL elemet's ID */
		extenditems: 50,			/* Number of append items */ 
		childSelector: " li",		/* To support swipe list */
		dbtable: "",
		template : "",				/* Template for each list item */
		loadmore : "tmp_load_more",	/* Template for "Load more" message */
		scrollview: false,
		initSelector: ":jqmData(role='extendablelist')"
	},

	_stylerMouseUp: function() {
		$( this ).addClass( "ui-btn-up-s" );
		$( this ).removeClass( "ui-btn-down-s" );
	},

	_stylerMouseDown: function() {
		$( this ).addClass( "ui-btn-down-s" );
		$( this ).removeClass( "ui-btn-up-s" );
	},

	_stylerMouseOver: function() {
		$( this ).toggleClass( "ui-btn-hover-s" );
	},

	_stylerMouseOut: function() {
		$( this ).toggleClass( "ui-btn-hover-s" );
	},

	_pushData: function ( template, data ) {
		var o = this.options;

		var dataTable = data;

		var myTemplate = $( "#" + template );

		var loadMoreItems = ( o.extenditems > data.length - last_index ? data.length - last_index : o.extenditems); 

		for (i = 0; i < loadMoreItems; i++ ) 
		{
			var htmlData = myTemplate.tmpl( dataTable[ i ]);
			$( o.id ).append( $( htmlData ).attr( 'id', 'li_'+i ) );
			last_index++;
		}

		/* After push data, re-style extendable list widget */
		$( o.id ).trigger( "create" );
	},

	_loadmore: function( event ){
		var t = this;
		var o = event.data;

		/* Remove load more message */
		$( "#load_more_message" ).remove();

		/* Append items */
		var dataTable = window[ o.dbtable ];
		var myTemplate = $( "#" + o.template );

		var loadMoreItems = ( o.extenditems > dataTable.length - last_index ? dataTable.length - last_index : o.extenditems );

		for ( i = 0; i < loadMoreItems; i++ ) 
		{
			last_index++;
			var htmlData = myTemplate.tmpl( dataTable[ last_index ] );
			$( o.id ).append( $( htmlData ).attr( 'id', 'li_' + last_index ) );
		}

		/* Append "Load more" message on the last of list */
		if ( TOTAL_ITEMS > last_index ) {
			var myTemplate = $( "#" + o.loadmore );
			var more_items_to_load = TOTAL_ITEMS - last_index;
			var num_next_load_items = ( o.extenditems <= more_items_to_load ) ? o.extenditems : more_items_to_load;
			var htmlData = myTemplate.tmpl( { NUM_MORE_ITEMS : num_next_load_items } );

			$( o.id ).append( $( htmlData ).attr( 'id', "load_more_message" ) );
		}

		$( o.id ).trigger( "create" );
		$( o.id ).extendablelist( "refresh" );
	},

	recreate: function( newArray ) {
		var t = this;
		var o = this.options;

		$( o.id ).empty();

		TOTAL_ITEMS = newArray.length;

		t._pushData( ( o.template), newArray );

		if ( o.childSelector == " ul" ) {
			$( o.id + " ul" ).swipelist();	
		}

		$( o.id ).extendablelist();

		t.refresh( true );
	},

	_initList: function(){
		var t = this;
		var o = this.options;

		/* After AJAX loading success */
		o.dbtable = t.element.data( "dbtable" );

		TOTAL_ITEMS = $( window[ o.dbtable ] ).size();

		/* Make Gen list by template */
		if ( last_index <= 0 ) {
			t._pushData( ( o.template ), window[ o.dbtable ] );

			/* Append "Load more" message on the last of list */
			if ( TOTAL_ITEMS > last_index ) {
				var myTemplate = $( "#" + o.loadmore );
				var more_items_to_load = TOTAL_ITEMS - last_index;
				var num_next_load_items = ( o.extenditems <= more_items_to_load) ? o.extenditems : more_items_to_load;
				var htmlData = myTemplate.tmpl( { NUM_MORE_ITEMS : num_next_load_items } );

				$( o.id ).append( $( htmlData ).attr( 'id', "load_more_message" ) );

				$( "#load_more_message" ).live( "click", t.options, t._loadmore );
			}
			else {
				/* No more items to load */
				$( "#load_more_message" ).die();
				$( "#load_more_message" ).remove();
			}
		}

		if ( o.childSelector == " ul" ) {
			$( o.id + " ul" ).swipelist();
		}

		$( o.id ).trigger( "create" );

		t.refresh( true );
	},

	create: function() {
		var o = this.options;

		/* external API for AJAX callback */
		this._create( "create" );
	},

	_create: function( event ) {
		var t = this;
		var o = this.options; 

		// create listview markup
		t.element.addClass( function( i, orig ) {
			return orig + " ui-listview ui-extendable-list-container" + ( t.options.inset ? " ui-listview-inset ui-corner-all ui-shadow " : "" );
		});

		var $el = this.element;

		o.id = "#" + $el.attr( "id" );

		if ( $el.data( "extenditems" ) ) {
			o.extenditems = parseInt( $el.data( "extenditems" ) );
		}

		$( o.id ).bind( "pagehide", function(e){
			$( o.id ).empty();
		});

		/* Scroll view */
		( $( ".ui-scrollview-clip" ).size() > 0) ? o.scrollview = true : o.scrollview = false;

		/* After DB Load complete, Init Extendable list */
		if ( $( o.id ).hasClass( "elLoadSuccess" ) ) {
			if( $( o.id ).hasClass( "elInitComplete" ) ){
				return;
			}
			else {
				if ( $el.data( "template" ) ) {
					o.template = $el.data( "template" );

					/* to support swipe list, <li> or <ul> can be main node of extendable list. */
					if ( $el.data( "swipelist" ) == true ) {
						o.childSelector = " ul";
					}
					else {
						o.shildSelector = " li";
					}
				}
				
				$( o.id ).addClass( "elInitComplete" );
			}
			t._initList();
		}
	},

	destroy : function(){
		var o = this.options;

		$( o.id ).empty();

		TOTAL_ITEMS = 0;
		i =0;
		last_index = 0;

		$( "#load_more_message" ).die();
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
				item.addClass( $( this ).is( ".ui-li-icon" ) ? "ui-li-has-icon" : "ui-li-has-thumb" );
			}).end()
			.find( ".ui-li-aside" ).each(function() {
				var $this = $( this );
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
					.not( ".ui-li-icon" )
					.addClass( "ui-corner-tl" );

			// Select the last visible li element
			$bottomli = $visibleli.last()
				.addClass( "ui-corner-bottom" );

			$bottomli.add( $bottomli.find( ".ui-btn-inner" ) )
				.find( ".ui-li-link-alt" )
					.addClass( "ui-corner-br" )
				.end()
				.find( ".ui-li-thumb" )
					.not( ".ui-li-icon" )
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
				itemTheme = item.jqmData( "theme" ) || o.theme;
				a = item.children( "a" );

				if ( a.length ) {
					icon = item.jqmData( "icon" );

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
							.after( persistentFooterID ? $( "<div " + dns + "role='footer' " + dns + "id='"+ persistentFooterID +"'>" ) : "" )
							.parent()
								.appendTo( $.mobile.pageContainer );

			newPage.page();

			anchor = parent.find('a:first');

			if ( !anchor.length ) {
				anchor = $( "<a/>" ).html( nodeEls || title ).prependTo( parent.empty() );
			}

			anchor.attr( "href", "#" + id );

		}).extendablelist();

		// on pagehide, remove any nested pages along with the parent page, as long as they aren't active
		// and aren't embedded
		if( hasSubPages &&
			parentPage.is( ":jqmData(external-page='true')" ) &&
			parentPage.data( "page" ).options.domCache === false ) {

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

	// TODO sort out a better way to track sub pages of the extendable listview this is brittle
	childPages: function(){
		var parentUrl = this.parentPage.jqmData( "url" );

		return $( ":jqmData(url^='"+  parentUrl + "&" + $.mobile.subPageUrlKey +"')" );
	}
});

//auto self-init widgets
$( document ).bind( "pagecreate create", function( e ){
	$( $.tizen.extendablelist.prototype.options.initSelector, e.target ).extendablelist();
});

})( jQuery );
