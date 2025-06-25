<script>
    import { state } from 'svelte';

    const data = Array(10000).fill(null).map((_, index) => ({ index }));

    let scrollTop = state(0);
    let start = state(0);
    let end = state(20);

    // 计算可见区域的开始和结束索引
    $: {
        const itemHeight = 50;
        const viewStart = Math.floor(scrollTop / itemHeight);
        const viewEnd = viewStart + 20; // 假设可视区域显示 20 条

        start = viewStart;
        end = Math.min(viewEnd, data.length); // 防止超出范围
    }

    // 占位高度
    // $: placeholderHeight = data.length * 50;

    // 滚动事件处理
    function handleScroll(event) {
        const container = event.target;
        const clientHeight = container.clientHeight;
        const scrollHeight = container.scrollHeight;
        const itemHeight = 50;

        // 计算可见区域的开始和结束索引
        const viewStart = Math.floor(scrollTop.value / itemHeight);
        const viewEnd = viewStart + Math.ceil(clientHeight / itemHeight);

        setStart(viewStart);
        setEnd(viewEnd);
    }

    // 设置占位高度
    // $: placeholderHeight = data.length * 50;
</script>

<div class="scroll-container" on:scroll={handleScroll}>
    <!-- 占位元素 -->
    <div style="height: {placeholderHeight}px"></div>

    <!-- 可视区域 -->
    <div style="transform: translateY(-{start * 50}px)">
        {#each data.slice(start, end) as item}
            <div class="list-item" key={item.index}>
                <p>Item {item.index}</p>
            </div>
        {/each}
    </div>
</div>

<style>
    scroll-container {
        position: relative;
        height: 400px;
        width: 300px;
        overflow-y: auto;
        border: 1px solid #ccc;
    }

    list-item {
        height: 50px;
        padding: 10px;
    }
</style>
