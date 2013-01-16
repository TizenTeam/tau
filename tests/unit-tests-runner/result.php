<html>
	<head>
		<script type="text/javascript" src="../../libs/js/jquery-1.7.1.js"></script>
		<script type="text/javascript" src="cookie.js"></script>
		<script>
			$(document).ready( function() {
				$("#os").text( getCookie("OS") );
				$("#browser").text( getCookie("Browser") );
				$("#version").text( getCookie("Version") );

				$("#total").text( getCookie("TizenT") );
				$("#pass").text( getCookie("TizenP") );
				$("#failed").text( getCookie("TizenF") );
				$("#time").text( getCookie("TizenR") );

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
					<td><span id="total"></span></td>
				</tr>
				<tr>
					<td>Tests Passed</td>
					<td><span id="pass"></span></td>
				</tr>
				<tr>
					<td>Tests Failed</td>
					<td><span id="failed"></span></td>
				</tr>
				<tr>
					<td>Time(m seconds)</td>
					<td><span id="time"></span></td>
				</tr>
			</table>
		</div>
	</body>
</html>