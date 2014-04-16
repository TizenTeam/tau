/*
 * IndicatorTab Class
 */

define({

	name: "IndicatorTab",
	def: (function () {

		var IndicatorTab;

		IndicatorTab = function( targetId ) {

			var length = 0,
				ele = document.createElement("div"),
				target = document.getElementById( targetId ) || document.getElementById( "scroller" );

			this.getEle = function() { return ele; };
			this.getTarget = function() { return target; };
			this.getLength = function() { return length; };

			this.setLength = function( p ) { length = p; };

			this.refresh();
			this.setSection( 0 );

//			target$.parent().before( ele$ );
			target.parentNode.insertAdjacentElement( "beforebegin", ele )
		};

		IndicatorTab.widthTable = [
			[ 320 ],
			[ 320 ],
			[ 160, 160 ],
			[ 107, 106, 107 ],
			[ 80, 80, 80, 80 ],
			[ 64, 64, 64, 64, 64 ],
			[ 54, 53, 53, 53, 53, 54 ]
		];

		// 공개 메서드
		IndicatorTab.prototype.setSection = function( p )
		{
			var childrens = this.getEle().children;
			
			if( childrens && childrens.length > 1 )
			{
				for( var key in childrens )
				{
					childrens[ key ].className = "eachBar";
				}

				if( p < childrens.length )
					childrens[ p ].className = "eachBar active";
			}
		};

		IndicatorTab.prototype.refresh = function()
		{
			console.log( "indicator refresh");

			var	ele = this.getEle(),
				length = this.getTarget().children.length,
				domStr = "";

			console.log( length );
			this.setLength( length );

			if( length < 2 )
			{
				ele.className = "indicatorTab none";
			}
			else
			{
				console.log(" length > 1 ");
				var width = 0;
				for( var i=0; i < length; i++)
				{
					width = IndicatorTab.widthTable[ length ][ i ];
					domStr += "<div class='eachBar' style='width: "+width+"px'></div>";
				}

				ele.innerHTML = domStr;
				ele.className = "indicatorTab";
			}
		};
		return IndicatorTab;

	}())
});
