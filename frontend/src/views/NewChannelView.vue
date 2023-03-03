<template>
	<div class="page_box_wrapper">
		<div class="page_box">
			<h1>NEW CHANNEL</h1>
			<div class="c_block c_form_group">
				<div class="c_field_group">
					<label for="disabled_field">channel owner:</label>
					<input
						id="disabled_field"
						type="text"
						value="disabled field"
						disabled
					/>
				</div>
				<div class="c_field_group">
					<label for="example_field">group name:</label>
					<input
						id="example_field"
						type="text"
					/>
				</div>

				<div class="c_field_group">
					<label for="example_field">add member:</label>
						<template v-for="user in allUsers">
							<ListRow
								v-if="user.id !== me.id"
								:user="user"
								:relationship="getCurrentRel(user.id)"
							/>
							<div>
								<input type="checkbox" id="coding" name="interest" value="coding" checked />
								<label for="coding">Coding</label>
							</div>
						</template>
					<div>
						<input type="checkbox" id="coding" name="interest" value="coding" checked />
						<label for="coding">Coding</label>
					</div>
<!--					<input-->
<!--						id="example_field"-->
<!--						type="text"-->
<!--					/>-->
				</div>

				<div class="c_field_group">
					<label for="example_field">set password:</label>
					<input
						id="example_field"
						type="text"
					/>
				</div>

				<div class="c_field_group">
					<label for="example_field">confirm password:</label>
					<input
						id="example_field"
						type="text"
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
					<div class="page_button pb_bottom">
						<a href="#">create</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
