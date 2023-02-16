<template>
    <div class="c_conversation__header">
        <div v-if="chatInfo?.type === 'dm'">invite for a game</div>
        <div v-if="chatInfo?.type === 'channel'">channel settings</div>
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
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import { type Chat_Type } from '@/types/Chat'

export default defineComponent({
    name: 'ChatHeader',
    props: {
        type: {
            type: "channel" as PropType<Chat_Type>,
            default: "channel"
        }
    }
});
</script>
