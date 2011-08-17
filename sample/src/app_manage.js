val = 0;

function checkvalue(){
	if(val == 1)
	{
		$("#check_image").attr("src", "src/slp/button/00_check_checkedS.png");
		val = 0;
	}	
	else
	{
		$("#check_image").attr("src", "src/slp/button/00_check_single_dim.png");
		val = 1;		
	}
}

(function($){

	
	Obj_Test_btn = $("#test_btn")
		.click(function(){
//			alert("Test - Reset button clicked");
		});
		
	Obj_Reset_btn = $("#reset_btn")
		.click(function(){
			$(".custom").attr("checked", false).checkboxradio("refresh");			
		});	
		
	$("#go_to_btn")
		.click(function(){

			if($("#radio-choice-1").attr("checked") =="checked")
				$("#go_to_btn").attr("href", "#jqm_page");
			else
				$("#go_to_btn").attr("href", "#slp_page");			
		});
		
	$("#revealbutton")
		.addClass("slp-ui-button-reveal");

	$("#revealbutton1")
		.addClass("slp-ui-button-reveal");


	$("#infobutton").addClass("slp-ui-button-info");
	$("#callbutton").addClass("slp-ui-button-call");
		
})(jQuery);



