import puppeteer, { Browser, Page } from 'puppeteer';
import fs from 'fs';

// 测试配置
const urls = {
  react: 'http://localhost:5200',
  solid: 'http://localhost:6200',
  typedom: 'http://localhost:8200',
  vue: 'http://localhost:9200'
};

const scrollResults = {};

// 设备模拟配置
const deviceConfig = {
  userAgent: 'Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36',
  viewport: {
    width: 375,
    height: 812,
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    isLandscape: false
  }
};

/**
 * 滚动性能测试核心函数
 */
async function testScrollPerformance(url, framework) {
  console.log(`Testing scroll performance for ${framework}...`);

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-renderer-backgrounding'
    ]
  });

  try {
    const page = await browser.newPage();

    // 设置视口和设备模拟
    await page.setViewport({ width: 414, height: 896 });
    // await page.emulate(deviceConfig); // 可选启用设备模拟

    // 导航到测试页面
    await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });

    // 等待虚拟列表加载完成
    await page.waitForFunction(
        () => document.querySelector('.virtual-container') !== null,
        { timeout: 10000 }
    );

    // 开始性能跟踪
    await page.tracing.start({ categories: ['devtools.timeline'] });

    // 执行滚动操作
    await page.mouse.move(0, 0);
    await page.mouse.down();
    await page.mouse.move(0, 1000); // 向下滚动
    await page.mouse.up();
    await page.mouse.down();
    await page.mouse.move(0, -1000); // 向上滚动
    await page.mouse.up();

    // 停止跟踪并获取数据
    const trace = await page.tracing.stop();

    if (!trace) {
      console.warn('No trace data received');
      return;
    }
    let traceStr = '';
    if (trace) {
      // 正确转换：使用 UTF-8 编码
      traceStr = String.fromCharCode(...trace); // 将 将 ASCII 码数组还原为字符串
      // console.log(`trace str for ${framework}: ${traceStr.substr(0, 100)}...`);
    } else {
      console.warn(`No trace data received for ${framework}`);
      return;
    }

    let traceEvents = [];
    try {
      const parsedTrace = JSON.parse(traceStr);
      traceEvents = parsedTrace.traceEvents || [];
    } catch (e) {
      console.error(`Failed to parse trace data for ${framework}:`, e.message);
      return;
    }

    // 计算性能指标
    const frames = traceEvents.filter(e => e.cat === 'disabled-frame-time' && e.dur);
    const durations = frames.reduce((sum, f) => sum + f.dur, 0);
    const actualFPS = (1000 / 60 * frames.length) / durations;

    const mainThreadBlockingEvents = traceEvents.filter(e =>
        e.name?.includes('TaskQueueManager') && e.dur > 50
    );
    const mainThreadBlockTime = mainThreadBlockingEvents.reduce(
        (sum, event) => sum + event.dur,
        0
    );

    const memoryUsageKB = await getMemoryUsage(page);
    const memoryUsageMB = parseFloat((memoryUsageKB / 1024 / 1024).toFixed(2));

    // 存储测试结果
    scrollResults[framework] = {
      frameRate: parseFloat(actualFPS.toFixed(2)),
      mainThreadBlockTime,
      memoryUsageMB
    };

  } finally {
    await browser.close();
  }
}

/**
 * 获取页面内存使用量
 */
async function getMemoryUsage(page) {
  return await page.evaluate(() => {
    return new Promise(resolve => {
      const interval = setInterval(() => {
        const mem = performance.memory;
        if (mem) {
          clearInterval(interval);
          resolve(mem.usedJSHeapSize);
        }
      }, 100);
    });
  });
}

/**
 * 主测试流程
 */
async function main() {
  // 并行测试所有框架
  const testPromises = Object.entries(urls).map(([framework, url]) =>
      testScrollPerformance(url, framework)
  );

  await Promise.all(testPromises);

  // 生成CSV报告
  const csvContent =
      'Framework,Frame Rate (FPS),Main Thread Block Time (ms),Memory Usage (MB)\n' +
      Object.entries(scrollResults)
          .map(([name, data]) =>
              `${name},${data.frameRate.toFixed(2)},${data.mainThreadBlockTime.toFixed(2)},${data.memoryUsageMB.toFixed(2)}`
          )
          .join('\n');

  fs.writeFileSync('scroll_results.csv', csvContent);
  console.log('Scroll performance test completed. Results saved to scroll_results.csv');
}

// 执行测试
main().catch(error => {
  console.error('Test failed:', error);
  process.exit(1);
});
