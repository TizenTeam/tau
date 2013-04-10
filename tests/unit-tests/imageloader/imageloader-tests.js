$( document ).ready( function () {
	var url = "test.png?" + Date.now();
	module("Imageloader");


	asyncTest( "Thumbnail is not in storage", 1, function () {
		$.imageloader.getThumbnail(url, function ( result ) {
			strictEqual(result, "NOT_FOUND_ERR", "Thumbnail is not found, correct error.");
			start();
		});
	});

	asyncTest( "Set thumbnail", 2, function () {
		$.imageloader.setThumbnail( url, function ( result ) {
			strictEqual( typeof result, "string", "Result is returned" );
			strictEqual( result.substr(0, 22), "data:image/png;base64,", "Returned result is png data string" );
			start();
		});
	});

	asyncTest( "Remove thumbnail", 1, function () {
		$.imageloader.removeThumbnail( url );
		$.imageloader.getThumbnail(url, function ( result ) {
			strictEqual(result, "NOT_FOUND_ERR", "Thumbnail is not found, correct error.");
			start();
		});
	});
});