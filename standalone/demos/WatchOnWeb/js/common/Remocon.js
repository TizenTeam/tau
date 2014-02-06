/*
 * RemoconSet Class
 * Remocon Class
 * 
 * 의존성 모듈이 있으면 반드시 def: function () { return 넘겨줄꺼 } 형태.
 */

define({

	name: "RemoconSet",

	def: (function () {

		var count = 0;
		var RemoconSet;

		RemoconSet = function() {

			var type = "unnamed setType",
				remoconList = [],
				remoconSetId = (new Date()).getTime();

			this.getType = function() { return type; };
			this.getRemoconArr = function() { return remoconList; };
			this.getRemoconSetId = function() { return remoconSetId; };

			RemoconSet.remoconSetList.push( this );
			RemoconSet.remoconSetObjs[ remoconSetId ] = this;
		};

		RemoconSet.remoconSetList = [];
		RemoconSet.remoconSetObjs = {}

		RemoconSet.prototype.addRemocon = function( remocon )
		{
			remocon.setParentId( this.getRemoconSetId() );
			this.getRemoconArr().push( remocon );
		}
		RemoconSet.prototype.saveToLocalStorage = function()
		{
			// remoconSet이라는 로컬 스토리지에 저장하자 
		}

		RemoconSet.prototype.getLiStr = function()
		{
			return "<li id='"+this.getRemoconSetId()+"'>["+this.getType()+"] "+this.getBrandName()+"</li>";
		}

		RemoconSet.prototype.removeItSelf = function()
		{
			var remoconList = this.getRemoconArr();

			for( var remocon in remoconList ) {
				remocon.removeItSelf();
			}
		}

		return RemoconSet;
	}())
});

