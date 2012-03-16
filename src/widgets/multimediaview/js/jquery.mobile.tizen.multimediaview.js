/*
 * Authors: Yonghwi Park <yonghwi0324.park@samsung.com>
 *		 Wonseop Kim <wonseop.kim@samsung.com>
 */

/**
 * multimediaview is a widget that lets the user to see and handle with multimedia contents.
 *
 * To apply, add the attribute data-role="multimediaview" to an <div> field.
 *
 *
 * HTML Attributes:
 *			data-theme : Set a theme of widget.
 *				If this value is not defined, widget will use parent`s theme. (optional)
 *			data-controls : If this value is 'true', widget will use belonging controller.
 *				If this value is 'false', widget will use browser`s controller.
 *				Default value is 'true'.
 *			data-fullscreen : Set a status that fullscreen when inital start.
 *				Default value is 'false'.
 *
 * APIs:
 *			width( void )
 *					: Get a width of widget.
 *			width( number )
 *					: Set a widget of widget.
 *			height( void )
 *					: Get a height of widget.
 *			height( number )
 *					: Set a height of widget.
 *			size( number, number )
 *					: Set a size of widget and resize a widget.
 *					 First argument is width and second argument is height.
 *			fullscreen( void )
 *					: Get a status that fullscreen.
 *			fullscreen( boolean )
 *					: Set a status that fullscreen.
 * Events:
 *
 *
 *
 * Examples:
 *
 *			VIDEO :
 *				<video data-controls="true" style="width:100%;">
 *					<source src="media/oceans-clip.mp4" type="video/mp4" />
 *					Your browser does not support the video tag.
 *				</video>
 *
 *			AUDIO :
 *				<audio data-controls="true" style="width:100%;">
 *					<source src="media/Over the horizon.mp3" type="audio/mp3" />
 *					Your browser does not support the video tag.
 *				</audio>
 *
 */

