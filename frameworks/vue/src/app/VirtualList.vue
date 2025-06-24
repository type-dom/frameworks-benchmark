<template>
  <div
      ref="container"
      class="virtual-container"
      @scroll="handleScroll"
  >
    <!-- 虚拟总高度 -->
    <div :style="{ height: totalHeight + 'px' }">
      <!-- 可视区域内容 -->
      <div
          :style="{
          transform: `translateY(${start * itemHeight}px)`,
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%'
        }"
      >
        <div
            v-for="index in visibleIndices"
            :key="index"
            class="list-item"
        >
          <p>Item {{ index + 1 }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// 基础配置
const itemHeight = 50
const visibleCount = 10 // 可视区域显示 10 行
const viewHeight = itemHeight * visibleCount; // 可视区域高度
const totalItems = 10000 // 总数据量

// 响应式状态
const scrollTop = ref(0)
const start = ref(0)
const end = ref(visibleCount)
const container = ref(null)

// 计算可视区域索引
const visibleIndices = computed(() => {
  const indices = []
  for (let i = start.value; i < Math.min(end.value, totalItems); i++) {
    indices.push(i)
  }
  return indices
})

// 总高度计算（用于占位）
const totalHeight = computed(() => totalItems * itemHeight)

// 滚动事件处理（带防抖）
const handleScroll = () => {
  if (container.value) {
    scrollTop.value = container.value.scrollTop
    const startIndex = Math.floor(scrollTop.value / itemHeight)
    start.value = startIndex
    end.value = startIndex + visibleCount
  }
}
</script>

<style scoped>
.virtual-container {
  width: 300px;
  position: relative;
  height: 500px;
  overflow: auto;
  border: 1px solid #ccc;
}

.list-item {
  height: 50px;
  line-height: 50px;
  border-bottom: 1px solid #eee;
  p {
    margin: 0;
  }
}
</style>
