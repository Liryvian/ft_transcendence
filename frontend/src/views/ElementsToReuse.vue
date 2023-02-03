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

			<div class="form_group">
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

			<div class="c_list">
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

    <div class="page_box_wrapper">
        <div class="page_box c_chat">
            <div class="c_chat__userlist">
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
                <div class="c_conversation__header">
                    <div>
                        invite for a game
                    </div>
                    <div>
                        <div class="c_media c_media--assetright c_media--clickable">
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

                    <div v-for="msg in messages" class="c_message" :class="{'c_message--mine': msg.is_mine}">
                        <span class="c_message__time">{{ msg.time }}</span>
                        <span class="c_message__name">{{ msg.name }}</span>
                        <div class="c_message__wrap">
                            <div class="c_message__msg">
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
                    <input type="submit" value="enter">
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    // type inference enabled
    data() {
        return {
            messages: [
                { time: '14:55', is_mine: false, name: 'renoster', msg: "hey!" },
                { time: '14:56', is_mine: false, name: 'renoster', msg: "What are your plans for today?" },
                { time: '14:58', is_mine: true, name: 'vaalboskat', msg: "I'm going to work hard and fail harder!!" },
                { time: '14:58', is_mine: true, name: 'vaalboskat', msg: "jk" },
                { time: '14:58', is_mine: true, name: 'vaalboskat', msg: "How about wo go to the forest for a nice and cozy walk with the whole team? That would be great right?\nIt would make a lot of sense to do something like that in regards to the teambuilding converstation we had earlier this month.\nLet me know what you think!\nps. this message was composed without using chatgpt" },
            ]
        }
    },
})
</script>