( function ( $, document, window, undefined ) {
	$.widget( "tizen.multimediaview", $.mobile.widget, {
		options : {
			theme : null,
			controls : true,
			fullScreen : false,
			initSelector : "video, audio"
		},
		_create : function () {
			var self = this,
				view = self.element,
				option = self.options,
				role = "multimediaview",
				control = null;

			$.extend( this, {
				role : null,
				isControlHide : false,
				controlTimer : null,
				isVolumeHide : true,
				isVertical : true,
				backupView : null
			});

			self.role = role;
			view.addClass( "ui-multimediaview" );
			control = self._createControl();

			if ( view[0].nodeName === "AUDIO" ) {
				control.addClass( "ui-multimediaview-audio" );
			}

			control.hide();
			view.wrap( "<div class='ui-multimediaview-wrap'>" ).after( control );
			view.removeAttr( "controls" );
			self._addEvent();

			$( document ).bind( "pagechange.multimediaview", function ( e ) {
				control.show();
				self._resize();
			});
			$( document ).bind( "pagebeforechange.multimediaview", function ( e ) {
				if ( view[0].played.length !== 0 ) {
					view[0].pause();
					control.hide();
				}
			});
		},
		_resize : function () {
			var view = this.element,
				parent = view.parent(),
				control = parent.find( ".ui-multimediaview-control" ),
				viewWidth = 0,
				viewHeight = 0,
				viewOffset = null;

			this._resizeFullscreen( this.options.fullscreen );
			viewWidth = parent.width();
			viewHeight = ( ( view[0].nodeName === "VIDEO" ) ? view.height() : control.height() );
			viewOffset = view.offset();

			this._resizeControl( viewOffset, viewWidth, viewHeight );
		},
		_resizeControl : function ( offset, width, height ) {
			var self = this,
				view = self.element,
				viewElement = view[0],
				control = view.parent().find( ".ui-multimediaview-control" ),
				buttons = control.find( ".ui-button" ),
				playpauseButton = control.find( ".ui-playpausebutton" ),
				volumeControl = control.find( ".ui-volumecontrol" ),
				seekBar = control.find( ".ui-seekbar" ),
				durationLabel = control.find( ".ui-durationlabel" ),
				controlWidth = width,
				controlHeight = control.outerHeight( true ),
				availableWidth = 0,
				controlOffset = null;

			if ( typeof control != "undefined" && control !== null ) {
				if ( view[0].nodeName === "VIDEO" ) {
					controlOffset = control.offset();
					controlOffset.top = offset.top + height - controlHeight;
					control.offset( controlOffset );
				}

				control.width( controlWidth );
			}

			if ( typeof seekBar != "undefined" && seekBar !== null ) {
				availableWidth = control.width() - ( buttons.outerWidth( true ) * buttons.length );
				availableWidth -= ( parseInt( buttons.eq( 0 ).css( "margin-left" ), 10 ) + parseInt( buttons.eq( 0 ).css( "margin-right" ), 10 ) ) * buttons.length;
				if ( !self.isVolumeHide ) {
					availableWidth -= volumeControl.outerWidth( true );
				}
				seekBar.width( availableWidth );
			}

			if ( typeof durationLabel != "undefined" && durationLabel !== null && !isNaN( viewElement.duration ) ) {
				durationLabel.find( "p" ).text( self._convertTimeFormat( viewElement.duration ) );
			}

			if ( viewElement.autoplay && viewElement.paused === false ) {
				playpauseButton.removeClass( "ui-play-icon" ).addClass( "ui-pause-icon" );
			}
		},
		_resizeFullscreen : function ( isFullscreen ) {
			var self = this,
				view = self.element,
				parent = view.parent(),
				control = view.parent().find( ".ui-multimediaview-control" ),
				playpauseButton = control.find( ".ui-playpausebutton" ),
				timestampLabel = control.find( ".ui-timestamplabel" ),
				seekBar = control.find( ".ui-seekbar" ),
				durationBar = seekBar.find( ".ui-duration" ),
				currenttimeBar = seekBar.find( ".ui-currenttime" ),
				docWidth = 0,
				docHeight = 0;

			if ( isFullscreen ) {
				if ( self.backupView !== null ) {
					return;
				}

				self.backupView = {
					width : view.width(),
					height : view.height(),
					offset : view.offset(),
					position : view.css( "position" ),
					zindex : view.css( "z-index" )
				};

				docWidth = $( "body" )[0].clientWidth;
				docHeight = $( "body" )[0].clientHeight;

				view.width( docWidth ).height( docHeight - 1 );
				view.addClass( "ui-" + self.role + "-fullscreen" );
				view.offset( {
					top : 0,
					left : 0
				});
			} else {
				if ( self.backupView === null ) {
					return;
				}

				view.removeClass( "ui-" + self.role + "-fullscreen" );
				view.width( self.backupView.width ).height( self.backupView.height );
				view.css( "position", self.backupView.position );
				view.css( "z-index", self.backupView.zindex );
				self.backupView = null;
			}
			parent.show();
		},
		_addEvent : function () {
			var self = this,
				view = self.element,
				viewElement = view[0],
				control = view.parent().find( ".ui-multimediaview-control" ),
				playpauseButton = control.find( ".ui-playpausebutton" ),
				timestampLabel = control.find( ".ui-timestamplabel" ),
				durationLabel = control.find( ".ui-durationlabel" ),
				volumeButton = control.find( ".ui-volumebutton" ),
				volumeControl = control.find( ".ui-volumecontrol" ),
				volumeBar = volumeControl.find( ".ui-volumebar" ),
				volumeGuide = volumeControl.find( ".ui-guide" ),
				volumeHandle = volumeControl.find( ".ui-handler" ),
				fullscreenButton = control.find( ".ui-fullscreenbutton" ),
				seekBar = control.find( ".ui-seekbar" ),
				durationBar = seekBar.find( ".ui-duration" ),
				currenttimeBar = seekBar.find( ".ui-currenttime" );

			view.bind( "loadedmetadata.multimediaview", function ( e ) {
				if ( !isNaN( viewElement.duration ) ) {
					durationLabel.find( "p" ).text( self._convertTimeFormat( viewElement.duration ) );
				}
				self._resize();
			}).bind( "timeupdate.multimediaview", function ( e ) {
				self._updateSeekBar();
			}).bind( "play.multimediaview", function ( e ) {
				playpauseButton.removeClass( "ui-play-icon" ).addClass( "ui-pause-icon" );
			}).bind( "pause.multimediaview", function ( e ) {
				playpauseButton.removeClass( "ui-pause-icon" ).addClass( "ui-play-icon" );
			}).bind( "ended.multimediaview", function ( e ) {
				if ( typeof viewElement.loop == "undefined" || viewElement.loop === "" ) {
					self.stop();
				}
			}).bind( "volumechange.multimediaview", function ( e ) {
				if ( viewElement.volume < 0.1 ) {
					viewElement.muted = true;
					volumeButton.removeClass( "ui-volume-icon" ).addClass( "ui-mute-icon" );
				} else {
					viewElement.muted = false;
					volumeButton.removeClass( "ui-mute-icon" ).addClass( "ui-volume-icon" );
				}

				if ( !self.isVolumeHide ) {
					self._updateVolumeState();
				}
			}).bind( "durationchange.multimediaview", function ( e ) {
				if ( !isNaN( viewElement.duration ) ) {
					durationLabel.find( "p" ).text( self._convertTimeFormat( viewElement.duration ) );
				}
				self._resize();
			}).bind( "error.multimediaview", function ( e ) {
				switch ( e.target.error.code ) {
				case e.target.error.MEDIA_ERR_ABORTED :
					window.alert( 'You aborted the video playback.' );
					break;
				case e.target.error.MEDIA_ERR_NETWORK :
					window.alert( 'A network error caused the video download to fail part-way.' );
					break;
				case e.target.error.MEDIA_ERR_DECODE :
					window.alert( 'The video playback was aborted due to a corruption problem or because the video used features your browser did not support.' );
					break;
				case e.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED :
					window.alert( 'The video could not be loaded, either because the server or network failed or because the format is not supported.' );
					break;
				default :
					window.alert( 'An unknown error occurred.' );
					break;
				}
			}).bind( "vclick.multimediaview", function ( e ) {
				control.fadeToggle( "fast", function () {
					var offset = control.offset();
					self.isControlHide = !self.isControlHide;
					if ( self.options.mediatype == "video" ) {
						self._startTimer();
					}
				});
				self._updateSeekBar();
			});

			playpauseButton.bind( "vclick.multimediaview", function () {
				self._endTimer();

				if ( viewElement.paused ) {
					viewElement.play();
				} else {
					viewElement.pause();
				}

				if ( self.options.mediatype == "video" ) {
					self._startTimer();
				}
			});

			fullscreenButton.bind( "vclick.multimediaview", function () {
				self.fullscreen( !self.options.fullscreen );
				control.fadeIn( "fast" );
				self._endTimer();
			});

			seekBar.bind( "vmousedown.multimediaview", function ( e ) {
				var x = e.clientX,
					duration = viewElement.duration,
					durationOffset = durationBar.offset(),
					durationWidth = durationBar.width(),
					timerate = ( x - durationOffset.left ) / durationWidth,
					time = duration * timerate;

				viewElement.currentTime = time;

				self._endTimer();

				e.preventDefault();
				e.stopPropagation();

				$( document ).bind( "vmousemove.multimediaview", function ( e ) {
					var x = e.clientX,
						timerate = ( x - durationOffset.left ) / durationWidth;

					viewElement.currentTime = duration * timerate;

					e.preventDefault();
					e.stopPropagation();
				}).bind( "vmouseup.multimediaview", function () {
					$( document ).unbind( "vmousemove.multimediaview vmouseup.multimediaview" );
					if ( viewElement.paused ) {
						viewElement.pause();
					} else {
						viewElement.play();
					}
				});
			});

			volumeButton.bind( "vclick.multimediaview", function () {
				if ( self.isVolumeHide ) {
					var view = self.element,
						volume = viewElement.volume;

					self.isVolumeHide = false;
					self._resize();
					volumeControl.fadeIn( "fast" );
					self._updateVolumeState();
					self._updateSeekBar();
				} else {
					self.isVolumeHide = true;
					volumeControl.fadeOut( "fast", function () {
						self._resize();
					});
					self._updateSeekBar();
				}
			});

			$( volumeBar ).bind( "vmousedown.multimediaview", function ( e ) {
				var baseX = e.clientX,
					volumeGuideLeft = volumeGuide.offset().left,
					volumeGuideWidth = volumeGuide.width(),
					volumeBase = volumeGuideLeft + volumeGuideWidth,
					handlerOffset = volumeHandle.offset(),
					volumerate = ( baseX - volumeGuideLeft ) / volumeGuideWidth,
					currentVolume = ( baseX - volumeGuideLeft ) / volumeGuideWidth;

				self._endTimer();
				self._setVolume( 1 - currentVolume.toFixed( 2 ) );

				e.preventDefault();
				e.stopPropagation();

				$( document ).bind( "vmousemove.multimediaview", function ( e ) {
					var currentX = e.clientX,
						currentVolume = ( currentX - volumeGuideLeft ) / volumeGuideWidth;

					self._setVolume( 1 - currentVolume.toFixed( 2 ) );

					e.preventDefault();
					e.stopPropagation();
				}).bind( "vmouseup.multimediaview", function () {
					$( document ).unbind( "vmousemove.multimediaview vmouseup.multimediaview" );

					if ( self.options.mediatype == "video" ) {
						self._startTimer();
					}
				});
			});
		},
		_removeEvent : function () {
			var self = this,
				view = self.element,
				control = view.parent().find( ".ui-multimediaview-control" ),
				playpauseButton = control.find( ".ui-playpausebutton" ),
				fullscreenButton = control.find( ".ui-fullscreenbutton" ),
				seekBar = control.find( ".ui-seekbar" ),
				volumeControl = control.find( ".ui-volumecontrol" ),
				volumeBar = volumeControl.find( ".ui-volumebar" ),
				volumeHandle = volumeControl.find( ".ui-handler" );

			view.unbind( ".multimediaview" );
			playpauseButton.unbind( ".multimediaview" );
			fullscreenButton.unbind( ".multimediaview" );
			seekBar.unbind( ".multimediaview" );
			volumeBar.unbind( ".multimediaview" );
			volumeBar.unbind( ".multimediaview" );
			volumeHandle.unbind( ".multimediaview" );
		},
		_createControl : function () {
			var self = this,
				view = self.element,
				control = $( "<span></span>" ),
				playpauseButton = $( "<span></span>" ),
				seekBar = $( "<span></span>" ),
				timestampLabel = $( "<span><p>00:00:00</p></span>" ),
				durationLabel = $( "<span><p>00:00:00</p></span>" ),
				volumeButton = $( "<span></span>" ),
				volumeControl = $( "<span></span>" ),
				volumeBar = $( "<div></div>" ),
				volumeGuide = $( "<span></span>" ),
				volumeValue = $( "<span></span>" ),
				volumeHandle = $( "<span></span>" ),
				fullscreenButton = $( "<span></span>" ),
				durationBar = $( "<span></span>" ),
				currenttimeBar = $( "<span></span>" );

			control.addClass( "ui-" + self.role + "-control" );
			playpauseButton.addClass( "ui-playpausebutton ui-button" );
			seekBar.addClass( "ui-seekbar" );
			timestampLabel.addClass( "ui-timestamplabel" );
			durationLabel.addClass( "ui-durationlabel" );
			volumeButton.addClass( "ui-volumebutton ui-button" );
			fullscreenButton.addClass( "ui-fullscreenbutton ui-button" );
			durationBar.addClass( "ui-duration" );
			currenttimeBar.addClass( "ui-currenttime" );
			volumeControl.addClass( "ui-volumecontrol" );
			volumeBar.addClass( "ui-volumebar" );
			volumeGuide.addClass( "ui-guide" );
			volumeValue.addClass( "ui-value" );
			volumeHandle.addClass( "ui-handler" );

			seekBar.append( durationBar ).append( currenttimeBar ).append( durationLabel ).append( timestampLabel );

			playpauseButton.addClass( "ui-play-icon" );
			if ( view[0].muted ) {
				$( volumeButton ).addClass( "ui-mute-icon" );
			} else {
				$( volumeButton ).addClass( "ui-volume-icon" );
			}

			volumeBar.append( volumeGuide ).append( volumeValue ).append( volumeHandle );
			volumeControl.append( volumeBar );

			control.append( playpauseButton ).append( seekBar ).append( volumeControl ).append( volumeButton );

			if ( self.element[0].nodeName === "VIDEO" ) {
				$( fullscreenButton ).addClass( "ui-fullscreen-on" );
				control.append( fullscreenButton );
			}
			volumeControl.hide();

			return control;
		},
		_startTimer : function ( duration ) {
			this._endTimer();

			if ( typeof duration == "undefined" ) {
				duration = 3000;
			}

			var self = this,
				view = self.element,
				control = view.parent().find( ".ui-multimediaview-control" ),
				volumeControl = control.find( ".ui-volumecontrol" );

			self.controlTimer = setTimeout( function () {
				self.isVolumeHide = true;
				self.isControlHide = true;
				self.controlTimer = null;
				volumeControl.hide();
				control.fadeOut( "fast" );
			}, duration );
		},
		_endTimer : function () {
			if ( this.controlTimer !== null ) {
				clearTimeout( this.controlTimer );
				this.controlTimer = null;
			}
		},
		_convertTimeFormat : function ( systime ) {
			var ss = parseInt( systime % 60, 10 ).toString(),
				mm = parseInt( ( systime / 60 ) % 60, 10 ).toString(),
				hh = parseInt( systime / 3600, 10 ).toString(),
				time =	( ( hh.length < 2  ) ? "0" + hh : hh ) + ":" +
						( ( mm.length < 2  ) ? "0" + mm : mm ) + ":" +
						( ( ss.length < 2  ) ? "0" + ss : ss );

			return time;
		},
		_updateSeekBar : function ( currenttime ) {
			var self = this,
				view = self.element,
				duration = view[0].duration,
				control = view.parent().find( ".ui-multimediaview-control" ),
				seekBar = control.find(  ".ui-seekbar"  ),
				durationBar = seekBar.find( ".ui-duration" ),
				currenttimeBar = seekBar.find( ".ui-currenttime" ),
				timestampLabel = control.find( ".ui-timestamplabel" ),
				durationOffset = durationBar.offset(),
				durationWidth = durationBar.width(),
				durationHeight = durationBar.height(),
				timebarWidth = 0;

			if ( typeof currenttime == "undefined" ) {
				currenttime = view[0].currentTime;
			}
			timebarWidth = parseInt( currenttime / duration * durationWidth, 10 );
			currenttimeBar.offset( durationOffset ).width( timebarWidth );
			timestampLabel.find( "p" ).text( self._convertTimeFormat( currenttime ) );
		},
		_updateVolumeState : function () {
			var self = this,
				view = self.element,
				control = view.parent().find( ".ui-multimediaview-control" ),
				volumeControl = control.find( ".ui-volumecontrol" ),
				volumeButton = control.find( ".ui-volumebutton" ),
				volumeBar = volumeControl.find( ".ui-volumebar" ),
				volumeGuide = volumeControl.find( ".ui-guide" ),
				volumeValue = volumeControl.find( ".ui-value" ),
				volumeHandle = volumeControl.find( ".ui-handler" ),
				handlerWidth = volumeHandle.width(),
				handlerHeight = volumeHandle.height(),
				volumeBarHeight = volumeControl.height(),
				volumeGuideWidth = volumeGuide.width(),
				volumeBarTop = 0,
				volumeGuideLeft = 0,
				volumeBase = 0,
				handlerOffset = null,
				volume = view[0].volume;

			volumeBarTop = parseInt( volumeBar.offset().top, 10 );
			volumeGuideLeft = volumeGuide.offset().left;
			volumeBase = volumeGuideLeft + volumeGuideWidth;
			handlerOffset = volumeHandle.offset();
			handlerOffset.top = volumeBarTop + parseInt( ( volumeBarHeight - handlerHeight ) / 2, 10 );
			handlerOffset.left = volumeBase - parseInt( volumeGuideWidth * volume, 10 ) - parseInt( handlerWidth / 2, 10 );
			volumeHandle.offset( handlerOffset );
			volumeValue.width( parseInt( volumeGuideWidth * ( 1 - volume ), 10 ) );
		},
		_setVolume : function ( value ) {
			var viewElement = this.element[0];

			if ( value < 0.0 || value > 1.0 ) {
				return;
			}

			viewElement.volume = value;
		},
		_fitContentArea: function ( page, parent ) {
			if ( typeof parent == "undefined" ) {
				parent = window;
			}

			var $page = $( page ),
				$content = $page.children( ".ui-content:visible:first" ),
				hh = $page.children( ".ui-header:visible" ).outerHeight() || 0,
				fh = $page.children( ".ui-footer:visible" ).outerHeight() || 0,
				pt = parseFloat( $content.css( "padding-top" ) ),
				pb = parseFloat( $content.css( "padding-bottom" ) ),
				wh = $( parent ).height(),
				height = wh - ( hh + fh ) - ( pt + pb );

			$content.offset( {
				top : ( hh + pt )
			}).height( height );
		},
		width : function ( value ) {
			var self = this,
				args = arguments,
				view = self.element;

			if ( args.length === 0 ) {
				return view.width();
			}
			if ( args.length === 1 ) {
				view.width( value );
				self._resize();
			}
		},
		height : function ( value ) {
			var self = this,
				view = self.element,
				args = arguments;

			if ( args.length === 0 ) {
				return view.height();
			}
			if ( args.length === 1 ) {
				view.height( value );
				self._resize();
			}
		},
		size : function ( width, height ) {
			var self = this,
				view = self.element;

			view.width( width ).height( height );
			self._resize();
		},
		fullscreen : function ( value ) {
			var self = this,
				control = self.element.parent().find( ".ui-multimediaview-control" ),
				fullscreenButton = control.find( ".ui-fullscreenbutton" ),
				args = arguments,
				option = this.options,
				currentPage = $( ".ui-page-active" );

			if ( args.length === 0 ) {
				return option.fullscreen;
			}
			if ( args.length === 1 ) {
				this.options.fullscreen = value;
				if ( value ) {
					currentPage.children( ".ui-header:visible" ).hide();
					currentPage.children( ".ui-footer:visible" ).hide();
					this._fitContentArea( currentPage );
					fullscreenButton.removeClass( "ui-fullscreen-on" ).addClass( "ui-fullscreen-off" );
				} else {
					currentPage.children( ".ui-header" ).show();
					currentPage.children( ".ui-footer" ).show();
					this._fitContentArea( currentPage );
					fullscreenButton.removeClass( "ui-fullscreen-off" ).addClass( "ui-fullscreen-on" );
				}
				self._resize();
			}
		},
		refresh : function () {
			this._resize();
		}
	});

	$( document ).bind( "pagecreate create", function ( e ) {
		$.tizen.multimediaview.prototype.enhanceWithin( e.target );
	});

	$( window ).bind( "orientationchange", function () {
		$( ":jqmData(role='multimediaview')" ).multimediaview( "refresh" );
	});
} ( jQuery, document, window ) );
