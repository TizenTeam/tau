function setCookie( cookieName, cookieValue, expireDate) {
	var today = new Date();
		today.setDate( today.getDate() + parseInt( expireDate ) );
		document.cookie = cookieName + "=" + escape( cookieValue ) + "; path=/; expires=" + today.toGMTString() + ";";
}
function getCookie(name) {
	var cname = name + "=";
	var dc = document.cookie;
	if (dc.length > 0) {
		begin = dc.indexOf(cname);
			if (begin != -1) {
				begin += cname.length;
				end = dc.indexOf(";", begin);
					if (end == -1) {
						end = dc.length;
					}
				return unescape(dc.substring(begin, end));
			}
	}
	return null;
}