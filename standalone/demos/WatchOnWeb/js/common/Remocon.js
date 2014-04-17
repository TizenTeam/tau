/*
 * RemoconSet Class
 * Remocon Class
 * 
 * 의존성 모듈이 있으면 반드시 def: function () { return 넘겨줄꺼 } 형태.
 */

define({

	requires: [ "STMS" ],
	name: "RemoconSet",

	def: function ( m ) {

//		var UEI = m.UEI;
		var STMS = m.STMS;
		var count = 0;
		var RemoconSet;

		RemoconSet = function( data ) {

			var type = (data && data.type) ? data.type : "unnamed setType",
				id = "",
				remoconList = [],
				name = (data && data.type) ? data.type : "unnamed",
				curRemocon = null;

			// getTime() 으로하면 같은 아이디가 나올 확률이 있기 때문에 count를 더해
			id = (data && data.id) ? data.id : "s"+(new Date()).getTime() + (++count);

			this.getType = function() { return type; };
			this.getRemoconArr = function() { return remoconList; };
			this.getId = function() { return id; };
			this.getName = function() { return name; };
			this.getCurRemocon = function() { return curRemocon; };

			this.setType = function( p ) { 
				type = p; 
				name = p;
				RemoconSet.saveToLs();
			};
			this.setCurRemocon = function( p ) { curRemocon = p; };

			RemoconSet.remoconSetList.push( this );
			RemoconSet.remoconSetObjs[ id ] = this;
			RemoconSet.saveToLs();
		};

		// 스태틱
		RemoconSet.remoconSetList = [];
		RemoconSet.remoconSetObjs = {};

		RemoconSet.clear = function()
		{
			var list = RemoconSet.remoconSetList,
				length = list.length;
			
			for( var i=0, rs; rs = list[ i ]; i++ )
			{
				rs.removeItSelf();
			}
		}
		RemoconSet.saveToLs = function()
		{
			var tmpArr = [];
			for( var i=0, set; set = RemoconSet.remoconSetList[ i ]; i++)
			{
				tmpArr.push( set.getObjData() );
			}
//			UEI.saveStrToFile( "RemoconSet", JSON.stringify( tmpArr ) );
			localStorage[ 'RemoconSet' ] = JSON.stringify( tmpArr );
		};
		RemoconSet.prototype.getLiStr = function()
		{
			console.log( "set getlistr ");
//			return "<li id='"+this.getId()+"'>["+this.getType()+"] "+this.getName()+"</li>";
			var name = "";
			var deviceId= "";

			if( this.getType() === "STB" ) {
				name = "TV and STB";
				deviceId = "IDS_YSM_HEADER_TV_AND_STB_ABB";
			}
			else if( this.getType() === "AIR" ) {
				name = "Air conditioner";
				deviceId = "IDS_SR_BODY_AIR_CONDITIONER";
			}
			else {
				name = this.getType();
				deviceId = "IDS_SR_BUTTON_TV";
			}

			var domStr = "";
			domStr += "<li id='"+this.getId()+"'>";
			domStr += "<input type='radio' name='radioset' id='"+this.getId()+"' />";
			domStr += "<label for='"+this.getId()+"' class='ui-popup-radio-label STMS' data-stmsid='"+deviceId+"'>";
			domStr += STMS.getStrById(deviceId)+"</label>";
			domStr += "</li>";
			return domStr;
		};
		RemoconSet.prototype.getRemoconByType = function( type )
		{
			var rList = this.getRemoconArr();

			for( var i=0, rm; rm = rList[ i ]; i ++ )
			{
				if( rm.getType() === type ) return rm;
			}
			console.error( "Can not find remocon by type: " + type );
			return false;
		};
		RemoconSet.prototype.getObjData = function()
		{
			var tmp = {
				type: this.getType(),
				id: this.getId(),
				name: this.getName(),
			};

			return JSON.stringify( tmp );
		}

		RemoconSet.prototype.addRemocon = function( remocon )
		{
			remocon.setSetId( this.getId() );
			remocon.setSet( this );
			this.getRemoconArr().push( remocon );
			this.setCurRemocon = remocon;
		}

		RemoconSet.prototype.removeItSelf = function()
		{
			var rList = this.getRemoconArr();

			for( var i = rList.length-1; i > -1; i-- )
			{
				rList[i].removeItSelf();
			}

			var idx = RemoconSet.remoconSetList.lastIndexOf( this );
			RemoconSet.remoconSetList.splice( idx, 1 );
			delete RemoconSet.remoconSetObjs[ this.getId() ];
			delete this;

			RemoconSet.saveToLs();
		}

		window.S = RemoconSet;
		return RemoconSet;
	}
});

