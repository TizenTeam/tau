/*
 * SceneManager Module
 *
 * There are public APIs in last part of the file
 *
 * 2014.02.05
 *
 */

define({

	name: "SceneManager",
	def: ( function () {

		var pageStack = [],
			pageEle$Cache = {},
			curPage$ = $(".ui-active-page").length > 0 ? $(".ui-active-page") : $("#main");

		function setCurPage$( p ) {
			curPage$ = p;
		}
		function getPage$( selStr ) {

			var page = pageEle$Cache[ selStr ];
			if( !page ) page = $( selStr );

			return page;
		}

		function clearStack() {

			pageStack = [];
		}

		function moveTo( selStr, option ) {

			if( !option || !(option.disablePush) )
			{
				var id = "#"+$(".ui-page-active").attr("id");
				if( !id )
				{
					console.error( "Id is not valid" );
					return;
				}
				pageStack.push( "#"+$(".ui-page-active").attr("id") );
			}

			var ele = $( selStr )[0];

			if( $( selStr ).length < 1 )
			{
				console.error( "Can not find page from: '" + selStr + "'");
				return;
			}
			if( ele.beforeChange ){
				ele.beforeChange();
			}
			
			if( ele.beforePageInit )
			{
				ele.beforePageInit();
				ele.beforePageInit = false;
			}			

			if( option && option.transition )
			{
				var transFunc = pageTransition[ option.transition ]; 

				if( transFunc )
				{
					transFunc( selStr );
				}
				else
				{
					realMoveTo( selStr );
				}

				/*
				// 타이젠에서 제공해주는 코드. 후지다.
				gear.ui.defaults.pageTransition = "slideup";
				gear.ui.changePage( selStr );
				gear.ui.defaults.pageTransition = "none";
				*/
			}
			else
			{
				realMoveTo( selStr );
			}

			if( ele.afterChange )
			{
				console.log("ele.afterChange");
				ele.afterChange();
			}
			
			if( ele.afterPageInit )
			{
				console.log("ele.afterPageInit");
				ele.afterPageInit();
				ele.afterPageInit = false;
			}
		}

		var pageTransition = {};
		pageTransition.slideup = function( selStr, time ) {

			var ele$ = $( selStr ),
				timeMilli = time || 500;

			curPage$.css({
				"-webkit-transition": "all "+timeMilli+"ms",
				"display": "block",
				"z-index": 1000,
				"opacity": 1
			});

			ele$.css({ 
				"-webkit-transition": "all "+timeMilli+"ms",
				"-webkit-transform": "translate3d( 0, 320px ,0)",
				"display": "block",
				"z-index": 1001
			});

				realMoveTo( selStr );

			setTimeout( function() {
				ele$.css({ "-webkit-transform": "translate3d( 0, 0px ,0)", });
				curPage$.css({ "opacity": 1 });
			}, 0 );

			setTimeout( function() {
				curPage$.css({
					"display": "",
					"z-index": ""
				});
				ele$.css({ 
					"-webkit-transition": "",
					"-webkit-transform": "translate3d( 0,0,0)",
					"display": "",
					"z-index": ""
				});
			}, timeMilli );
		};

		function deviceEvent( e ) {

			if( e.keyName === "back" )
			{
				back({ disableBackEvent: false });
			}
			else if( e.keyName === "menu" )
			{
				console.log( "menu event!!" );
			}
		}

		function realMoveTo( selStr ) {
			
//			setTimeout( function()  {
				var ele$ = $( selStr );

//				curPage$.removeClass("ui-page-active");
//				ele$.addClass("ui-page-active");
				curPage$ = ele$;
				gear.ui.changePage( ele$[0] );

//			}, 0 );
		}

		function back( data ) {

			data = data || {};
			// deviceEvent({ keyName: "back" });
			
			if( !data.disableBackEvent && typeof curPage$[0].backEvent === "function" )
			{
				curPage$[0].backEvent();
				return;
			}

			if( pageStack.length > 0 )
			{
//				moveTo( pageStack.pop(), { disablePush: true } );
				var pop = pageStack.pop();
				if( $( pop )[0].beforeComeBack ) $( pop )[0].beforeComeBack();
				
				realMoveTo( pop );
			} 
			else
			{					
//				$("body").html( "The App has been terminated well" );
//				tizen.application.getCurrentApplication().exit();
				console.log( "The App has been hide well" );
				tizen.application.getCurrentApplication().hide();
			}
		}

		function pushPage( selStr ) {
			pageStack.push( selStr );
		}

		// public APIs
		return {
			getPage$: getPage$,
			moveTo: moveTo,
			clearStack : clearStack,
			pushPage : pushPage,
			deviceEvent: deviceEvent,
			back: back,
			setCurPage$: setCurPage$
		};


	}())
});
