Favorite = {
	LIST_KEY: "arf_list_key",

	_inMemoryList: undefined,
	
	create: function() {
		this._load();
	},

	store: function() {
		var saveString = JSON.stringify( this._inMemoryList );
		if ( window.localStorage ) {
			window.localStorage.setItem( this.LIST_KEY, saveString );
		} else {
			alert('Not Supported');
		}
	},

	_load: function() {
		if ( window.localStorage ) {
			var savedString = window.localStorage.getItem( this.LIST_KEY );
			if ( savedString ) {
				this._inMemoryList = JSON.parse( savedString );		
			} else {
				this._inMemoryList = new Array();
			}
		} else {
			alert('Not Supported');
		}
	},

	remove: function() {
		for( var i = 0; i < arguments.length; i++ ) {
			if ( this.isAlreadyStored( arguments[i] ) ) {
				if ( window.localStorage ) {
					window.localStorage.removeItem( arguments[i] );
					this._inMemoryList.splice( this._inMemoryList.indexOf( arguments[i] ), 1 );
					console.log( arguments[i] + " deleted" );
				} else {
					alert('error');
				}	
			} 
		}
		this.store();
	},
	
	add: function( key, jsonStringifiedObject ) {
		if ( !this.isAlreadyStored( key ) ) {
			if ( window.localStorage ) {
				window.localStorage.setItem( key, jsonStringifiedObject );
				this._inMemoryList.push( key );
			} else {
				alert('error');
			}
		}
		this.store();
	},

	getWholeList: function() {
		var list = new Array();
		for( var i = 0; i < this._inMemoryList.length; i++ ) {
			list.push( JSON.parse( this.get( this._inMemoryList[i] ) ) );
		}		
		return list;
	},

	get: function( key ) {
		if ( this.isAlreadyStored( key ) ) {
			return window.localStorage.getItem( key );
		} else {
			return undefined;
		}
	},

	isAlreadyStored: function( key ) {
		return $.inArray( key, this._inMemoryList ) > -1;
	}
}
