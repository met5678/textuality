<div id="schedule-module">

	<div class="schedule-items">

		<div class="schedule-item">Disco Funk</div>

		<div class="schedule-item">NDMOOD</div>

		<div class="schedule-item">Verkelmpt Valentines Visuals</div>

		<div class="schedule-item">Mix'n'mashup</div>

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
