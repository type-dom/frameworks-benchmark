import puppeteer from 'puppeteer';
import fs from 'fs';

// 测试URL列表
const urls = {
  // 'angular': 'http://localhost:4200',
  'react': 'http://localhost:5200',
  'solid': 'http://localhost:6200',
  // 'svelte': 'http://localhost:7200',
  'type-dom': 'http://localhost:8200',
  'vue': 'http://localhost:9200',
};

// 测试结果对象
const results = {};

// 测试函数：测量点击延迟
async function testClickDelay(url, framework) {
  console.log(`Testing click delay for ${framework}...`);

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      // '--disable-gpu',
      // '--no-sandbox',
      '--disable-background-timer-throttling', // 禁用后台定时器节流
      '--disable-backgrounding-occluded-windows', // 禁用被遮挡窗口的后台化
      '--disable-renderer-backgrounding' // 禁用渲染器后台化
    ] // 移除无效的 --theta 参数
  });

  const page = await browser.newPage();

  // 设置移动端模拟和网络限制
  await page.setViewport({ width: 414, height: 896 }); // 模拟 Pixel 5 分辨率
  // 导航到页面并增加超时
  await page.emulateNetworkConditions({
    offline: false,
    latency: 144, // RTT (ms)
    download: (300 * 1024) / 8, // 吞吐量 (bps) // 300 Kb/s → 37500 B/s
    upload: (300 * 1024) / 8 // 300 Kb/s → 37500 B/s
  });

  // 导航到页面
  await page.goto(url, {
    // waitUntil: 'networkidle0',
    waitUntil: 'domcontentloaded',
    timeout: 60000 // 增加超时至 60 秒
  });
  // await page.goto(url, { waitUntil: 'domcontentloaded' });
  const title = await page.title();
  console.log(`页面标题: ${title}`); // 确认页面实际内容

  // 点击延迟测量
  let averageDelay = 0;
  for (let i = 0; i < 10; i++) {
    // 等待按钮文本变化（确保按钮可用）
    await page.waitForFunction(() => {
      const btn = document.getElementById('counter-btn');
      return btn && btn.textContent !== '';
    }, { timeout: 10000 });

    // 记录点击前时间
    const clickTimeStart = performance.now();

    // 点击按钮
    await page.click('#counter-btn');

    // 记录点击后时间
    const clickTimeEnd = performance.now();

    // 计算延迟
    const delay = clickTimeEnd - clickTimeStart;
    averageDelay += delay;
  }

  averageDelay /= 10;

  // 存储结果
  results[framework] = {
    clickDelay: averageDelay,
    frameRate: await measureFrameRate(page)
  };

  // 关闭浏览器
  await browser.close();
}

// 测量帧率（FPS）
async function measureFrameRate(page) {
  // 在页面环境中测量 FPS，直接返回帧数
  const frameCount = await page.evaluate(() => {
    return new Promise(resolve => {
      let frameCount = 0;
      let lastTime = performance.now();

      const checkFPS = (timestamp) => {
        frameCount++;

        const now = performance.now();
        if (now - lastTime >= 1000) {
          resolve(frameCount);
          return;
        }

        requestAnimationFrame(checkFPS);
      };

      requestAnimationFrame(checkFPS);
    });
  });

  console.log(`Measured ${frameCount} frames in 1 second.`);
  return frameCount;
}

// 遍历所有框架进行测试
async function main() {
  for (const [framework, url] of Object.entries(urls)) {
    await testClickDelay(url, framework);
  }

  // 将结果保存为CSV文件
  const csvContent = 'Framework,Click Delay (ms),Frame Rate (FPS)\n' +
      Object.entries(results).map(([framework, data]) =>
          `${framework},${data.clickDelay.toFixed(2)},${data.frameRate}`
      ).join('\n');

  fs.writeFileSync('interaction_results.csv', csvContent);
  console.log('Interaction test completed. Results saved to interaction_results.csv');
}

// 运行测试
main();
