function addListItem( list, listContent ) {
	var listitem;
	var style;
	style = $(list).data("icon");

	switch( style ) {
	case '1line-textonly': {
		listitem = "<li id=" + listContent.id + ">" + "<a href=" + listContent.href + ">" + listContent.item + "</a></li>";
		$(list).append( listitem );
		}
		break;
	case '1line-texticon50':
	case '1line-texticon70': {
		listitem = "<li id=" + listContent.id + ">" + "<img src=" + listContent.imgSrc + ">" + "< href=" + listContent.href	+ ">" + listContent.title + "</a></li>";
		$(list).append( listitem );
		}
		break;
	case '2line-texticoninfo': {
		listitem = "<li id=" + listContent.id + ">" + "<img src=" + listContent.imgSrc + ">" + "<p>" + listContent.info + "</p>" + 
					"<h3><a href=" + listContent.href + ">" + listContent.title + "</a></h3>" + "<p>" + listContent.subTitle + "</p></li>"
		$(list).append( listitem );
		}
		break;	
	case 'editmode-icon': {
		listitem = "<li id=" + listContent.id + ">" +
			"<input type='checkbox' name='" + listContent.inputGroup +"' id='"+ listContent.inputId +"'>" +
			"<label for='" + listContent.inputId + "'>" +
			"<img src='" + listContent.imgSrc + "'>" +
			"<span>"+
			"<h3><a href='" + listContent.href + "'>" + listContent.title + "</a></h3>" +
			"<p>" + listContent.subTitle + "</p>" +
			"</span></label></li>";
			
			$(list).append(listitem);

			$(list).find( "[type='checkbox']" ).checkboxradio();
			
			$(list).listview('refresh');
		}
		break;
	case 'editmode-icon-3line': {
		listitem = "<li id=" + listContent.id + ">" +
			"<input type='checkbox' name='" + listContent.inputGroup +"' id='"+ listContent.inputId +"'>" +
			"<label for='" + listContent.inputId + "'>" +
			"<img src='" + listContent.imgSrc + "'>" +
			"<span>"+
			"<h3><a href='" + listContent.href + "'>" + listContent.title + "</a></h3>" +
			"<p>" + listContent.subTitle + "</p>" +
			"<p>" + listContent.description + "</p>" +
			"</span></label></li>";
			
			$(list).append(listitem);
			$(list).find( "[type='checkbox']" ).checkboxradio();
			$(list).listview('refresh');
		}
		break;
	case '3line-texticon': {
		listitem = "<li id=" + listContent.id + ">" +
			"<img src='" + listContent.imgSrc + "'>" +
			"<h3><a href='" + listContent.href + "'>" + listContent.title + "</a></h3>" +
			"<p>" + listContent.subTitle + "</p>" +
			"<p>" + listContent.description + "</p></li>";
			$(list).append(listitem);
		}
		break;
	}
	
	$(list).listview('refresh');
	return list;
}
