<template>
  <div>
    <button class="btn btn-primary btn-block" id="counter-btn" @click="increment">
      Count: {{ count }}
    </button>
    <p class="list-item">Update delay: {{ updateTime }} ms</p>
  </div>
</template>

<script>
import {ref, onUnmounted} from 'vue';

export default {
  setup() {
    const count = ref(0);
    let updateTime = ref(0);

    let countUpdateTime = 0
    // 每秒自动递增
    const interval = setInterval(() => {
      if (count.value === 1000) {
        clearInterval(interval);
        return;
      }
      const startTime = performance.now();
      count.value++;
      const endTime = performance.now();
      countUpdateTime += endTime - startTime;
      updateTime.value = countUpdateTime;
    }, 10);

    const  increment = () => {
      count.value++;
    };
    // 清理间隔
    onUnmounted(() => clearInterval(interval));

    return { count, updateTime, increment };
  }
};
</script>