define({

	requires: [ "STMS" ],
	name: "Remocon",
	def: function ( m ) {

//		var UEI = m.UEI;
		var STMS = m.STMS;
		var count = 0;
		var Remocon;

		Remocon = function( data ) {

			'use strict'

			// 비공개 함수 & 변수
			var type = data.type,
				brandName = data.brandName,
				model = data.model,
				codeSet = data.codeSet,
				setId = data.setId || 0,
				set = data.set || null,
				signalSet = data.signalSet || {},
				keyList = data.keyList || [],
				id = "";
			
			// getTime() 으로하면 같은 아이디가 나올 확률이 있기 때문에
			// TV: t, STB:b, air:a

			var typeInitial = "";

			if( type === "TV" ) typeInitial = "t";
			else if( type === "STB" ) typeInitial = "b";
			else if( type === "AIR" ) typeInitial = "a";
			else console.error( "Error: typeInitial" );

			id = data.id || typeInitial + ( new Date() ).getTime() + (++count);

			this.getId = function() { return id; };
			this.getType = function() { return type; };
			this.getBrandName = function() { return brandName; };
			this.getModel = function() { return model; };
			this.getCodeSet = function() { return codeSet; };
			this.getSetId = function() { return setId; };
			this.getSet = function() { return set; };
			this.getKeyList = function() { return keyList; };

			this.setSetId = function( p ) { 
				setId = p;
				Remocon.saveToLs();
			};
			this.setSet = function( p ) { set = p; };
			this.setSignalSet = function( p ) { 
				console.log( p );
				signalSet = p;
			};

			this.getSignalByKey = function( key )
			{
				console.log( "getSignalByKey( " + key +")");
				console.log( "return" + signalSet[ key ]+")");

				return signalSet[ key ];
			};

			Remocon.remoconList.push( this );
			Remocon.remoconObjs[ this.getId() ] = this;
			Remocon.saveToLs();
		};

		// 스태틱 멤버
		Remocon.remoconList = [];
		Remocon.remoconObjs = {};
		Remocon.remoconChangedCb = null;
		Remocon.setRemoconChangedCb = function( callback )
		{
			Remocon.remoconChangedCb = callback;
		}


		Remocon.clear = function()
		{
			var list = Remocon.remoconList,
				length = list.length;
			
			for( var i=0, rm; rm = list[ i ]; i++ )
			{
				rm.removeItSelf();
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
				id: this.getId(),
				setId: this.getSetId()
			};

			if( this.getKeyList() )
			{
				tmp.keyList = this.getKeyList();
			}
			else
			{
				tmp.keyList = "";
			}

			return JSON.stringify( tmp );
		};

		Remocon.saveToLs = function() 
		{
			var tmpArr = [];
			for( var i=0, remo; remo = Remocon.remoconList[ i ]; i++)
			{
				tmpArr.push( remo.getObjData() );
			}
//			UEI.saveStrToFile( "Remocon", JSON.stringify( tmpArr ) );
			localStorage[ 'Remocon' ] = JSON.stringify( tmpArr );
		}

		Remocon.prototype.getLiStr = function()
		{
//			return "<li id='"+this.getId()+"'>["+this.getType()+"] "+this.getBrandName()+"</li>";
			var name = "";
			var deviceId = "";

			if( this.getType() === "STB" ) {
				name = "TV and STB";
				deviceId = "IDS_YSM_HEADER_TV_AND_STB_ABB";
			}
			else if( this.getType() === "AIR" ) {
				name = "Air conditioner";
				deviceId = "IDS_SR_BODY_AIR_CONDITIONER";
			}
			else {
				name = this.getType();
				deviceId = "IDS_SR_BUTTON_TV";
			}

			var domStr = "";
			domStr += "<li id='"+this.getId()+"'>";
			domStr += "<input type='radio' name='radioset' id='"+this.getId()+"' />";
			domStr += "<label for='"+this.getId()+"' class='ui-popup-radio-label STMS' data-stmsid='"+deviceId+"'>";
			domStr += STMS.getStrById(deviceId)+"</label>";
			domStr += "</li>";
			return domStr;
		};

		Remocon.prototype.removeItSelf = function()
		{
			var remoconList = Remocon.remoconList,
				remoconObjs = Remocon.remoconObjs,
				id = this.getId();

			var rs = this.getSet();
			var listOfSet = rs.getRemoconArr();
			listOfSet.splice( listOfSet.lastIndexOf( this ), 1 );

			var idx = remoconList.lastIndexOf( this );
			remoconList.splice( idx, 1 );

			delete remoconObjs[ id ];
			delete this;

			Remocon.saveToLs();

		};

		Remocon.prototype.createRemoteDiv = function( parentNodeId ) 
		{
			var remotePage = parentNodeId ? 
					document.getElementById( parentNodeId ) : document.getElementById( "remotePage" ),

				hiddenPage = document.getElementById( "hiddenPage" ),
				scroller = document.getElementById( "scroller" ),
				titleStmsIdMap = {
					TV: "IDS_SR_BUTTON_TV",
					STB: "IDS_YSM_HEADER_TV_AND_STB_ABB",
					AIR: "IDS_SR_BODY_AIR_CONDITIONER"
				},
				type = this.getType();

			console.log("RemoconType:" + this.getType());

			var clone = null,
				chKeypad = null;

			for( var i=0, child; child = hiddenPage.children[ i ]; i++ )
			{
				if( child.id === type )
				{
					clone = child;
				}
				if( child.id === "chKeypad" )
				{
					chKeypad = child;
				}
			}
			var child2 = null;
			for( i=0; child2= scroller.children[ i ]; i++ )
			{
				if( child2.id === type )
				{
					clone = child2;
				}
				if( child2.id === "chKeypad" )
				{
					chKeypad = child2;
				}
			}

			if( !(clone && chKeypad) ) {
				console.error( "Can not make clone" );
				return;
			}

			var child3 = null,
				length = scroller.children.length;

			if( length > 0 )
			{
				for( i=length-1; child3 = scroller.children[ i ]; i--)
				{
					console.log( child3 );
					hiddenPage.appendChild( child3 );
				}
			}
			
			console.log( type );
			console.log( remotePage.getElementsByClassName( "ui-title" )[0] );
			STMS.stmsHtml( remotePage.getElementsByClassName( "ui-title" )[0], titleStmsIdMap[type]);

			
			var keyLi = clone.getElementsByClassName( "rBtn");
			var keyLen = keyLi.length, i = 0, btn;
			
			var keyList = this.getKeyList();
			
			console.log( keyLen );
			
			
			if( type === "AIR" ) {
				var result = -1;
				if( keyLen > 0 ) {
					for( i = keyLen-1; btn = keyLi[i]; i-- ) {
						console.log( btn );
						result = keyList.indexOf( btn.dataset.key );
						console.log( btn.dataset.key );
						console.log( result );
						if( btn.dataset.key === "10" ) continue;					
						if( result < 0 ) {
							btn.classList.add( "disable" );
						} else { 
							btn.classList.remove( "disable" );
						}
						
					}
				}
			}
			
			scroller.appendChild( clone );

			if( type === "TV" )
			{
				scroller.appendChild( chKeypad );
			}
			else if( type === "STB" )
			{
				scroller.appendChild( chKeypad );
			}
			else if( type === "AIR" )
			{
				//
			}
			else
			{
				console.error( "Unknown type: '"+type+"'" );
			}

			WR.curRemocon = this;

//			UEI.saveStrToFile( "lastUseRemoconId", this.getId() );
			localStorage[ 'lastUseRemoconId' ] = this.getId();

			if( Remocon.remoconChangedCb )
				Remocon.remoconChangedCb( this );

			return this;
		}

		window.R = Remocon;
		return Remocon;
	}
});
