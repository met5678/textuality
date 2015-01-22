<div id="schedule-module">
	<div class="schedule-items">
		<div class="schedule-item">Nu Disco/Funk</div>
		<div class="schedule-item">NDMOOD</div>
		<div class="schedule-item">Optic Verve</div>
		<div class="schedule-item">Mainstream Mashup</div>
	</div>
</div>

<script>
$(function() {
	var ec = window.textuality_ec;
	
	var updateSchedule = function(newJson) {
		console.log("Update schedule here");
	}
	
	ec.register({
		'content_update':updateSchedule
	});
});
</script>
