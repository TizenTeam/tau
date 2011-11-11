/**
 * Pagecontrol sample code
 * by Youmin Ha <youmin.ha@samsung.com>
 */

(function($) {

// Example: Set value change callback
$('#pagecontrol').live('pageshow', function() {
	var i = 1;
	for(i=1; i<=10; i++) {
		$('#p'+i).bind("change", function(event, value) {
			var log = 'Changed value to ' + value;
			$("#txt").html(log);
		});
	}
});


// Example: Set value by random
$('#pagecontrol_btn_randomset').live('click', 
	function() {
	var i;
	for(i=1; i<=10; i++) {
		$('#p'+i).trigger('change', 
			Math.floor(Math.random() * i + 1));
	}
});

})($);

