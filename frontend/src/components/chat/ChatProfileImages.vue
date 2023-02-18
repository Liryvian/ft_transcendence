<template>
    <div v-for="member in visible_avatars" class="c_asset c_asset__circle">
        <img :src="member.avatar" :alt="`Avatar of ${member.name}`" />
    </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import type { Chat_List_Item, Chat_Member } from '@/types/Chat'

export default defineComponent({
    name: 'ChatProfileImages',
    props: {
        chat: {
            type: Object as PropType<Chat_List_Item>,
            required: true,
        },
        asset_position: {
            type: String,
            default: "",
        },
    },
    computed: {
        visible_avatars(): Chat_Member[] {
            if (this.chat.type === 'dm') {
                // filter out self, but need self for that
                return this.chat.members.slice(0, 1);
            }
            // filter out self, and sort by some method
            // or sort by some method and make sure self is last (so if others.length < 3 you are last/first/bottom avatar))
            return this.chat.members.slice(0, 3);
        },
    }
});
</script>
