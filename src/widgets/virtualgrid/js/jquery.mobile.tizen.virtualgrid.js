/*
*	Author: Kangsik Kim <kangsik81.kim@samsung.com>
*/

/**
 * Virtual Grid Widget for unlimited data.
 * To support more then 1,000 items, special grid widget developed.
 * Fast initialize and light DOM tree.
 *
 * HTML Attributes:
 *
 *		data-role:  virtualgridview
 *		data-template : jQuery.template ID that populate into virtual list
 *		data-dbtable : DB Table name. It used as window[DB NAME]. Loaded data should be converted as window object.
 *		data-dbkey : Unique key of DB Table. To sync each element on virtual list with DB table.
 *
 *		ID : <UL> element that has "data-role=virtuallist" must have ID attribute.
 *		Class : <UL> element that has "data-role=virtuallist" should have "vlLoadSuccess" class to guaranty DB loading is completed.
 *
 * APIs:
 *
 *		create ( void )
 *			: API to call _create method. API for AJAX or DB loading callback.
 *
 * Events:
 *
 *
 * Examples:
 *
 *			<script id="tizen-demo-namecard" type="text/x-jquery-tmpl">
 *				<div class="ui-demo-namecard">
 *					<div class="ui-demo-namecard-pic">
 *						<img class="ui-demo-namecard-pic-img" src="${TEAM_LOGO}"  />
 *					</div>
 *					<div class="ui-demo-namecard-contents">
 *						<span class="name ui-li-text-main">${NAME}</span>
 *						<span class="active ui-li-text-sub">${ACTIVE}</span>
 *						<span class="from ui-li-text-sub">${FROM}</span>
 *					</div>
 *				</div>
 *			</script>
 *			<div id="virtualgrid-demo" data-role="virtualgrid" data-column="3" data-row="60" data-template="tizen-demo-namecard" data-dbtable="JSON_DATA" data-scroll="y">
 *			</div>
 *
 */


