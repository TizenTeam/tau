/* ***************************************************************************
* style : normal, check
*
*
*/

(function ( $, undefined ) {

	$.widget( "tizen.listdivider", $.mobile.widget, {
		options: {
			initSelector: ":jqmData(role='list-divider')",
		},

		_create: function () {

			var $listdivider = this.element,
				openStatus = true,
				expandSrc,
				listDividerLine = true,
				style = $listdivider.attr( "data-style" );

			if ( $listdivider.data("line") === false ) {
				listDividerLine = false;
			}

			if ( style == undefined || style === "normal" || style === "check" ) {
				$listdivider.buttonMarkup();

				if ( listDividerLine ) {
					expandSrc = "<span class='ui-divider-normal-line'></span>";
					$( expandSrc ).appendTo( $listdivider.children( ".ui-btn-inner" ) );
				}

			}

			$listdivider.bind( "vclick", function ( event, ui ) {
			/* need to implement expand/collapse divider */
			});
		},
	});

	//auto self-init widgets
	$( document ).bind( "pagecreate create", function ( e ) {
		$( $.tizen.listdivider.prototype.options.initSelector, e.target ).listdivider();
	});
}( jQuery ) );
