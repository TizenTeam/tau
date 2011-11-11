
$('#pagecontrol').live('pageshow', function() {
	var i = 1;
	for(i=1; i<=10; i++) {
		$('#p'+i).bind("change", function(event, value) {
			var log = 'Changed value to ' + value;
			$("#txt").html(log);
		});
	}
});