( function ( $, window, undefined ) {
	$.widget( "tizen.virtualgrid", $.mobile.widget, {
		options : {
			id : "",
			column : 3,
			dbtable : "",
			template : "",
			row : 10,
			dbkey : false
		},
		create : function () {
			this._create();
		},
		_create : function () {
			$.extend( this, {
				NO_SCROLL : 0,
				SCROLL_DOWN : 1,
				SCROLL_UP : -1,
				_titleHeight : 0,
				_blockHeight : 0,
				_bufferSize : 0,
				_columnWidth : 0,
				_totalItemCnt : 0,
				_totalRowCnt : 0,
				_currentIndex : 0,
				_remainCount : 0,
				_viewHeight : 0,
				_direction : 0,
				_firstIndex : 0,
				_lastIndex : 0,
				_prevPos : 0,
				_numTopItems : 0
			});

			var opts = this.options, widget = this;
			opts.id = "#" + this.element.attr( 'id' );

			if ( $( opts.id ).hasClass( "vlLoadSuccess" ) ) {
				$( opts.id ).empty();
				// validation row, column count
				// initialize global value.
				widget._lastIndex = opts.row;
				widget._bufferSize = ( parseInt( ( opts.row / 4 ), 10 ) );
				widget._totalItemCnt = $( window[opts.dbtable] ).size();
				widget._pushData( ( opts.template ), window[opts.dbtable] );
				widget._reposition();
				widget._addEvents();
			}
		},
		_pushData : function ( template, data ) {
			var widget = this,
				opts = this.options,
				dataTable = data,
				myTemplate = $( "#" + template ),
				viewcount = opts.row * opts.column,
				lastIndex = viewcount,
				index = 0,
				rowIndex = 0,
				colIndex = 0,
				wrapBlock = null;

			for ( rowIndex = 0; rowIndex < opts.row; rowIndex += 1 ) {
				wrapBlock = widget._makeWrapBlock( myTemplate, dataTable );
				$( wrapBlock ).attr( "id", "block_" + rowIndex );
				$( opts.id ).append( wrapBlock );
			}
			widget._blockHeight = $( wrapBlock ).outerHeight();
		},
		// make a single row block
		_makeWrapBlock : function ( myTemplate, dataTable ) {
			var widget = this,
				opts = widget.options,
				index = widget._currentIndex,
				htmlData = null,
				colIndex = 0,
				wrapBlock = document.createElement( "div" );

			$( wrapBlock ).addClass( "ui-virtualgrid-wrapblock" );
			for ( colIndex = 0; colIndex < opts.column; colIndex++ ) {
				htmlData = myTemplate.tmpl( dataTable[index] );
				$( wrapBlock ).append( htmlData );
				index = index <= widget._totalItemCnt ? index + 1 : 0;
			}
			widget._currentIndex = index;
			return wrapBlock;
		},
		_reposition : function () {
			var widget = this,
				$view = widget.element,
				opts = this.options,
				wrapsBlocks = null,
				childBlocks = null,
				blockCount = 0,
				index = 0,
				subIndex = 0,
				firstBlock = $( ".ui-virtualgrid-wrapblock:first" ),
				subBlocks = firstBlock.children();

			widget._blockHeight = firstBlock.outerHeight();
			widget._titleHeight = firstBlock.position().top;

			if ( subBlocks[0] ) {
				widget._columnWidth = $( subBlocks[0] ).outerWidth();
			}

			wrapsBlocks = $( ".ui-virtualgrid-wrapblock" );
			blockCount = wrapsBlocks.length;
			for ( index = 0; index < blockCount; index += 1 ) {
				$( wrapsBlocks[index] ).css( "top", widget._titleHeight + ( index * widget._blockHeight  ) );
				childBlocks = $( wrapsBlocks[index] ).children();
				for ( subIndex = 0; subIndex < childBlocks.length; subIndex += 1 ) {
					$( childBlocks[subIndex] ).css( "left", ( subIndex * widget._columnWidth ) + 'px' );
				}
			}
			// check total row count and setup total height
			widget._totalRowCnt = ( widget._totalItemCnt % opts.column ) === 0 ? ( widget._totalItemCnt / opts.column ) : ( parseInt( ( widget._totalItemCnt / opts.column ), 10 ) + 1 );
			$( opts.id ).height( widget._totalRowCnt * widget._blockHeight );
		},

		_addEvents : function () {
			var widget = this,
				$view = this.element;
			$( document ).bind( "scrollstop.virtualgrid", function ( event ) {
				var opts = widget.options,
					dataList = window[opts.dbtable],
					filterCondition = 0,
					replaceRowCnt = 0,
					replacedCount = 0,
					$scrollview = $view.closest( ".ui-scrollview-view" ),
					transformValue = null,
					curWindowTop = 0;

				/* with Scroll view */
				if ( widget._viewHeight === 0 ) {
					widget._viewHeight = $scrollview.parent().height();
				}

				transformValue = widget._matrixToArray( $scrollview.css( "-webkit-transform" ) );
				curWindowTop = Math.abs( transformValue[5] );
				if ( widget._prevPos > curWindowTop ) {
					widget._direction = widget.SCROLL_UP;
				} else if ( widget._prevPos < curWindowTop ) {
					widget._direction = widget.SCROLL_DOWN;
				}

				if ( widget._direction == widget.SCROLL_DOWN ) {
					filterCondition = ( curWindowTop - widget._blockHeight );
					replaceRowCnt = $( ".ui-virtualgrid-wrapblock" ).filter( function () {
						return ( parseInt( ( $( this ).position().top ), 10 ) < filterCondition );
					}).size();
					if ( replaceRowCnt > widget._bufferSize ) {
						$( document ).bind( "touchstart.virtualgrid", function ( event ) {
							event.preventDefault();
						});
						replaceRowCnt = replaceRowCnt - widget._bufferSize;
						replacedCount = widget._moveTopBottom( widget._firstIndex, widget._lastIndex, replaceRowCnt, opts.dbkey );
						widget._firstIndex += replacedCount;
						widget._lastIndex += replacedCount;
						widget._numTopItems -= replacedCount;
						$( document ).unbind( "touchstart.virtualgrid" );
					}
				} else if ( widget._direction == widget.SCROLL_UP ) {
					filterCondition = ( curWindowTop + widget._viewHeight + widget._blockHeight );
					replaceRowCnt = $( ".ui-virtualgrid-wrapblock" ).filter( function () {
						return ( parseInt( ( $( this ).position().top ), 10 ) > filterCondition );
					}).size();
					if ( replaceRowCnt > widget._bufferSize ) {
						$( document ).bind( "touchstart.virtualgrid", function ( event ) {
							event.preventDefault();
						});
						replaceRowCnt = replaceRowCnt - widget._bufferSize;
						replacedCount = widget._moveBottomTop( widget._firstIndex, widget._lastIndex, replaceRowCnt, opts.dbkey );
						widget._firstIndex -= replacedCount;
						widget._lastIndex -= replacedCount;
						widget._numTopItems += replacedCount;
						$( document ).unbind( "touchstart.virtualgrid" );
					}
				}
				// save preve position information.
				widget._prevPos = curWindowTop;
			});
		},
		/* Matrix to Array function written by Blender@stackoverflow.nnikishi@emich.edu*/
		_matrixToArray : function ( matrix ) {
			var contents = matrix.substr( 7 );
			contents = contents.substr( 0, contents.length - 1 );
			return contents.split( ', ' );
		},
		//Move older item to bottom
		_moveTopBottom : function ( v_firstIndex, v_lastIndex, num, key ) {
			if ( v_firstIndex < 0 ) {
				return;
			}

			if ( num < 1 ) {
				return;
			}

			var widget = this,
				opts = widget.options,
				dataList = window[opts.dbtable],
				dataIndex = ( ( v_lastIndex ) * opts.column ),
				count = 0,
				curBlock = null,
				cur_item = null,
				myTemplate = null,
				htmlData = null,
				i = 0,
				j = 0,
				contentsBlocks = null;

			// wrap block count
			// print argument value
			for ( i = 0; i < num; i += 1 ) {
				if ( v_lastIndex > widget._totalRowCnt ) {
					break;
				}

				// select block
				curBlock = $( "#block_" + ( v_firstIndex + i ) );
				if ( curBlock ) {
					break;
				}

				contentsBlocks = curBlock.children();

				for ( j = 0; j < opts.column; j += 1 ) {
					cur_item = contentsBlocks[j];
					myTemplate = $( "#" + opts.template );
					htmlData = myTemplate.tmpl( dataList[dataIndex] );
					widget._replace( cur_item, htmlData, key );
					dataIndex += 1;
				}

				curBlock.css( "top", widget._titleHeight + widget._blockHeight * ( ( v_lastIndex ) ) ).css( "left", 0 );

				contentsBlocks.css( "top", widget._titleHeight + widget._blockHeight * ( ( v_lastIndex ) ) );
				curBlock.attr( "id", "block_" + ( v_lastIndex ) );

				v_lastIndex++;
				count++;
			}
			return count;
		},
		_moveBottomTop : function ( v_firstIndex, v_lastIndex, num, key ) {
			if ( v_firstIndex < 0 ) {
				return;
			}

			if ( num < 1 ) {
				return;
			}

			var widget = this,
				opts = widget.options,
				dataList = window[opts.dbtable],
				dataIndex = ( ( v_firstIndex - 1 ) * opts.column ),
				targetBlock = $( ".ui-virtualgrid-wrapblock:first" ),
				curBlock = null,
				contentsBlocks = null,
				cur_item = null,
				myTemplate = null,
				htmlData = null,
				i = 0,
				j = 0,
				count = 0;

			// print argument value
			for ( i = 0; i < num; i += 1 ) {
				if ( v_firstIndex - 1 < 0 ) {
					break;
				}

				// select block
				curBlock = $( "#block_" + ( ( v_lastIndex - 1 ) - i ) );
				if ( !curBlock ) {
					break;
				}

				dataIndex = ( ( v_firstIndex - 1 ) * opts.column );

				contentsBlocks = curBlock.children();
				for ( j = 0; j < opts.column; j += 1 ) {
					cur_item = contentsBlocks[j];
					myTemplate = $( "#" + opts.template );
					htmlData = myTemplate.tmpl( dataList[dataIndex] );
					widget._replace( cur_item, htmlData, key );
					dataIndex++;
				}
				curBlock.css( "top", widget._titleHeight + widget._blockHeight * ( ( v_firstIndex - 1 ) ) ).css( "left", 0 );
				curBlock.attr( "id", "block_" + ( v_firstIndex - 1 ) );
				contentsBlocks.css( "top", widget._titleHeight + widget._blockHeight * ( ( v_firstIndex - 1 ) ) );

				v_firstIndex -= 1;
				count++;
			}
			return count;
		},
		/* Text & image src replace function */
		// @param oldItem   : prev HtmlDivElement
		// @param newItem   : new HtmlDivElement for replace
		// @param key       :
		_replace : function ( oldItem, newItem, key ) {
			$( oldItem ).find( ".ui-li-text-main", ".ui-li-text-sub", "ui-btn-text" ).each( function ( index ) {
				var oldObj = $( this ),
					newText = $( newItem ).find( ".ui-li-text-main", ".ui-li-text-sub", "ui-btn-text" ).eq( index ).text();

				$( oldObj ).contents().filter( function () {
					return ( this.nodeType == 3 );
				}).get( 0 ).data = newText;
			});

			$( oldItem ).find( "img" ).each( function ( imgIndex ) {
				var oldObj = $( this ),
					newImg = $( newItem ).find( "img" ).eq( imgIndex ).attr( "src" );

				$( oldObj ).attr( "src", newImg );
			});
			if ( key ) {
				$( oldItem ).data( key, $( newItem ).data( key ) );
			}
		}
	});

	$( document ).bind( "pagecreate create", function () {
		$( ":jqmData(role='virtualgrid')" ).virtualgrid();
	});

} ( jQuery, window ) );
