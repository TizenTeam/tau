function RepaintMonitor() {
	this.used = 0;
	this.notify = function ( event ) {
		if ( event.type == "Paint" ) {
			this.used += event.data.width * event.data.height;
			console.log( "Repainted Area: " + this.used );
		}
	};
};
