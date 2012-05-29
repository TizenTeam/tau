( function ( ) {
	console.log("en.js runs !!!!!!!!!");

	var cultureInfo = {
			messages: {
				"hello" : "hello",
				"translate" : "translate"
			}
		},
		supportLang = { "en", "en-US" };

	for ( var lang in supportLang ) {
		Globalize.addCultureInfo( lang, cultureInfo );
	}
} ) ( );
