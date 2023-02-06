<template>
	<div class="page_box_wrapper">
		<div class="page_box c_chat" :class="focusTarget">
			<div class="c_chat__userlist">
				<div
					v-if="focusTarget == 'c_chat--msg'"
					@click="toggleFocusTarget('list')"
					class="toggleHandler"
				></div>
				<div class="c_list">
					<h1>Direct Messages</h1>
					<div v-for="a in 4">
						<div class="c_media c_media--clickable">
							<div class="c_media__asset c_asset--online">
								<div class="c_asset__circle">
									<img src="/test-profile.png" alt="" />
								</div>
							</div>
							<div class="c_media__content">username</div>
						</div>
						<div class="c_media c_media--clickable">
							<div class="c_media__asset c_asset--online">
								<div class="c_asset__circle">
									<img src="/vaalboskat.png" alt="" />
								</div>
							</div>
							<div class="c_media__content">username</div>
						</div>
						<div class="c_media c_media--clickable">
							<div class="c_media__asset c_asset--offline">
								<div class="c_asset__circle">
									<img src="/renoster.png" alt="" />
								</div>
							</div>
							<div class="c_media__content">username</div>
						</div>
					</div>
				</div>

				<div class="c_list">
					<h1>Channels</h1>
					<div v-for="a in 4">
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
							<div class="c_media__content">channel name</div>
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
							<div class="c_media__content">channel name</div>
						</div>
					</div>
				</div>
			</div>
			<div class="c_chat__conversation">
				<div
					v-if="focusTarget == 'c_chat--list'"
					@click="toggleFocusTarget('msg')"
					class="toggleHandler"
				></div>
				<div class="c_conversation__header">
					<div>invite for a game</div>
					<div>
						<div
							class="c_media c_media--assetright c_media--clickable"
						>
							<div class="c_media__asset c_asset--online">
								<div class="c_asset__circle">
									<img src="/test-profile.png" alt="" />
								</div>
							</div>
							<div class="c_media__content">username</div>
						</div>
					</div>
				</div>
				<div class="c_messagelist">
					<div
						v-for="msg in messages"
						class="c_message"
						:class="{ 'c_message--mine': msg.is_mine }"
					>
						<div class="c_message__name">{{ msg.name }}</div>
						<div class="c_message__wrap">
							<div class="c_message__msg">
								<div class="c_message__time">
									{{ msg.time }}
								</div>
								<div v-for="msgpart in msg.msg.split('\n')">
									{{ msgpart }}
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="c_send_message">
					<textarea
						name="new_message"
						id="new_message"
						placeholder="type..."
					></textarea>
					<input type="submit" value="enter" />
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	// type inference enabled
	data() {
		return {
			focusTarget: 'c_chat--msg',
			messages: [
				{
					time: '14:55',
					is_mine: false,
					name: 'renoster',
					msg: 'hey!',
				},
				{
					time: '14:56',
					is_mine: false,
					name: 'renoster',
					msg: 'What are your plans for today?',
				},
				{
					time: '14:58',
					is_mine: true,
					name: 'vaalboskat',
					msg: "I'm going to work hard and fail harder!!",
				},
				{ time: '14:58', is_mine: true, name: 'vaalboskat', msg: 'jk' },
				{
					time: '14:58',
					is_mine: true,
					name: 'vaalboskat',
					msg: 'How about wo go to the forest for a nice and cozy walk with the whole team? That would be great right?\nIt would make a lot of sense to do something like that in regards to the teambuilding converstation we had earlier this month.\nLet me know what you think!\nps. this message was composed without using chatgpt',
				},
			],
		};
	},
	methods: {
		toggleFocusTarget(target: string) {
			this.focusTarget = 'c_chat--' + target;
			console.log(this.focusTarget);
		},
	},
});
</script>
