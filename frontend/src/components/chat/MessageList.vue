<template>

</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useMessageStore } from '@/stores/messageStore';
import Message from './Message.vue';

export default defineComponent({
    name: 'MessageList',
    components: {
        Message,
    },
    props: {
        chatId: {
            type: Number,
            required: true
        },
    },
    setup(props) {
        const messageStore = useMessageStore();

        // messageStore.refreshMessages(props.chatId);
        return {
            messageStore,
        };
    }
});
</script>