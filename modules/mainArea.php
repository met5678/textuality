<div id="texts">
	<div class="text-scroller">
		<div class="text-msg">
			<div class="text-msg-left">
				<div class="text-alias">Demon rainbow</div>
				<div class="text-timestamp">5 mins ago</div>
			</div>
			<div class="text-msg-right">
				<div class="text-body">Just putting it out there - Tilda looks GREAT this evening. Yes she doys. Oh boy yes. Lorem ipsum dolor sit amet. And more words now enough.</div>
			</div>
		</div>
		<div class="text-msg">
			<div class="text-msg-left">
				<div class="text-alias">Demon rainbow</div>
				<div class="text-timestamp">5 mins ago</div>
			</div>
			<div class="text-msg-right">
				<div class="text-body">Shorter text.</div>
			</div>
		</div>
		<div class="text-msg">
			<div class="text-msg-left">
				<div class="text-alias">Demon rainbow</div>
				<div class="text-timestamp">5 mins ago</div>
			</div>
			<div class="text-msg-right">
				<div class="text-body">Just putting it out there - Tilda looks GREAT this evening. Yes she doys. Oh boy yes. Lorem ipsum dolor sit amet. And more words now enough.</div>
			</div>
		</div>
		<div class="text-msg">
			<div class="text-msg-left">
				<div class="text-alias">Demon rainbow</div>
				<div class="text-timestamp">5 mins ago</div>
			</div>
			<div class="text-msg-right">
				<div class="text-body">Shorter text.</div>
			</div>
		</div>
	</div>
</div>

<script>
$(function() {
	headerEl = $('.header');
	mainEl = $('.main');
	footerEl = $('.footer');
	mainEl.css('height',($('#textuality').outerHeight()-headerEl.outerHeight()-footerEl.outerHeight())+'px');
	mainEl.css('top',headerEl.outerHeight()+'px');
});
</script>