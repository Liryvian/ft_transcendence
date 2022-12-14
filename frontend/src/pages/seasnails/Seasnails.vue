<template>

</template>

<script lang="ts">
import {onMounted, ref} from 'vue';
import axios from 'axios';

export default {
  name: "Seasnails.vue",
  setup(){
    const seasnails = ref([]);
    onMounted( async () => {
      const {data} = await axios.get('seasnails');

      seasnails.value = data
    });
    return {
      seasnails
    }
  }
}
</script>

<style scoped>

</style>