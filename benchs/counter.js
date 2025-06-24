const puppeteer = require('puppeteer');

(async () => {
    // 启动浏览器
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // 替换为你的目标URL
    await page.goto('http://localhost:9200');

    // 等待按钮加载（替换为实际的选择器）
    const buttonSelector = '#counter-btn';
    await page.waitForSelector(buttonSelector);

    let totalDelay = 0;

    for (let i = 0; i < 10; i++) {
        // 首次点击无需等待文本更新
        if (i > 0) {
            // 支持带前缀的文本格式（如'Count: 1'）
            await page.waitForFunction(
                () => {
                    const text = document.getElementById('counter-btn')?.textContent || '';
                    // 提取所有数字并转换为整数
                    const count = parseInt(text.replace(/[^\d]/g, ''));
                    console.log('解析到计数:', count, '原始文本:', text);
                    return count > 0;
                },
                { timeout: 10000 }
            );
        }

        const startTime = performance.now();
        await page.click('#counter-btn');
        const endTime = performance.now();
        const delay = endTime - startTime;
        totalDelay += delay;
    }

    // 计算延迟
    const latency = totalDelay / 10;
    console.log(`延迟时间: ${latency} 毫秒`);

    await browser.close();
})();
