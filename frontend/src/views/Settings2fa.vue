<template>
    <div class="page_box_wrapper">
        <div class="page_box">
            <h1>2 factor authentication settings</h1>
            <template v-if="me.has_2fa">
                turn of 2fa
            </template>
            <template v-else>
                <p>
                    You're about to turn on 2fa, scan the QR with your TOTP app to continue.
                </p>

            </template>
        </div>
    </div>
</template>

<script lang="ts">
import { useUserStore } from '@/stores/userStore';
import { storeToRefs } from 'pinia';
import { defineComponent } from 'vue';


export default defineComponent({
    name: '2fasettings',
    setup() {
        const userStore = useUserStore();
        const { me } = storeToRefs(userStore);

        return {
            me
        }
    },
    data() {
        return {

        }
    }
})
</script>
