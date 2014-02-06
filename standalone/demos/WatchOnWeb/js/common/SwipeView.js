/*
 * SwipeView Class
 */


define({

	name: "SwipeView",
	def: (function () {

		var SwipeView;

		SwipeView = function( selStr ) {

			if( !selStr ) {
				console.error( "EleId must be inputed" );
				return null;
			}

			this.init( selStr );
			this.update();
			this.bindEvent();
		};

		SwipeView.prototype = ( function () {

			// 비공개 함수 & 변수
			var ele$ = null,
				ele = null,
				curPage = 0,
				length = 0;

			// 공개 메서드
			return {

				getEle$: function() { return ele$; },
				getEle: function() { return ele; },
				getCurPage: function() { return curPage; },
				getLength: function() { return length; },

				setLength: function( p ) { length = p; },
				setCurPage: function( p ) { curPage = p; },

				init: function( selStr ) { 
					ele$ = $( selStr );
					ele = ele$[0];
					curPage = 0;
					length = 0;
				}
			};

		}());

		// 공개 메서드
		SwipeView.prototype.update = function()
		{
			var ele$ = this.getEle$(),
				childs = ele$.children();

			this.setLength( childs.length );

			$.each( childs, function( i,t ) {
				$( t ).css({ left: i*320 + "px" });
			});

		};

		SwipeView.prototype.bindEvent = function()
		{
			var swipeEle$ = this.getEle$();
			var swipeEle = this.getEle();
			var startX = 0, startY = 0, startCurPage = 0, that = this;

			swipeEle$.on('swipeleft', function(e) {

				console.log("left");
				that.move( 1 );

			}).on('swiperight', function(e) {

				console.log("right");
				that.move( -1 );

			});

			var doingSwipe = false;

			/*
			swipeEle$.on('movestart', function(e) {
					// If the movestart is heading off in an upwards or downwards
					// direction, prevent it so that the browser scrolls normally.
				if ((e.distX > e.distY && e.distX < -e.distY) ||
					(e.distX < e.distY && e.distX > -e.distY)) {
					e.preventDefault();
				}
			});
			*/

			swipeEle.addEventListener( "touchstart", function(e) {
				startX = e.touches[0].clientX;
//				startY = e.touches[0].clientY;
				startCurPage = that.getCurPage();
			});

			swipeEle.addEventListener("touchmove", function(e) {

				var curX = e.touches[0].clientX,
//					curY = e.touches[0].clientY,
					length = that.getLength();

			//	이거 풀면 swipe 이벤트 안먹어
//				e.stopPropagation();
				e.preventDefault();

				var changeX = curX-startX;
				var changeXP = (( curX-startX ) / 320 ) * 100;

				if( !doingSwipe && Math.abs( changeX ) < 30 ) {
					return;
				}
				doingSwipe = true;

				newXP = changeXP - (startCurPage * 100);

				var threshold = ( length - 1 ) * -100;

				if( newXP < threshold ) {
					newXP = threshold;
				} else if( newXP > 0 ) {
					newXP = 0;
				}

				swipeEle$.css({ 
					"-webkit-transform": "translate3d("+ newXP+"%,0,0 )"
				});

			}, false);

			swipeEle.addEventListener("touchend", function( e ) {
				
				doingSwipe = false;
				swipeEle$.css({ transition: "all 0.3s" });
				swipeEle$.css({ "-webkit-transform": "translate3d("+(startCurPage*-100)+"%,0,0 )" });
				setTimeout( function() { swipeEle$.css({ transition: "" }); }, 300);
			});
		};

		SwipeView.prototype.moveTo = function( p )
		{
			var ele$ = this.getEle$(),
				length = ele$.children().length,
				cur = this.getCurPage(),
				newCur = p,
				curEle$ = ele$.children().eq( cur );

			if( newCur < length && newCur > -1 )
			{
				this.setCurPage( newCur );

				var newCenterEle$ = ele$.children().eq( newCur );
				newCenterEle$.addClass( "center" );
				newCenterEle$.removeClass( "left" );
				newCenterEle$.removeClass( "right" );

				curEle$.removeClass( "center" );
				var newSide = null;
				if( p > 0 )
				{
					curEle$.addClass( "left" );
					newSide$ = newCenterEle$.next();
					if( newSide$.length > 0 ) newSide$.addClass("right");
				}
				else
				{
					curEle$.addClass( "right" );
					newSide$ = newCenterEle$.prev();
					if( newSide$.length > 0 ) newSide$.addClass("left");
				}

				ele$.css({ transition: "all 0.3s" });
				ele$.css({ "-webkit-transform": "translate3d("+(newCur * -100)+"%,0,0 )" });
				setTimeout( function() { ele$.css({ transition: "" }); }, 300 );
			}


		};

		SwipeView.prototype.move = function( p )
		{
			var ele$ = this.getEle$(),
				length = ele$.children().length,
				cur = this.getCurPage(),
				newCur = cur + p,
				curEle$ = ele$.children().eq( cur );

			if( newCur < length && newCur > -1 )
			{
				this.setCurPage( newCur );

				var newCenterEle$ = ele$.children().eq( newCur );
				newCenterEle$.addClass( "center" );
				newCenterEle$.removeClass( "left" );
				newCenterEle$.removeClass( "right" );

				curEle$.removeClass( "center" );
				var newSide = null;
				if( p > 0 )
				{
					curEle$.addClass( "left" );
					newSide$ = newCenterEle$.next();
					if( newSide$.length > 0 ) newSide$.addClass("right");
				}
				else
				{
					curEle$.addClass( "right" );
					newSide$ = newCenterEle$.prev();
					if( newSide$.length > 0 ) newSide$.addClass("left");
				}

				ele$.css({ transition: "all 0.3s" });
				ele$.css({ "-webkit-transform": "translate3d("+(newCur * -100)+"%,0,0 )" });
				setTimeout( function() { ele$.css({ transition: "" }); }, 300 );
			}
		};

		return SwipeView;

	}())
});
