/*
 * SceneManager API
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
			curPage = 1;

		function getPage$( selStr ) {

			var page = pageEle$Cache[ selStr ];
			if( !page ) page = $( selStr );

			return page;
		}

		function clearStack() {

			pageStack = [];
		}

		function moveTo( selStr, disablePush ) {

			if( !disablePush ) pageStack.push( "#"+$(".ui-page-active").attr("id") );

			var ele = $( selStr )[0];
			if( ele.beforeChange ) ele.beforeChange();
			if( ele.beforePageInit )
			{
				ele.beforePageInit();
				ele.beforePageInit = false;
			}

			gear.ui.changePage( selStr );

			if( ele.afterChange ) ele.afterChange();
			if( ele.afterPageInit )
			{
				ele.afterPageInit();
				ele.afterPageInit = false;
			}
		}

		function deviceEvent( e ) {

			if( e.keyName === "back" )
			{
				if( pageStack.length > 0 )
				{
					moveTo( pageStack.pop() );
				} 
				else
				{
					$("body").html( "The App has been terminated well" );
					tizen.application.getCurrentApplication().exit();
				}
			}
			else if( e.keyName === "menu" )
			{
				console.log( "menu event!!" );
			}
		}

		function back() {
			deviceEvent({ keyName: "back" });
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
			back: back
		};
	}())
});
