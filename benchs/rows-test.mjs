import puppeteer from 'puppeteer';
import fs from 'fs';

// 测试URL列表
const urls = {
  'vanilla': 'http://localhost:2200',
  // 'angular': 'http://localhost:4200',
  'react': 'http://localhost:5200',
  'solid': 'http://localhost:6200',
  // 'svelte': 'http://localhost:7200',
  'vue': 'http://localhost:9200',
  'type-dom': 'http://localhost:8200',
};

// 测试结果对象
const results = {};

// 测试函数：测量点击延迟
async function testRows(url, framework) {
  console.log(`Testing click rows for ${framework}...`);

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
  let rowsResults = {
    createRows: 0,
    replaceAllRows: 0,
    partialUpdate: 0,
    selectRow: 0,
    swapRows: 0,
    removeRow: 0,
    createManyRows: 0,
    appendRowsToLargeTable: 0,
    clearRows: 0,
  };
  for (let i = 0; i < 10; i++) {
    // await page.waitForFunction(() => {
    //   let pre = document.getElementById('rows-results');
    //   return pre.remove();
    // }, { timeout: 1000 });

    // 等待按钮可用并点击
    await page.waitForSelector('#rows-test', { timeout: 10000 });
    await page.click('#rows-test');

    // 等待 <pre id="rows-results"> 出现并包含内容
    await page.waitForFunction(() => {
      const pre = document.getElementById('rows-results');
      return pre && pre.textContent.trim().length > 0;
    }, { timeout: 100000 });

    // 获取 <pre> 标签的内容
    const resultText = await page.evaluate(() => {
      return document.getElementById('rows-results').textContent.trim();
    });
    function parseResults(text) {
      const lines = text.trim().split('\n');
      const data = {};
      for (const line of lines) {
        const [key, value] = line.split(':');
        if (key && value) {
          data[key.trim()] = parseFloat(value.replace('ms', '').trim());
        }
      }
      return data;
    }
    const parsed = parseResults(resultText);
    // console.log('parsed is ', parsed);
    // 存入数组
    rowsResults.createRows +=  parsed['create rows'];
    rowsResults.replaceAllRows +=  parsed['replace all rows'];
    rowsResults.partialUpdate +=  parsed['partial update'];
    rowsResults.selectRow +=  parsed['select row'];
    rowsResults.swapRows +=  parsed['swap rows'];
    rowsResults.removeRow +=  parsed['remove row'];
    rowsResults.createManyRows +=  parsed['create many rows'];
    rowsResults.appendRowsToLargeTable +=  parsed['append rows to large table'];
    rowsResults.clearRows +=  parsed['clear rows'];
    // console.log('rowsResults is ', rowsResults);
  }

  // averageDelay /= 10;
  // rowsResults.createRows /= 10;
  // rowsResults.replaceAllRows /= 10;
  // rowsResults.partialUpdate /= 10;
  // rowsResults.selectRow /= 10;
  // rowsResults.swapRows /= 10;
  // rowsResults.removeRow /= 10;
  // rowsResults.createManyRows /= 10;
  // rowsResults.appendRowsToLargeTable /= 10;
  // rowsResults.clearRows /= 10;

  // 存储结果
  results[framework] = {
    createRows: rowsResults.createRows.toFixed(2),
    replaceAllRows: rowsResults.replaceAllRows.toFixed(2),
    partialUpdate: rowsResults.partialUpdate.toFixed(2),
    selectRow: rowsResults.selectRow.toFixed(2),
    swapRows: rowsResults.swapRows.toFixed(2),
    removeRow: rowsResults.removeRow.toFixed(2),
    createManyRows: rowsResults.createManyRows.toFixed(2),
    appendRowsToLargeTable: rowsResults.appendRowsToLargeTable.toFixed(2),
    clearRows: rowsResults.clearRows.toFixed(2),
  };

  // 关闭浏览器
  await browser.close();
}

// 遍历所有框架进行测试
async function main() {
  for (const [framework, url] of Object.entries(urls)) {
    await testRows(url, framework);
  }

  // 将结果保存为CSV文件
  const csvContent = 'Framework, Create Rows, Replace All Rows, Partial Update, Select Row, Swap Rows, Remove Row, Create Many Rows, Append Rows to Large Table, Clear Rows\n' +
      Object.entries(results).map(([framework, data]) =>
          `${framework},${data.createRows},${data.replaceAllRows},${data.partialUpdate},${data.selectRow},${data.swapRows},${data.removeRow},${data.createManyRows},${data.appendRowsToLargeTable},${data.clearRows}`
      ).join('\n');

  fs.writeFileSync('rows_results.csv', csvContent);
  console.log('Rows test completed. Results saved to rows_results.csv');
}

// 运行测试
await main();
