<template>
  <div id="app">
    <router-view />  
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'; 
import { onMounted } from 'vue';

const router = useRouter();

onMounted(() => {
  router.push('/');
});
</script>

<style scoped>

</style>
