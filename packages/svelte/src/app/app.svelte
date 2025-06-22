<script context="module">
  export const meta = {
    title: 'Svelte Performance Test'
  };
</script>

<script>
  import Counter from './Counter.svelte';
  import VirtualList from './VirtualList.svelte';
</script>

<div class="app-container">
  <h1>Svelte Performance Test</h1>
  <Counter />
  <VirtualList />
</div>

<style>
  .app-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }
</style>