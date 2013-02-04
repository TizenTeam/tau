/* ***************************************************************************
 * Copyright (c) 2000 - 2011 Samsung Electronics Co., Ltd.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 * ***************************************************************************
 *
 * Authors: Yonghwi Park <yonghwi0324.park@samsung.com>
 *		 Wonseop Kim <wonseop.kim@samsung.com>
*/

/**
 *
 * MultiMediaView is a widget that lets the user view and handle multimedia contents.
 * Video and audio elements are coded as standard HTML elements and enhanced by the 
 * MultiMediaview to make them attractive and usable on a mobile device.
 *
 * HTML Attributes:
 *			data-theme : Set a theme of widget.
 *				If this value is not defined, widget will use parent`s theme. (optional)
 *			data-controls : If this value is 'true', widget will use belonging controller.
 *				If this value is 'false', widget will use browser`s controller.
 *				Default value is 'true'.
 *			data-full-screen : Set a status that full-screen when inital start.
 *				Default value is 'false'.
 *
 * APIs:
 *			width( [number] )
 *					: Get or set the width of widget.
 *					The first argument is the width of widget.
 *					If no first argument is specified, will act as a getter.
 *			height( [number] )
 *					: Get or set the height of widget.
 *					The first argument is the height of widget.
 *					If no first argument is specified, will act as a getter.
 *			fullScreen( [boolean] )
 *					: Get or Set the status of full-screen.
 *					If no first argument is specified, will act as a getter.
 *
 * Events:
 *
 *			create :  triggered when a multimediaview is created.
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
 *					Your browser does not support the audio tag.
 *				</audio>
 *
 */
