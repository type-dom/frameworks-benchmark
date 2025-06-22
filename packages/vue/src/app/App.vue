<script setup lang="ts">
import Counter from "./Counter.vue";
import VirtualList from "./VirtualList.vue";
import List from './List.vue';
</script>

<template>
  <div class="app-container">
    <h1>Vue Performance Test</h1>
    <Counter />
    <VirtualList />
    <List/>
  </div>
</template>

<style>
.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
</style>

