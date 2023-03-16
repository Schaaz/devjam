<!DOCTYPE html>
<html>
<head>
	<title>Redirect Example</title>
</head>
<body>
	<button id="start-btn">Start</button>

	<script>
		document.getElementById("start-btn").addEventListener("click", function() {
			window.location.href = "game.html"; // replace with the name of the HTML page you want to redirect to
		});
	</script>
</body>
</html>
