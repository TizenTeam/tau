<?php
	$testname = $_REQUEST["testname"];
	$t = $_REQUEST["t"];
	$p = $_REQUEST["p"];
	$f = $_REQUEST["f"];
	$r = $_REQUEST["r"];
?>
<html>
	<head>
		<script type="text/javascript" src="../../libs/js/jquery-1.7.1.js"></script>
		<script>
			function getCookie(name) {
				var cname = name + "=";
				var dc = document.cookie;
				if (dc.length > 0) {
					begin = dc.indexOf(cname);
					if (begin != -1) {
						begin += cname.length;
						end = dc.indexOf(";", begin);
					if (end == -1) end = dc.length;
					return unescape(dc.substring(begin, end));
					}
				}
				return null;
			}
			$(document).ready( function() {
				$("#os").text( getCookie("OS") );
				$("#browser").text( getCookie("Browser") );
				$("#version").text( getCookie("Version") );
			});
		</script>
	</head>
	<body>
		<h1>Test Report</h1>
		<div>
			<table style="width:50%;font-size:20px">
				<tr style="background:lightgray">
					<td colspan="2">Device Information<td>
				</tr>
				<tr>
					<td>Operation System</td>
					<td><span id="os"></span></td>
				</tr>
				<tr>
					<td>Browser Information</td>
					<td><span id="browser"></span></td>
				</tr>
				<tr>
					<td>Versions</td>
					<td><span id="version"></span></td>
				</tr>
			</table>
		</div>
		<br>
		<br>
		<div>
			<table style="width:50%;font-size:20px">
				<tr style="background:lightgray">
					<td colspan="2">Test summary<td>
				</tr>
				<!--
				<tr>
					<td>Test name</td>
					<td><span><?=$testname?></span></td>
				</tr>
				-->
				<tr>
					<td>Tests total</td>
					<td><span><?=$t?></span></td>
				</tr>
				<tr>
					<td>Tests Passed</td>
					<td><span><?=$p?></span></td>
				</tr>
				<tr>
					<td>Tests Failed</td>
					<td><span><?=$f?></span></td>
				</tr>
				<tr>
					<td>Time(m seconds)</td>
					<td><span><?=$r?></span></td>
				</tr>
			</table>
		</div>
	</body>
</html>