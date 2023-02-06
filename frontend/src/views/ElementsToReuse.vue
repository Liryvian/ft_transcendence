<!-- FILE LATER TO BE REMOVED -->

<template>
	<div class="page_box_wrapper">
		<div class="c_game__name">NAME</div>
		<div class="c_game__name c_game__name--right">NAME</div>
		<div class="page_box">
			<h1>Some Elements to reuse</h1>

			<!-- Without pb_bottom it's positioned on the top -->
			<div class="page_button pb_bottom">
				<a href="#">save</a>
			</div>

			<div class="c_block c_form_group">
				<div class="c_field_group">
					<label for="disabled_field">field label:</label>
					<input
						id="disabled_field"
						type="text"
						value="disabled field"
						disabled
					/>
				</div>

				<div class="c_field_group">
					<label for="example_field">field label:</label>
					<input
						id="example_field"
						type="text"
						placeholder="placeholder text (optional)"
					/>
				</div>

				<div class="c_field_group c_field_group--radio">
					<div class="c_radio_group">
						<label for="example_radio2">public</label>
						<input
							name="same"
							id="example_radio2"
							type="radio"
							value="on"
							checked
						/>
					</div>
					<div class="c_radio_group">
						<label for="example_radio1">private</label>
						<input
							name="same"
							id="example_radio1"
							type="radio"
							value="on"
						/>
					</div>
				</div>
			</div>

			<div class="c_block c_split">
				<p><a href="#">one</a> / <a href="#">two</a></p>
				<p><a href="#">three</a></p>
			</div>

			<div class="c_block c_list">
				<div class="c_media">
					<div class="c_media__asset c_asset--online">
						<div class="c_asset__circle">
							<img src="/test-profile.png" alt="" />
						</div>
					</div>
					<div class="c_media__content">some piece of text</div>
				</div>

				<div class="c_media c_media--clickable">
					<div class="c_media__asset c_asset--offline">
						<div class="c_asset__circle">
							<img src="/test-profile.png" alt="" />
						</div>
					</div>
					<div class="c_media__content">some piece of text</div>
				</div>
				<div class="c_media c_media--clickable">
					<div class="c_media__asset c_asset--multi">
						<div class="c_asset c_asset__circle">
							<img src="/vaalboskat.png" alt="" />
						</div>
						<div class="c_asset c_asset__circle">
							<img src="/test-profile.png" alt="" />
						</div>
						<div class="c_asset c_asset__circle">
							<img src="/renoster.png" alt="" />
						</div>
					</div>
					<div class="c_media__content">some piece of text</div>
				</div>
				<div class="c_media c_media--clickable">
					<div class="c_media__asset c_asset--multi">
						<div class="c_asset c_asset__circle">
							<img src="/test-profile.png" alt="" />
						</div>
						<div class="c_asset c_asset__circle">
							<img src="/vaalboskat.png" alt="" />
						</div>
					</div>
					<div class="c_media__content">some piece of text</div>
				</div>
			</div>
		</div>
	</div>
</template>
