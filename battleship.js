<!DOCTYPE html>
<html>
<head>
	<title>Redirect Example</title>
</head>
<body>
	<button id="start-btn">Start</button>

	<script>
		document.getElementById("start-btn").addEventListener("click", function() {
			window.location.href = "game.html";
		});
	</script>
</body>
</html>
