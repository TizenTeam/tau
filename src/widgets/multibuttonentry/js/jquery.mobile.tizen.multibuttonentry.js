/*
 *	Author: Kangsik Kim <kangsik81.kim@samsung.com>
*/

/**
 * Multibuttonentry is a widget that create and handle with text block.
 *
 * HTML Attributes:
 *
 *		data-listUrl : Represent a link page 'id'.
 *		data-label:	To handle label text.( optional )
 *		data-descMessage : To handle message format. This message is displayed when 'focusout' state. ( optional )
 *
 * APIs:
 *
 *		inputtext ( void )
 *			: Get a string from inputbox.
 *		inputtext ( string )
 *			: Set a string to inputbox.
 *		select ( void )
 *			: Get a string that include selected block.
 *		select ( number )
 *			: Select a text block that is specific position.
 *		add ( string )
 *			: Insert a new textblock at last position.
 *		add ( string, number )
 *			: Insert a new textblock at position by index.
 *		remove ( void )
 *			: Remove all textblocks.
 *		remove ( number )
 *			: Remove a textblock that is pointed by index.
 *		length ( void )
 *			: Get a number of textblock.
 *		focusIn ( void )
 *			: This method change a status to 'focusin'. This status is able to handle a widget.
 *		focusOut ( void )
 *			: This method change a status to 'focusout'. this status is not able to handle a widget.
 *
 * Events:
 *
 *		select : This event is occurs when select a block.
 *		add : This event is occurs when insert new text block.
 *		remove : This event is occurs when remove a text block.
 *
 * Examples:
 *
 *		 <div data-role="multibuttonentry" data-label="To : " data-listUrl:"#addressbook" data-descMessage="{0} & {1} more...">
 *       </div>
 *
 */

