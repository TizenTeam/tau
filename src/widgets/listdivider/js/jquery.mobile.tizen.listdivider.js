/* ***************************************************************************
* style : normal, check
*
*
*/
/**
	@class ListDivider
	The list divider widget is used as a list separator for grouping lists. List dividers can be used in Tizen as described in the jQueryMobile documentation for list dividers.<br/>
	To add a list divider widget to the application, use the following code:

		<li data-role="list-divider" data-style="check">
		<form><input type="checkbox" name="c2line-check1" /></form></li>

	The list divider can define callbacks for events as described in the jQueryMobile documentation for list events. <br/> You can use methods with the list divider as described in the jQueryMobile documentation for list methods.

	@since tizen2.0	
*/
/**
	@property {String} data-style
	Sets the style of the list divider. The style options are dialogue, check, expandable, and checkexpandable.
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
