( function ( ) {

	var cultureInfo = {
			messages: {
				"hello" : "hello",
				"translate" : "translate"
			}
		},
		supportLang = [ "en", "en-US" ],
		i, lang;

	for ( i in supportLang ) {
		lang = supportLang[ i ];
		Globalize.addCultureInfo( lang, cultureInfo );
	}

} ) ( );
