import puppeteer from 'puppeteer';
import fs from 'fs';

// 测试 URL 列表
const urls = {
  // angular: 'http://localhost:4200',
  react: 'http://localhost:5200',
  solid: 'http://localhost:6200',
  // svelte: 'http://localhost:7200',
  typedom: 'http://localhost:8200',
  vue: 'http://localhost:9200',
};

// 存储内存分析结果
const memoryResults = {};

/**
 * 分析内存使用情况
 */
async function analyzeMemory(url, framework) {
  console.log(`Analyzing memory usage for ${framework}...`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  // 导航到页面并等待加载完成
  await page.goto(url, { waitUntil: 'networkidle0' });

  // 等待关键元素加载（可选）
  try {
    await page.waitForSelector('body', { timeout: 10000 });
  } catch (e) {
    console.warn(`Timeout waiting for body in ${framework}`);
  }

  // 获取性能指标
  const metrics = await page.metrics();

  // 提取内存相关指标
  // console.warn('Memory metrics:', metrics);
  const memoryUsageMB = parseFloat((metrics.JSHeapUsedSize / 1024 / 1024).toFixed(2));
  const totalHeapSizeMB = parseFloat((metrics.JSHeapTotalSize / 1024 / 1024).toFixed(2));
  // const heapLimitMB = parseFloat((metrics.JSHeapSizeLimit / 1024 / 1024).toFixed(2));
  const taskDuration =  parseFloat((metrics.TaskDuration).toFixed(3));
  // 存储结果
  memoryResults[framework] = {
    memoryUsageMB,
    totalHeapSizeMB,
    // heapLimitMB
    taskDuration
  };

  await browser.close();
}

/**
 * 主函数：运行所有框架的内存分析并输出 CSV 结果
 */
async function main() {
  for (const [framework, url] of Object.entries(urls)) {
    await analyzeMemory(url, framework);
  }

  // 构建 CSV 内容
  const csvContent =
    'Framework,Memory Usage (MB),Total Heap Size (MB), Task Duration\n' +
    Object.entries(memoryResults)
      .map(([name, data]) =>
        `${name},${data.memoryUsageMB},${data.totalHeapSizeMB},${data.taskDuration}`
      )
      .join('\n');

  fs.writeFileSync('memory_results.csv', csvContent);
  console.log('Memory analysis completed. Results saved to memory_results.csv');
}

// 执行主流程
main().catch(console.error);
