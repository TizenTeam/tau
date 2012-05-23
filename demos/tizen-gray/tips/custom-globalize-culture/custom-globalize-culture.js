( function ( $ ) {
	var customCultureFiles = {
			"en" : "en.js",
			"fr" : "fr.js"
		},
		lang,
		content = $( '#page-tips-custom-globalize-culture > :jqmData(role="content")' );
	S.loadCustomGlobalizeCulture( customCultureFiles );
	lang = Globalize.culture( ).name;
	content.append( $( '<div></div>' )
		.text( "This is a text from custom globalize culture file (key:hello): " + Globalize.localize( 'hello' ) ) );
	content.append(
		$( '<div></div>' )
		.text( "Current lang: " + lang  + ", Custom culture file: " + customCultureFiles[lang] ) );
	content.trigger( "refresh" );
} ) ( jQuery );