( function ( $, window, document, undefined ) {
	$.widget( "tizen.multibuttonentry", $.mobile.widget, {
		_focusStatus : null,
		_items : null,
		_viewWidth : 0,
		_reservedWidth : 0,
		_currentWidth : 0,
		_fontSize : 0,
		options : {
			label : "To : ",
			listUrl : "#addressbook",
			descMessage : "{0} & {1} more..."
		},
		_create : function () {
			var self = this,
				$view = this.element,
				role = $view.jqmData( "role" ),
				option = this.options,
				inputbox = $( document.createElement( "input" ) ),
				labeltag = $( document.createElement( "label" ) ),
				moreBlock = $( document.createElement( "a" ) );

			$view.hide().empty().addClass( "ui-" + role );

			// create a label tag.
			$( labeltag ).text( this.options.label ).addClass( "ui-multibuttonentry-label" );
			$view.append( labeltag );

			// create a input tag
			$( inputbox ).text( option.label ).addClass( "ui-multibuttonentry-input" );
			$view.append( inputbox );

			// create a anchor tag.
			$( moreBlock ).text( "+" ).attr( "href", option.listUrl ).addClass( "ui-multibuttonentry-link" );

			// append default htmlelements to main widget.
			$view.append( moreBlock );

			// bind a event
			this._bindEvents();
			//
			self._focusStatus = "init";
			// display widget
			$view.show();
			$view.attr( "tabindex", -1 ).focusin( function ( e ) {
				self.focusIn();
			});

			// assign global variables
			self._viewWidth = $view.innerWidth();
			self._reservedWidth += self._calcBlockWidth( moreBlock );
			self._reservedWidth += self._calcBlockWidth( labeltag );
			self._fontSize = $( moreBlock ).css( "font-size" ).replace( "px", "" );
			self._currentWidth = self._reservedWidth;
		},
		// bind events
		_bindEvents : function () {
			var self = this,
				$view = this.element,
				inputbox = $view.find( ".ui-multibuttonentry-input" );

			inputbox.bind( "keydown", function ( event ) {
				// 8  : backspace
				// 13 : Enter
				var keyValue = event.keyCode,
					valueString = $( inputbox ).val();

				if ( keyValue == 8 ) {
					if ( valueString.length === 0 ) {
						//self._removeTextBlock( valueString );
						self._validateTargetBlock();
					}
				} else if ( keyValue == 13 ) {
					if ( valueString.length !== 0 ) {
						self._addTextBlock( valueString );
					}
					inputbox.val( "" );
				} else {
					self._unlockTextBlock();
				}
			});

			$( document ).bind( "pagechange.mbe", function ( event ) {
				self._modifyInputBoxWidth();
				self._resizeBlock();
			});
		},
		// create a textbutton and append this button to parent layer.
		// @param arg1 : string
		// @param arg2 : index
		_addTextBlock : function ( messages, blcokIndex ) {
			if ( arguments.length === 0 ) {
				return;
			}

			var self = this,
				$view = self.element,
				content = messages,
				index = blcokIndex,
				blocks = null,
				dataBlock = null,
				displayText = null,
				textBlock = null;

			if ( self._viewWidth === 0 ) {
				self._viewWidth = $view.innerWidth();
			}
			// save src data
			dataBlock = $( document.createElement( 'input' ) );
			dataBlock.val( content ).addClass( "ui-multibuttonentry-data" ).hide();

			// Create a new text HTMLDivElement.
			textBlock = $( document.createElement( 'div' ) );
			displayText = self._ellipsisTextBlock( content ) ;
			textBlock.text( displayText ).addClass( "ui-multibuttonentry-block" );
			textBlock.append( dataBlock );
			// bind a event to HTMLDivElement.
			textBlock.bind( "vclick", function ( event ) {
				if ( self._focusStatus === "focusOut" ) {
					self.focusInEvent();
					return;
				}

				if ( $( this ).hasClass( "ui-multibuttonentry-sblock" ) ) {
					// If block is selected, it will be removed.
					self._removeTextBlock();
				}

				var lockBlock = $view.find( "div.ui-multibuttonentry-sblock" );
				if ( typeof lockBlock != "undefined" ) {
					lockBlock.removeClass( "ui-multibuttonentry-sblock" ).addClass( "ui-multibuttonentry-block" );
				}
				$( this ).removeClass( "ui-multibuttonentry-block" ).addClass( "ui-multibuttonentry-sblock" );
				self._trigger( "select" );
			});

			blocks = $view.find( "div" );
			if ( index !== null && index <= blocks.length ) {
				$( blocks[index] ).before( textBlock );
			} else {
				$view.find( ".ui-multibuttonentry-input" ).before( textBlock );
			}

			self._currentWidth += self._calcBlockWidth( textBlock );
			self._modifyInputBoxWidth();
			self._trigger( "add" );
		},
		_removeTextBlock : function () {
			var self = this,
				$view = this.element,
				targetBlock = null,
				lockBlock = $view.find( "div.ui-multibuttonentry-sblock" );

			if ( lockBlock !== null && lockBlock.length > 0 ) {
				//self._currentWidth -=  $( lockBlock ).outerWidth();
				self._currentWidth -= self._calcBlockWidth( lockBlock );
				lockBlock.remove();
				self._modifyInputBoxWidth();
				this._trigger( "remove" );
			} else {
				$view.find( "div:last" ).removeClass( "ui-multibuttonentry-block" ).addClass( "ui-multibuttonentry-sblock" );
			}
		},
		_calcBlockWidth : function ( block ) {
			var blockWidth = 0;
			blockWidth = $( block ).outerWidth( true );
			return blockWidth;
		},
		_unlockTextBlock : function () {
			var $view = this.element,
				lockBlock = $view.find( "div.ui-multibuttonentry-sblock" );
			if ( lockBlock !== null ) {
				lockBlock.removeClass( "ui-multibuttonentry-sblock" ).addClass( "ui-multibuttonentry-block" );
			}
		},
		// call when remove text block by backspace key.
		_validateTargetBlock : function () {
			var self = this,
				$view = self.element,
				lastBlock = $view.find( "div:last" ),
				tmpBlock = null;

			if ( lastBlock.hasClass( "ui-multibuttonentry-sblock" ) ) {
				self._removeTextBlock();
			} else {
				tmpBlock = $view.find( "div.ui-multibuttonentry-sblock" );
				tmpBlock.removeClass( "ui-multibuttonentry-sblock" ).addClass( "ui-multibuttonentry-block" );
				lastBlock.removeClass( "ui-multibuttonentry-block" ).addClass( "ui-multibuttonentry-sblock" );
			}
		},
		_ellipsisTextBlock : function ( text ) {
			var self = this,
				str = text,
				length = 0,
				maxWidth = self._viewWidth,
				maxCharCnt = parseInt( ( self._viewWidth / self._fontSize ), 10 ) - 5,
				ellipsisStr = null;
			if ( str ) {
				length = str.length ;
				if ( length > maxCharCnt ) {
					ellipsisStr = str.substring( 0, maxCharCnt );
					ellipsisStr += "...";
				} else {
					ellipsisStr = str;
				}
			}
			return ellipsisStr;
		},
		_modifyInputBoxWidth : function () {
			var self = this,
				$view = self.element,
				maxWidth = self._viewWidth - self._reservedWidth,
				inputBoxWidth = maxWidth - self._reservedWidth,
				blocks = $view.find( "div" ),
				anchorWidth = $view.find( ".ui-multibuttonentry-link" ).outerWidth(true);
				blockWidth = 0,
				index = 0,
				tempWidth = 0,
				margin = 0,
				inputBox = $view.find( ".ui-multibuttonentry-input" );
			margin += parseInt( ( $( inputBox ).css( "margin-left" ) ).replace( "px", "" ), 10 );
			margin += parseInt( ( $( inputBox ).css( "margin-right" ) ).replace( "px", "" ), 10 );
			inputBoxWidth -= margin;
			tempWidth = anchorWidth + margin;
			for ( index = 0; index < blocks.length; index += 1 ) {
				blockWidth = self._calcBlockWidth( blocks[index] );
				inputBoxWidth = inputBoxWidth - blockWidth - margin;
				if ( inputBoxWidth <= 0 ) {
					if ( inputBoxWidth + anchorWidth >= 0 ) {
						inputBoxWidth = self._viewWidth - margin - tempWidth;
					} else {
						inputBoxWidth = self._viewWidth - blockWidth - tempWidth;
					}
				}
			}
			$( inputBox ).width( inputBoxWidth );
		},
		_stringFormat : function ( expression ) {
			var pattern = null,
				message = expression,
				i = 0;
			for ( i = 1; i < arguments.length; i += 1 ) {
				pattern = "{" + ( i - 1 ) + "}";
				message = message.replace( pattern, arguments[i] );
			}
			return message;
		},
		_resizeBlock : function () {
			var self = this,
				$view = self.element,
				dataBlocks = $( ".ui-multibuttonentry-data" ),
				blocks = $view.find( "div" ),
				srcTexts = [],
				index = 0;

			$view.hide();
			for ( index = 0 ; index < dataBlocks.length ; index += 1 ) {
				srcTexts[index] = $( dataBlocks[index] ).val();
				self._addTextBlock( srcTexts[index] );
			}
			blocks.remove();
			$view.show();
		},

		//----------------------------------------------------//
		//                      Public Method                 //
		//----------------------------------------------------//
		//
		// Focus In Event
		//
		focusIn : function () {
			if ( this._focusStatus === "focusIn" ) {
				return;
			}

			var $view = this.element;

			$view.find( "label" ).show();
			$view.find( ".ui-multibuttonentry-desclabel" ).remove();
			$view.find( "div.ui-multibuttonentry-sblock" ).removeClass( "ui-multibuttonentry-sblock" ).addClass( "ui-multibuttonentry-block" );
			$view.find( "div" ).show();
			$view.find( ".ui-multibuttonentry-input" ).show();
			$view.find( "a" ).show();

			// change focus state.
			this._modifyInputBoxWidth();
			this._focusStatus = "focusIn";
		},
		focusOut : function () {
			if ( this._focusStatus === "focusOut" ) {
				return;
			}

			var self = this,
				$view = self.element,
				tempBlock = null,
				statement = "",
				index = 0,
				lastIndex = 10,
				label = $view.find( "label" ),
				more = $view.find( "span" ),
				blocks = $view.find( "div" ),
				currentWidth = $view.outerWidth( true ) - more.outerWidth( true ) - label.outerWidth( true ),
				textWidth = currentWidth;

			$view.find( ".ui-multibuttonentry-input" ).hide();
			$view.find( "a" ).hide();
			blocks.hide();

			// div button
			currentWidth = currentWidth - self._reservedWidth;
			for ( index = 0; index < blocks.length; index += 1 ) {
				currentWidth = currentWidth - $( blocks[index] ).outerWidth( true );
				statement += ", " + $( blocks[index] ).text();
				if ( currentWidth <= 0 ) {
					statement = statement.substring( 0, lastIndex ) + "...";
					statement = self._stringFormat( self.options.descMessage, statement, ( blocks.length - index ) - 1 );
					break;
				}
				lastIndex = statement.length;
			}
			tempBlock = $( document.createElement( 'input' ) );
			tempBlock.val( statement.substr( 1, statement.length ) );
			tempBlock.addClass( "ui-multibuttonentry-desclabel" ).addClass( "ui-multibuttonentry-desclabel" );
			tempBlock.width( textWidth - ( self._reservedWidth ) );
			tempBlock.attr( "disabled", true );
			$view.find( "label" ).after( tempBlock );
			// update foucs state
			this._focusStatus = "focusOut";
		},
		inputText : function ( message ) {
			var $view = this.element;

			if ( arguments.length === 0 ) {
				return $view.find( ".ui-multibuttonentry-input" ).val();
			}
			$view.find( ".ui-multibuttonentry-input" ).val( message );
			return message;
		},
		select : function ( index ) {
			var $view = this.element,
				lockBlock = null,
				blocks = null;

			if ( this._focusStatus === "focusOut" ) {
				return;
			}

			if ( arguments.length === 0 ) {
				// return a selected block.
				lockBlock = $view.find( "div.ui-multibuttonentry-sblock" );
				if ( typeof lockBlock != "undefined" ) {
					return lockBlock.text();
				}
				return null;
			}
			// 1. unlock all blocks.
			this._unlockTextBlock();
			// 2. select pointed block.
			blocks = $view.find( "div" );
			if ( blocks.length > index ) {
				$( blocks[index] ).removeClass( "ui-multibuttonentry-block" ).addClass( "ui-multibuttonentry-sblock" );
				this._trigger( "select" );
			}
			return null;
		},
		add : function ( message, position ) {
			if ( this._focusStatus === "focusOut" ) {
				return;
			}

			this._addTextBlock( message, position );
		},
		remove : function ( position ) {
			var self = this,
				$view = this.element,
				blocks = $view.find( "div" ),
				index = 0;
			if ( this._focusStatus === "focusOut" ) {
				return;
			}

			if ( arguments.length === 0 ) {
				blocks.remove();
				self._modifyInputBoxWidth();
				this._trigger( "clear" );
			} else if ( typeof position == "number" ) {
				// remove selected button
				index = ( ( position < blocks.length ) ? position : ( blocks.length - 1 ) );
				$( blocks[index] ).remove();
				self._modifyInputBoxWidth();
				this._trigger( "remove" );
			}
		},
		length : function () {
			return this.element.find( "div" ).length;
		},
		refresh : function () {
			var self = this,
				$view = this.element;
			self.element.hide().show();
			self._viewWidth = $view.width();
		},
		destory : function () {
			var $view = this.element;

			$view.find( "label" ).remove();
			$view.find( "div" ).unbind( "vclick" ).remove();
			$view.find( "a" ).remove();
			$view.find( ".ui-multibuttonentry-input" ).unbind( "keydown" ).remove();

			this._trigger( "destory" );
		}
	});

	$( document ).bind( "pagecreate create", function () {
		$( ":jqmData(role='multibuttonentry')" ).multibuttonentry();
	});

	$( window ).bind( "resize", function () {
		$( ":jqmData(role='multibuttonentry')" ).multibuttonentry( "refresh" );
	});
} ( jQuery, window, document ) );