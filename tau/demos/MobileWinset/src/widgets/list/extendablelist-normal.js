$("#genlist_extendable_normal_page").one("pagecreate", function ( el ) {
	/*?_=ts code for no cache mechanism*/
	$.getScript( "./virtuallist-db-demo.js", function ( data, textStatus ) {
		var config = {
				//Declare total number of items
				dataLength: JSON_DATA.length,
				//Set buffer size
				bufferSize: 50,
				listItemUpdater: function(elListItem, newIndex) {
					//TODO: Update listitem here
					var data =  JSON_DATA[newIndex];
					elListItem.innerHTML = '<span class="ui-li-text-main">' + data.NAME + '</span>';
				},
				listItemLoader: function(elListItem, numMoreItems) {
					// @TODO tau._export should not be used in application development,
					// @TODO but it's currently the only way of fixing this issue
					var engine = tau._export.engine,
						loader = engine.getBinding(document.getElementById('extendableListButton'));

					if (!loader) {
						loader = document.createElement('div');
						loader.id = 'extendableListButton';
						elListItem.appendChild(loader);
						loader = engine.instanceWidget(loader, 'Button');
					}

					loader.element.innerHTML = 'Load ' + numMoreItems + ' more items';
				}
			};

		$("ul.ui-extendable-list-container").extendablelist('create', config);
	});
});