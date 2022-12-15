<template>
  <div class="seasnail">
    <table class="table table-striped table-sm">
      <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Name</th>
        <th scope="col">Color</th>
        <th scope="col">Email</th>
        <th scope="col">Password</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="seasnail in seasnails" :key="seasnail.id">
        <td>{{seasnail.id}}</td>
        <td>{{seasnail.name}} {{seasnail.color}}</td>
        <td>{{seasnail.email}}</td>
        <td>{{ seasnail.role.name }}</td>
        <td></td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import {onMounted, ref} from 'vue';
import axios from 'axios';

export default {
  name: "seasnail",
  setup(){
    const seasnails = ref([]);
    onMounted( async () => {
      const {data} = await axios.get('Seasnails');

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