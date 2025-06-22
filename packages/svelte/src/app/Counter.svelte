<script>
    let count = 0;
    let updateTime = 0;

    // 每秒自动递增
    $: interval = setInterval(() => {
        if (count === 1000) {
            clearInterval(interval);
            return;
        }
        count++;
        const startTime = performance.now();
        count++;
        const endTime = performance.now();
        updateTime += endTime - startTime;
    }, 10);

    // 清理间隔
    function destroy() {
        clearInterval(interval);
    }
</script>

<button id="counter-btn" on:click={() => count++}>
    Count: {count}
</button>
<p>Update delay: {updateTime} ms</p>

<style>
    button {
        font-size: 1.2em;
        padding: 10px;
    }
</style>
