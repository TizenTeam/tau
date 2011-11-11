
$('#pagecontrol').live('pageshow', function() {
	var i = 1;
	for(i=1; i<=10; i++) {
		// Example: Set value change callback
		$('#p'+i).bind("change", function(event, value) {
			var log = 'Changed value to ' + value;
			$("#txt").html(log);
		});
		// Example: Set value by random
		$('#p'+i).trigger('change', Math.floor(Math.random() * i + 1));
	}
});