/**
	@class MutimediaView
	The multimedia view widget shows a player control that you can use to view and handle multimedia content. This widget uses the standard HTML video and audio elements, which have been enhanced for use on a mobile device.

	To add a multimedia view widget to the application, use the following code:
	
		// Video player control
		<video data-controls="true" style="width:100%;">
		<source src="<VIDEO_FILE_URL>" type="video/mp4" /> Your browser does not support the video tag. </video>
		// Audio player control
		<audio data-controls="true" style="width:100%;"> <source src="<AUDIO_FILE_URL>" type="audio/mp3" /> Your browser does not support the audio tag.
		</audio>

	The multimedia view can define a callback for the create event, which is fired when the widget is created.
		$('.selector').multimediaview({
			create:function(event, u){...}
		});
		$(".selector").bind("create", function(event, ui)
		{
			// Respond to the multimedia view widget creation
		});
*/
/**
	@property {Boolean} data-control
	Sets the controls for the widget.
	The default value is true. If the value is set to true, the widget uses its own player controls. If the value is set to false, the widget uses the browser's player controls.
*/
/**
	@property {Boolean} data-full-screen
	Defines whether the widget opens in the fullscreen view mode.
	The default value is false.
*/
/**
	@property {String} data-theme
	Sets the widget theme.
	If the value is not set, the parent control's theme is used
*/
/**
	@method width
	The width method is used to get (if no value is defined) or set the multimedia view widget width:
		<video>
			 <source src="test.mp4" type="video/mp4" />
		</video>
		$(".selector").multimediaview("width", [value]);
*/
/**
	@method height
	The height method is used to get (if no value is defined) or set the multimedia view widget height:
		<video>
			<source src="test.mp4" type="video/mp4" />
		</video>
		$(".selector").multimediaview("height", [value]);
*/
/**
	@method fullScreen
	The fullScreen method is used to get (if no value is defined) or set the full-screen mode of the multimedia view widget. If the value is true, the full-screen mode is used; otherwise the multimedia view widget runs in the normal mode.

		<video>
			<source src="test.mp4" type="video/mp4" />
		</video>
		$(".selector").multimediaview("fullScreen", [value]);
*/
( function ( $, document, window, undefined ) {
	$.widget( "tizen.multimediaview", $.mobile.widget, {
		options: {
			theme: null,
			controls: true,
			fullScreen: false,
			initSelector: "video, audio"
		},

		_create: function () {
			var self = this,
				view = self.element,
				viewElement = view[0],
				isVideo = ( viewElement.nodeName === "VIDEO" ),
				option = self.options,
				parentTheme = $.mobile.getInheritedTheme( view, "s" ),
				theme = option.theme || parentTheme,
				control = null;

			$.extend( this, {
				role: null,
				isControlHide: false,
				controlTimer: null,
				isVolumeHide: true,
				backupView: null,
				_reserveVolume: -1,
				_isVideo: isVideo
			});

			view.addClass( "ui-multimediaview" );
			control = self._createControl();
			control.find( ".ui-button" ).each( function ( index ) {
				$( this ).buttonMarkup( { corners: true, theme: theme, shadow: true } );
			});

			if ( isVideo ) {
				control.addClass( "ui-multimediaview-video" );
			}

			view.wrap( "<div class='ui-multimediaview-wrap ui-multimediaview-" + theme + "'>" ).after( control );
			if ( option.controls && view.attr( "controls" ) ) {
				view.removeAttr( "controls" );
			}

			self._addEvent();
		},

		_resize: function () {
			this._resizeFullscreen( this.options.fullScreen );
			this._resizeControl();
			this._updateSeekBar();
			this._updateVolumeState();
		},

		_resizeControl: function () {
			var self = this,
				view = self.element,
				viewElement = view[0],
				isVideo = self._isVideo,
				wrap = view.parent( ".ui-multimediaview-wrap" ),
				control = wrap.find( ".ui-multimediaview-control" ),
				buttons = control.find( ".ui-button" ),
				playpauseButton = control.find( ".ui-playpausebutton" ),
				seekBar = control.find( ".ui-seekbar" ),
				durationLabel = control.find( ".ui-durationlabel" ),
				timestampLabel = control.find( ".ui-timestamplabel" ),
				volumeControl = control.find( ".ui-volumecontrol" ),
				volumeBar = volumeControl.find( ".ui-volumebar" ),
				width = ( isVideo ? view.width() : wrap.width() ),
				height = ( isVideo ? view.height() : control.height() ),
				offset = view.offset(),
				controlHeight = control.height(),
				availableWidth = 0,
				controlOffset = null;

			if ( control ) {
				if ( isVideo ) {
					controlOffset = control.offset();
					controlOffset.left = offset.left;
					controlOffset.top = offset.top + height - controlHeight;
					control.offset( controlOffset );
				}
				control.width( width );
			}

			if ( seekBar ) {
				availableWidth = control.width() - ( buttons.outerWidth( true ) * buttons.length );
				availableWidth -= ( parseInt( buttons.eq( 0 ).css( "margin-left" ), 10 ) + parseInt( buttons.eq( 0 ).css( "margin-right" ), 10 ) ) * buttons.length;
				if ( !self.isVolumeHide ) {
					availableWidth -= volumeControl.outerWidth( true );
				}
				seekBar.width( availableWidth );
			}

			if ( durationLabel && !isNaN( viewElement.duration ) ) {
				durationLabel.find( "p" ).text( self._convertTimeFormat( viewElement.duration ) );
			}

			if ( viewElement.autoplay && viewElement.paused === false ) {
				playpauseButton.removeClass( "ui-play-icon" ).addClass( "ui-pause-icon" );
			}

			if ( seekBar.width() < ( volumeBar.width() + timestampLabel.width() + durationLabel.width() ) ) {
				durationLabel.hide();
			} else {
				durationLabel.show();
			}
		},

		_resizeFullscreen: function ( isFullscreen ) {
			var self = this,
				view = self.element,
				viewElement = view[0],
				wrap = view.parent( ".ui-multimediaview-wrap" ),
				control = wrap.find( ".ui-multimediaview-control" ),
				playpauseButton = control.find( ".ui-playpausebutton" ),
				timestampLabel = control.find( ".ui-timestamplabel" ),
				seekBar = control.find( ".ui-seekbar" ),
				durationBar = seekBar.find( ".ui-duration" ),
				currenttimeBar = seekBar.find( ".ui-currenttime" ),
				body = $( "body" )[0],
				docWidth = 0,
				docHeight = 0;

			if ( isFullscreen ) {
				if ( !self.backupView ) {
					self.backupView = {
						width: viewElement.style.getPropertyValue( "width" ) || "",
						height: viewElement.style.getPropertyValue( "height" ) || "",
						position: view.css( "position" ),
						zindex: view.css( "z-index" ),
						wrapHeight: wrap[0].style.getPropertyValue( "height" ) || ""
					};
				}
				docWidth = body.clientWidth;
				docHeight = body.clientHeight;

				view.width( docWidth ).height( docHeight - 1 );
				wrap.height( docHeight - 1 )
					.siblings()
					.addClass( "ui-multimediaview-siblings-off" );
				view.offset( {
					top: 0,
					left: 0
				}).addClass( "ui-multimediaview-fullscreen" );
			} else {
				if ( !self.backupView ) {
					return;
				}
				wrap.css( "height", self.backupView.wrapHeight )
					.siblings()
					.removeClass( "ui-multimediaview-siblings-off" );
				view.css( {
					"width": self.backupView.width,
					"height": self.backupView.height,
					"position": self.backupView.position,
					"z-index": self.backupView.zindex
				}).removeClass( "ui-multimediaview-fullscreen" );
				self.backupView = null;
			}
		},

		_addEvent: function () {
			var self = this,
				view = self.element,
				option = self.options,
				viewElement = view[0],
				isVideo = self._isVideo,
				control = view.parent( ".ui-multimediaview-wrap" ).find( ".ui-multimediaview-control" ),
				playpauseButton = control.find( ".ui-playpausebutton" ),
				timestampLabel = control.find( ".ui-timestamplabel" ),
				durationLabel = control.find( ".ui-durationlabel" ),
				volumeButton = control.find( ".ui-volumebutton" ),
				volumeControl = control.find( ".ui-volumecontrol" ),
				volumeBar = volumeControl.find( ".ui-volumebar" ),
				volumeGuide = volumeControl.find( ".ui-guide" ),
				volumeHandle = volumeControl.find( ".ui-handle" ),
				fullscreenButton = control.find( ".ui-fullscreenbutton" ),
				seekBar = control.find( ".ui-seekbar" ),
				durationBar = seekBar.find( ".ui-duration" ),
				currenttimeBar = seekBar.find( ".ui-currenttime" ),
				$document = $( document );

			$document.unbind( ".multimediaview" ).bind( "pagechange.multimediaview", function ( e ) {
				var $page = $( e.target );
				if ( $page.find( view ).length > 0 && viewElement.autoplay ) {
					viewElement.play();
				}

				if ( option.controls ) {
					self._resize();
				}
			}).bind( "pagebeforechange.multimediaview", function ( e ) {
				if ( viewElement.played.length !== 0 ) {
					viewElement.pause();
				}
			});

			$( window ).unbind( ".multimediaview" ).bind( "resize.multimediaview orientationchange.multimediaview", function ( e ) {
				if ( !option.controls ) {
					return;
				}
				var $page = $( e.target ),
					$scrollview = view.parents( ".ui-scrollview-clip" );

				$scrollview.each( function ( i ) {
					if ( $.data( this, "scrollview" ) ) {
						$( this ).scrollview( "scrollTo", 0, 0 );
					}
				});

				// for maintaining page layout
				if ( !option.fullScreen ) {
					$( ".ui-footer:visible" ).show();
				} else {
					$( ".ui-footer" ).hide();
					self._fitContentArea( $page );
				}

				if ( control.css( "display" ) !== "none" ) {
					self._resize();
				}
			});

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
				if ( viewElement.muted && viewElement.volume > 0.1 ) {
					volumeButton.removeClass( "ui-volume-icon" ).addClass( "ui-mute-icon" );
					self._reserveVolume = viewElement.volume;
					viewElement.volume = 0;
				} else if ( self._reserveVolume !== -1 && !viewElement.muted ) {
					volumeButton.removeClass( "ui-mute-icon" ).addClass( "ui-volume-icon" );
					viewElement.volume = self._reserveVolume;
					self._reserveVolume = -1;
				} else if ( viewElement.volume < 0.1 ) {
					volumeButton.removeClass( "ui-volume-icon" ).addClass( "ui-mute-icon" );
				} else {
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
			}).bind( "click.multimediaview", function ( e ) {
				if ( !self.options.controls ) {
					return;
				}

				control.fadeToggle( "fast", function () {
					self.isControlHide = !self.isControlHide;
				});
				self._resize();
			});

			playpauseButton.bind( "click.multimediaview", function () {
				self._endTimer();

				if ( viewElement.paused ) {
					viewElement.play();
				} else {
					viewElement.pause();
				}

				if ( isVideo ) {
					self._startTimer();
				}
			});

			fullscreenButton.bind( "click.multimediaview", function ( e ) {
				self.fullScreen( !self.options.fullScreen );
				control.fadeIn( "fast", function () {
					self._resize();
				});
				self._endTimer();
				e.stopPropagation();
			});

			seekBar.bind( "vmousedown.multimediaview", function ( e ) {
				var x = e.clientX,
					duration = viewElement.duration,
					durationOffset = durationBar.offset(),
					durationWidth = durationBar.width(),
					timerate = ( x - durationOffset.left ) / durationWidth,
					time = duration * timerate;

				if ( !viewElement.played.length ) {
					return;
				}

				viewElement.currentTime = time;

				self._endTimer();

				e.preventDefault();

				$document.bind( "vmousemove.multimediaview", function ( e ) {
					var x = e.clientX,
						timerate = ( x - durationOffset.left ) / durationWidth;

					viewElement.currentTime = duration * timerate;

					e.preventDefault();
				}).bind( "vmouseup.multimediaview", function () {
					$document.unbind( "vmousemove.multimediaview vmouseup.multimediaview" );
					if ( viewElement.paused ) {
						viewElement.pause();
					} else {
						viewElement.play();
					}
				});
			});

			volumeButton.bind( "click.multimediaview", function () {
				if ( self.isVolumeHide ) {
					var view = self.element,
						volume = viewElement.volume;

					self.isVolumeHide = false;
					volumeControl.fadeIn( "fast", function () {
						self._updateVolumeState();
						self._updateSeekBar();
					});
					self._resize();
				} else {
					self.isVolumeHide = true;
					volumeControl.fadeOut( "fast", function () {
						self._resize();
					});
				}
			});

			volumeBar.bind( "vmousedown.multimediaview", function ( e ) {
				var baseX = e.clientX,
					volumeGuideLeft = volumeGuide.offset().left,
					volumeGuideWidth = volumeGuide.width(),
					volumeBase = volumeGuideLeft + volumeGuideWidth,
					handlerOffset = volumeHandle.offset(),
					volumerate = ( baseX - volumeGuideLeft ) / volumeGuideWidth,
					currentVolume = ( baseX - volumeGuideLeft ) / volumeGuideWidth;

				self._endTimer();
				self._setVolume( currentVolume.toFixed( 2 ) );

				e.preventDefault();

				$document.bind( "vmousemove.multimediaview", function ( e ) {
					var currentX = e.clientX,
						currentVolume = ( currentX - volumeGuideLeft ) / volumeGuideWidth;

					self._setVolume( currentVolume.toFixed( 2 ) );

					e.preventDefault();
				}).bind( "vmouseup.multimediaview", function () {
					$document.unbind( "vmousemove.multimediaview vmouseup.multimediaview" );
				});
			});
		},

		_removeEvent: function () {
			var view = this.element,
				control = view.parent( ".ui-multimediaview-wrap" ).find( ".ui-multimediaview-control" ),
				playpauseButton = control.find( ".ui-playpausebutton" ),
				fullscreenButton = control.find( ".ui-fullscreenbutton" ),
				seekBar = control.find( ".ui-seekbar" ),
				volumeControl = control.find( ".ui-volumecontrol" ),
				volumeBar = volumeControl.find( ".ui-volumebar" ),
				volumeHandle = volumeControl.find( ".ui-handle" );

			view.unbind( ".multimediaview" );
			playpauseButton.unbind( ".multimediaview" );
			fullscreenButton.unbind( ".multimediaview" );
			seekBar.unbind( ".multimediaview" );
			volumeBar.unbind( ".multimediaview" );
			volumeHandle.unbind( ".multimediaview" );
		},

		_createControl: function () {
			var view = this.element,
				viewElement = view[0],
				control = $( "<span></span>" ).addClass( "ui-multimediaview-control" ),
				playpauseButton = $( "<span></span>" ).addClass( "ui-playpausebutton ui-button" ),
				seekBar = $( "<span></span>" ).addClass( "ui-seekbar ui-multimediaview-bar" ),
				timestampLabel = $( "<span><p>00:00:00</p></span>" ).addClass( "ui-timestamplabel" ),
				durationLabel = $( "<span><p>00:00:00</p></span>" ).addClass( "ui-durationlabel" ),
				volumeButton = $( "<span></span>" ).addClass( "ui-volumebutton ui-button" ),
				volumeControl = $( "<span></span>" ).addClass( "ui-volumecontrol" ),
				volumeBar = $( "<div></div>" ).addClass( "ui-volumebar ui-multimediaview-bar" ),
				volumeGuide = $( "<span></span>" ).addClass( "ui-guide ui-multimediaview-bar-bg" ),
				volumeValue = $( "<span></span>" ).addClass( "ui-value ui-multimediaview-bar-highlight" ),
				volumeHandle = $( "<span></span>" ).addClass( "ui-handle" ),
				fullscreenButton = $( "<span></span>" ).addClass( "ui-fullscreenbutton ui-button" ),
				durationBar = $( "<span></span>" ).addClass( "ui-duration ui-multimediaview-bar-bg" ),
				currenttimeBar = $( "<span></span>" ).addClass( "ui-currenttime ui-multimediaview-bar-highlight" );

			seekBar.append( durationBar ).append( currenttimeBar ).append( durationLabel ).append( timestampLabel );

			playpauseButton.addClass( "ui-play-icon" );
			volumeButton.addClass( viewElement.muted ? "ui-mute-icon" : "ui-volume-icon" );
			volumeBar.append( volumeGuide ).append( volumeValue ).append( volumeHandle );
			volumeControl.append( volumeBar );

			control.append( playpauseButton ).append( seekBar ).append( volumeControl ).append( volumeButton );

			if ( this._isVideo ) {
				$( fullscreenButton ).addClass( "ui-fullscreen-on" );
				control.append( fullscreenButton );
			}
			volumeControl.hide();

			return control;
		},

		_startTimer: function ( duration ) {
			this._endTimer();

			if ( !duration ) {
				duration = 3000;
			}

			var self = this,
				view = self.element,
				control = view.parent( ".ui-multimediaview-wrap" ).find( ".ui-multimediaview-control" ),
				volumeControl = control.find( ".ui-volumecontrol" );

			self.controlTimer = setTimeout( function () {
				self.isVolumeHide = true;
				self.isControlHide = true;
				self.controlTimer = null;
				volumeControl.hide();
				control.fadeOut( "fast" );
			}, duration );
		},

		_endTimer: function () {
			if ( this.controlTimer ) {
				clearTimeout( this.controlTimer );
				this.controlTimer = null;
			}
		},

		_convertTimeFormat: function ( systime ) {
			if ( isNaN( systime ) ) {
				return "00:00:00";
			}

			var ss = parseInt( systime % 60, 10 ).toString(),
				mm = parseInt( ( systime / 60 ) % 60, 10 ).toString(),
				hh = parseInt( systime / 3600, 10 ).toString(),
				time =	( ( hh.length < 2  ) ? "0" + hh : hh ) + ":" +
						( ( mm.length < 2  ) ? "0" + mm : mm ) + ":" +
						( ( ss.length < 2  ) ? "0" + ss : ss );

			return time;
		},

		_updateSeekBar: function ( currenttime ) {
			var view = this.element,
				viewElement = view[0],
				duration = viewElement.duration,
				control = view.parent( ".ui-multimediaview-wrap" ).find( ".ui-multimediaview-control" ),
				seekBar = control.find(  ".ui-seekbar"  ),
				durationBar = seekBar.find( ".ui-duration" ),
				currenttimeBar = seekBar.find( ".ui-currenttime" ),
				timestampLabel = control.find( ".ui-timestamplabel" ),
				durationOffset = durationBar.offset(),
				durationWidth = durationBar.width(),
				durationHeight = durationBar.height(),
				timebarWidth = 0;

			if ( typeof currenttime === "undefined" ) {
				currenttime = viewElement.currentTime;
			}
			timebarWidth = parseInt( currenttime / duration * durationWidth, 10 );
			durationBar.offset( durationOffset );
			currenttimeBar.offset( durationOffset ).width( timebarWidth );
			timestampLabel.find( "p" ).text( this._convertTimeFormat( currenttime ) );
		},

		_updateVolumeState: function () {
			var view = this.element,
				control = view.parent( ".ui-multimediaview-wrap" ).find( ".ui-multimediaview-control" ),
				volumeControl = control.find( ".ui-volumecontrol" ),
				volumeButton = control.find( ".ui-volumebutton" ),
				volumeBar = volumeControl.find( ".ui-volumebar" ),
				volumeGuide = volumeControl.find( ".ui-guide" ),
				volumeValue = volumeControl.find( ".ui-value" ),
				volumeHandle = volumeControl.find( ".ui-handle" ),
				handlerWidth = volumeHandle.width(),
				handlerHeight = volumeHandle.height(),
				volumeGuideHeight = volumeGuide.height(),
				volumeGuideWidth = volumeGuide.width(),
				volumeGuideTop = 0,
				volumeGuideLeft = 0,
				volumeBase = 0,
				handlerOffset = null,
				volume = view[0].volume;

			volumeGuideTop = parseInt( volumeGuide.offset().top, 10 );
			volumeGuideLeft = parseInt( volumeGuide.offset().left, 10 );
			volumeBase = volumeGuideLeft;
			handlerOffset = volumeHandle.offset();
			handlerOffset.top = volumeGuideTop - parseInt( ( handlerHeight - volumeGuideHeight ) / 2, 10 );
			handlerOffset.left = volumeBase + parseInt( volumeGuideWidth * volume, 10 ) - parseInt( handlerWidth / 2, 10 );
			volumeHandle.offset( handlerOffset );
			volumeValue.offset( volumeGuide.offset() ).width( parseInt( volumeGuideWidth * ( volume ), 10 ) );
		},

		_setVolume: function ( value ) {
			var viewElement = this.element[0];

			if ( value < 0.0 || value > 1.0 ) {
				return;
			}

			viewElement.volume = value;
		},

		_fitContentArea: function ( page, parent ) {
			if ( typeof parent === "undefined" ) {
				parent = window;
			}

			var $page = $( page ),
				$content = $( ".ui-content:visible:first" ),
				hh = $( ".ui-header:visible" ).outerHeight() || 0,
				fh = $( ".ui-footer:visible" ).outerHeight() || 0,
				pt = parseFloat( $content.css( "padding-top" ) ),
				pb = parseFloat( $content.css( "padding-bottom" ) ),
				wh = ( ( parent === window ) ? window.innerHeight : $( parent ).height() ),
				height = wh - ( hh + fh ) - ( pt + pb );

			$content.offset( {
				top: ( hh + pt )
			}).height( height );
		},

		width: function ( value ) {
			var view = this.element;

			if ( arguments.length === 0 ) {
				return view.width();
			}

			view.width( value );
			this._resize();
		},

		height: function ( value ) {
			var view = this.element;

			if ( !this._isVideo ) {
				return;
			}

			if ( arguments.length === 0 ) {
				return view.height();
			}

			view.height( value );
			this._resize();
		},

		fullScreen: function ( value ) {
			var view = this.element,
				option = this.options,
				control = view.parent( ".ui-multimediaview-wrap" ).find( ".ui-multimediaview-control" ),
				fullscreenButton = control.find( ".ui-fullscreenbutton" ),
				currentPage = $( ".ui-page-active" );

			if ( arguments.length === 0 ) {
				return option.fullScreen;
			}

			view.parents( ".ui-scrollview-clip" ).scrollview( "scrollTo", 0, 0 );

			this.options.fullScreen = value;
			if ( value ) {
				currentPage.children( ".ui-header" ).hide();
				currentPage.children( ".ui-footer" ).hide();
				view.parents().addClass( "ui-fullscreen-parents" );
				this._fitContentArea( currentPage );
				fullscreenButton.removeClass( "ui-fullscreen-on" ).addClass( "ui-fullscreen-off" );
			} else {
				currentPage.children( ".ui-header" ).show();
				currentPage.children( ".ui-footer" ).show();
				view.parents().removeClass( "ui-fullscreen-parents" );
				this._fitContentArea( currentPage );
				fullscreenButton.removeClass( "ui-fullscreen-off" ).addClass( "ui-fullscreen-on" );
			}
			this._resize();
		},

		refresh: function () {
			this._resize();
		}
	});

	$( document ).bind( "pagecreate create", function ( e ) {
		$.tizen.multimediaview.prototype.enhanceWithin( e.target );
	});
} ( jQuery, document, window ) );
