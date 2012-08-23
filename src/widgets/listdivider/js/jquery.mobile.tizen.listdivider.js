/* ***************************************************************************

*/

(function ( $, undefined ) {

	$.widget( "tizen.listdivider", $.mobile.widget, {
		options: {
			initSelector: ":jqmData(role='list-divider')"
		},

		_create: function () {

			var $listdivider = this.element,
				openStatus = true,
				iconStatus,
				expandSrc,
				style = $listdivider.attr( "data-style" );

			if ( style === "expandable" || style === "checkexpandable" ) {
				openStatus ? iconStatus = "opened" : iconStatus = "closed";
				expandSrc = "<span class='ui-divider-expand-div'><span class='ui-icon-expandable-divider-" + iconStatus + "'/></span>";

				$( expandSrc ).appendTo( $listdivider );
			}

			$listdivider.children( ".ui-divider-expand-div" ).bind( "vclick", function ( event, ui ) {
				if ( openStatus ) {
					$( this ).children( "span" ).removeClass( "ui-icon-expandable-divider-opened" );
					$( this ).children( "span" ).addClass( "ui-icon-expandable-divider-closed" );
					openStatus = false;
				} else {
					$( this ).children( "span" ).removeClass( "ui-icon-expandable-divider-closed" );
					$( this ).children( "span" ).addClass( "ui-icon-expandable-divider-opened" );
					openStatus = true;
				}
			});
		},
	});

	//auto self-init widgets
	$( document ).bind( "pagecreate create", function ( e ) {
		$( $.tizen.listdivider.prototype.options.initSelector, e.target ).listdivider();
	});
}( jQuery ) );
