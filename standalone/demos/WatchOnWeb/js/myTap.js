/*!
 * tap.js
 * Copyright (c) 2013 Alex Gibson, http://alxgbsn.co.uk/
 * Released under MIT license
 */

(function (window, document) {

    'use strict';

    function MyTap( el, data ) {
        el = typeof el === 'object' ? el : document.getElementById(el);
        this.element = el;
        this.moved = false; //flags if the finger has moved
        this.startX = 0; //starting x coordinate
        this.startY = 0; //starting y coordinate
        this.hasTouchEventOccured = false; //flag touch event

		// target대신 다른놈을 hover하고 싶을때 그 맵. "bgBtnImg" : "buttonBox"
		this.idToNodeLinkMap = data.idToNodeLinkMap || [];
		this.minPressTime = data.minPressTime || 0;
		this.enableHover = data.enableHover || false;
        this.startTime = 0;
		this.curTarget$ = null;
		this.target$Map = {};
		this.idList = data.idList || [];
		this.parentIdList = data.parentIdList || [];
		this.ignoreHoverList = data.ignoreHoverList || [];
		this.thresholdX = data.thresholdX || 20;
		this.thresholdY = data.thresholdY || 20;
		this.enableRepeat = data.enableRepeat || false;
		this.repeatTimer = null;
		this.repeatIdList = data.repeatIdList || [];
		this.enableHoverDelay = data.enableHoverDelay || false;
		this.hoverDelayTime = data.hoverDelayTime || 70;
		this.delayTimer = null;

        el.addEventListener('touchstart', this, false);
//        el.addEventListener('touchmove', this, false);
        el.addEventListener('touchend', this, false);
//        el.addEventListener('touchcancel', this, false);
//        el.addEventListener('click', this, false);
//        el.addEventListener('mousedown', this, false);
//        el.addEventListener('mouseup', this, false);
    }

    MyTap.prototype.removeHover = function( key ) {
		
		var that = this;

		if( key ) {

			setTimeout( function() {
				that.target$Map[ key ].removeClass( "hover" );
			}, 40);

		} else {

			if( this.target$Map ) {

				setTimeout( function() {
					for( var tar in that.target$Map ) {
						that.target$Map[ tar ].removeClass( "hover" );
					}
				}, 40);
			}
		}
	};

    MyTap.prototype.removeHoverForMinTime = function( key ) {

		var pressedTime = this.endTime - this.startTime,
			that = this;

		if( this.minPressTime > pressedTime ) {
			
			setTimeout( function() {
				that.target$Map[ key ].removeClass( "hover" );
//				that.curTarget$.removeClass( "hover" );
			}, ((this.minPressTime - pressedTime) < 100) ? 100 : this.minPressTime - pressedTime );

		} else {

			setTimeout( function() {
				that.target$Map[ key ].removeClass( "hover" );
			}, 100 );

		}
	};

    MyTap.prototype.start = function ( e ) {
//		console.log("touchstart");

        this.element.removeEventListener('click', this, false);
        this.element.addEventListener('click', this, false);

		if( this.isIgnoreTarget( e.target.id ) || 
			!( this.isHoverableTarget(e.target.id) || 
				this.isHoverableTarget(e.target.parentNode.id)) ) {

			this.element.removeEventListener('click', this, false);

			console.log( "click: " + e.target.id + " : ,so this prevent click!)");
//			e.preventDefault();
//			e.stopPropagation();

			this.moved = true;
			return;
		}

		var that = this;

		if( this.enableRepeat && this.isRepeatTarget( e.target.id ))
		{
			var maxRepeatCount = 20,
				count = 0;

			this.repeatTimer = setInterval( function() {

				if( count++ > maxRepeatCount )
				{
					clearInterval( that.repeatTimer );
				}

				var evt = document.createEvent('Event');
				evt.initEvent('mytap', true, true );
				evt.targetKey = this.targetKey;
				evt.repeat = true;

				if( count === 1 ) {
					evt.repeatStart = true;
				}
				e.target.dispatchEvent ( evt );

			}, 300 );
		}

		var el = this.element;
		el.removeEventListener('touchmove', this, false);
		el.addEventListener('touchmove', this, false);

        if (e.type === 'touchstart') {
            this.hasTouchEventOccured = true;
        }
		this.startTime = e.timeStamp;
        this.moved = false;
        this.startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        this.startY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;

		if( this.isHoverableTarget(e.target.id) || this.isHoverableTarget(e.target.parentNode.id )) {

			var node = this.idToNodeLinkMap[ e.target.id ];
			if( node ) {
				this.curTarget$ = $( node );
			} else {
				this.curTarget$ = $( e.target );
			}

			this.key = this.startTime;
			this.target$Map[ this.startTime ] = this.curTarget$;

			if( this.enableHoverDelay ) {
				this.delayTimer = setTimeout( function() {

					that.delayTimer = null;
					if( !that.moved ) that.curTarget$.addClass( "hover" );

				}, this.hoverDelayTime );
			} else {
				that.curTarget$.addClass( "hover" );
			}

		} else {
			this.moved = true;
			return;
		}

    };

    MyTap.prototype.isIgnoreTarget = function ( id ) {

		if( this.ignoreHoverList.lastIndexOf( id ) > -1 ) {
			return true;
		} else {
			return false;
		}
	};

    MyTap.prototype.isRepeatTarget = function ( id ) {

		if( this.repeatIdList.lastIndexOf( id ) > -1 ) {
			return true;
		} else {
			return false;
		}
	};

    MyTap.prototype.isHoverableTarget = function ( id ) {

		if( this.idList.lastIndexOf( id ) > -1 ) {
			return true;
		} else if( this.parentIdList.lastIndexOf( id ) > -1 ) {
			return true;
		} else {
			return false;
		}
	};


    MyTap.prototype.move = function (e) {

        //if finger moves more than 10px flag to cancel
        if (Math.abs(e.touches[0].clientX - this.startX) > this.thresholdX || 
				Math.abs(e.touches[0].clientY - this.startY) > this.thresholdY) {

            this.moved = true;
			this.removeHover( this.key );
			this.element.removeEventListener('touchmove', this, false);
			if( this.enableRepeat )
			{
				clearInterval( this.repeatTimer );
			}
        }
    };

    MyTap.prototype.end = function (e) {
//		console.log("touchend");

		if( this.enableRepeat )
		{
			clearInterval( this.repeatTimer );
		}

        if ( Math.abs( e.changedTouches[0].clientX - this.startX ) > this.thresholdX || 
			Math.abs( e.changedTouches[0].clientY - this.startY ) > this.thresholdY) 
		{
			this.moved = true;
			this.removeHover( this.key );
			this.element.removeEventListener('click', this, false);
		}

        if (!this.moved) {
			this.endTime = e.timeStamp;
			this.removeHoverForMinTime( this.key );
        }
    };
	MyTap.prototype.click = function (e) {
		console.log( "click" );
		var that = this;

		if( this.delayTimer ) {
			clearTimeout( this.delayTimer );

			if( !that.moved ) {
				that.curTarget$.addClass( "hover" );

				var key = this.key;
				that.removeHoverForMinTime( key );
			}
		}

		var evt = document.createEvent('Event');
		evt.initEvent('mytap', true, true );
		evt.targetKey = this.targetKey;
//		console.log( "mytap" );
		e.target.dispatchEvent( evt, { targetKey: this.key });

		this.hasTouchEventOccured = false;
		return;
	};

    MyTap.prototype.cancel = function (e) {
        this.hasTouchEventOccured = false;
        this.moved = false;
        this.startX = 0;
        this.startY = 0;
    };

    MyTap.prototype.destroy = function () {
        var el = this.element;
        el.removeEventListener('touchstart', this, false);
        el.removeEventListener('touchmove', this, false);
        el.removeEventListener('touchend', this, false);
//        el.removeEventListener('touchcancel', this, false);
        el.removeEventListener('click', this, false);
//        el.removeEventListener('mousedown', this, false);
//        el.removeEventListener('mouseup', this, false);
        this.element = null;
    };

    MyTap.prototype.handleEvent = function (e) {
        switch (e.type) {
        case 'touchstart': this.start(e); break;
        case 'touchmove': this.move(e); break;
        case 'touchend': this.end(e); break;
//        case 'touchcancel': this.cancel(e); break;
        case 'click': this.click(e); break;
//        case 'mousedown': this.start(e); break;
//        case 'mouseup': this.end(e); break;
        }
    };

    window.MyTap = MyTap;

}( window, document ));
