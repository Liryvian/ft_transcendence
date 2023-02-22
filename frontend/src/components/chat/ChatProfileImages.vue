<template>
    <div v-for="member in visible_avatars" class="c_asset c_asset__circle">
        <img :src="`/api/avatars/${member.avatar}`" :alt="`Avatar of ${member.name}`" />
    </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import type { Chat_List_Item, Chat_Member } from '@/types/Chat'
import { useUserStore } from '@/stores/userStore';

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
            const usersWithoutMe = this.chat.users.filter((user) => user.id !== useUserStore().me.id);
            if (this.chat.type === 'dm') {
                return usersWithoutMe.slice(0, 1);
            }
            // filter out self, and sort by some method
            // or sort by some method and make sure self is last (so if others.length < 3 you are last/first/bottom avatar))
            return usersWithoutMe.slice(0, 3);
        },
    }
});
</script>