define({

	requires: ["RemoconSet"],
	name: "Remocon",
	def: function ( m ) {

		var count = 0;
		var Remocon;

		Remocon = function( data ) {

			// 비공개 함수 & 변수
			var type = data.type;

			if( Remocon.TYPE_LIST.lastIndexOf( type ) < 0 ) {
				console.error( "Can not create remocon instance including unknown remocon type '"+type+"'" );
				// 문법 확인
				delete this;
				return;
			}

			var brandName = data.brandName,
				model = data.model,
				codeSet = data.codeSet,
				parentId = data.parentId || 0,
				remoconId = ( new Date() ).getTime();

			this.getRemoconId = function() { return remoconId; };
			this.getType = function() { return type; };
			this.getBrandName = function() { return brandName; };
			this.getModel = function() { return model; };
			this.getCodeSet = function() { return codeSet; };
			this.getParentId = function() { return parentId; };
			this.setParentId = function( p ) { parentId = p; };

			Remocon.remoconList.push( this );
			Remocon.remoconObjs[ this.getRemoconId() ] = this;
		};

		Remocon.prototype = ( function () {
			// 공개 메서드
			return {


			};

		}());

		// 스태틱 멤버
		//WR.func.createRemoconFromLS = function( m )
		Remocon.TYPE_LIST = ["TV","STB","AIR"];
		Remocon.remoconList = [];
		Remocon.remoconObjs = {};

		Remocon.createRemoconFromLS = function() 
		{
			var RemoconSet = m.RemoconSet,
				typeList = Remocon.TYPE_LIST,
				length = typeList.length,
				tmpMap = {};

			for( var i=0; i < length; i++ )
			{
				var strData = localStorage[ typeList[i] ];

				if( strData && strData !== "undefined" )
				{
					var j=0;
					var objList = JSON.parse( strData );

					for( var j=0, remo; remo = objList[ j ]; j++ ) {
						var remocon = new Remocon( JSON.parse( remo ));
					}

					var id = remocon.getRemoconId(),
						setId = remocon.getParentId(),
						remoconSet = null;
					
					if( tmpMap[ setId ] ) {

						console.log( setId );
						console.log( tmpMap[ setId ]);
						remoconSet = RemoconSet.remoconSetObjs[ tmpMap[ setId ] ];
						
					} else {

						remoconSet = new RemoconSet();
						tmpMap[ setId ] = remoconSet.getRemoconSetId();
					}

					remoconSet.addRemocon( remocon );
					remocon.setParentId( remoconSet.getRemoconSetId() );
				}
			}
		}

		// 공개 메서드
		Remocon.prototype.getObjData = function() 
		{
			var tmp = {
				type: this.getType(),
				brandName: this.getBrandName(),
				model: this.getModel(),
				codeSet: this.getCodeSet(),
				remoconId: this.getRemoconId(),
				parentId: this.getParentId()
			};

			return JSON.stringify( tmp );
		};

		Remocon.saveToLocalStorage = function( type ) 
		{
			// save 라고 생각해도 되고 localstorage refresh 라고 생각해도 되고
			// type을 주면 해당 type만 갱신(저장), 
			// 안주면 모든 리모콘 갱신

			var rList = Remocon.remoconList,
				tmpObj = {};

			if( type )
			{
				for( var i=0, remocon; remocon = rList[ i ]; i++ )
				{
					if( remocon.getType() !== type ) continue;

					if( !tmpObj[ type ] ) {
						console.log( type );
						tmpObj[ type ] = [];
					}

					tmpObj[ type ].push( remocon.getObjData() );
				}

				localStorage[ type ] = JSON.stringify( tmpObj[ type ] );
			}
			else
			{
				for( var i=0, remocon; remocon = rList[ i ]; i++ )
				{
					if( tmpObj[ type ] )
					{
						tmpObj[ type ] = [];
					}

					tmpObj[ type ].push( remocon.getObjData() );
				}

				for( var j=0, t; t = Remocon.TYPE_LIST[ j ]; j++ )
				{
					localStorage[ t ] = JSON.stringify( tmpObj[ t ] );
				}
			}

		}

		Remocon.prototype.saveToLocalStorage = function() 
		{
			// 현재 LS가 TV, STB, AIR 3개 있으므로 하나를 저장할때 마다
			// 그 타입의 LS를 싹 갱신 ( 리모콘이 몇개 안되서 이게 더 빠름 )

			var rList = Remocon.remoconList,
				type = this.getType(),
				tmpArr = [];

			console.log( rList );
			for( var i=0, remocon; remocon = rList[ i ]; i++ )
			{
				if( remocon.getType() === type ) {
					console.log( i +" insert");
					tmpArr.push( remocon.getObjData() );
				}
			}

			localStorage[ type ] = JSON.stringify( tmpArr );
		};

		Remocon.prototype.getLiStr = function()
		{
			return "<li id='"+this.getRemoconId()+"'>["+this.getType()+"] "+this.getBrandName()+"</li>";
		};

		Remocon.prototype.removeItSelf = function()
		{
			var page$ = $( "#remoconManagePage" ),
				list$ = page$.find( "#remoteList" ),
				remoconList = Remocon.remoconList,
				remoconObjs = Remocon.remoconObjs,
				remoconId = this.getRemoconId(),
				type = this.getType();

			list$.find( "#"+remoconId ).remove();

			var idx = remoconList.lastIndexOf( this );
			remoconList.splice( idx, 1 );
			remoconObjs[ remoconId ] = null;

			Remocon.saveToLocalStorage( type );

			if( remoconList.length < 1 )
			{
				// 리모콘이 하나도 없으면 어케?
				lastUseRemoconId = 0;
				return;
			}

			if( lastUseRemoconId === remoconId )
			{
				lastUseRemoconId = 0;
				remoconList[ 0 ].createRemoteDiv( "#remotePage" );
			}
		};

		Remocon.prototype.createRemoteDiv = function( parentNodeSelStr ) 
		{
			var remotePage$ = $( parentNodeSelStr ),
				hiddenPage$ = $( "#hiddenPage" );

			if( this.getType() === "TV" )
			{
				var tv$ = hiddenPage$.children( "#tv-controller" );
				var clone$ = tv$.clone();
				clone$.find( "#header-title" ).html( this.getType() + " " + this.getBrandName() );
				remotePage$.find( ".ui-title" ).html( this.getType() + " " + this.getBrandName() );
				remotePage$.find( ".remocon" ).remove();
				remotePage$.prepend( clone$ );
			}
			else if( this.getType() === "STB" )
			{
				var tv$ = hiddenPage$.children( "#tv-stb-controller" );
				var clone$ = tv$.clone();
				clone$.find( "#header-title" ).html( this.getType() + " " + this.getBrandName() );
				clone$.find( ".ui-title" ).html( this.getType() + " " + this.getBrandName() );
				remotePage$.find( ".this" ).remove();
				remotePage$.prepend( clone$ );
			}
			else
			{
				console.error( "ERROR!" );
			}
		}

		return Remocon;
	}
});



