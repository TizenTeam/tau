function showCallback(value) {
	var log = 'Changed value to ' + value;
	console.log(log);
	$("#txt").html(log);
}

var i;
for(i=1; i<=10; i++) {
	console.log(i + ">>>" + $('#p'+i));
	$('#p'+i).setChangeCallback(function(value) {
		var log = 'Changed value to ' + value;
		console.log(log);
		$("#txt").html(log);
	});
}

