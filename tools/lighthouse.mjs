import { createRequire } from 'node:module';
import fs from 'fs';

// 创建 CommonJS require 函数
const require = createRequire(import.meta.url);

// ✅ 正确导入 CommonJS 模块
const chromeLauncher = require('chrome-launcher');
const lighthouse = require('lighthouse').default;

// 测试 URL 列表
const urls = {
  react: 'http://localhost:5200',
  solid: 'http://localhost:6200',
  vue: 'http://localhost:8200',
  'type-dom': 'http://localhost:9200'
};

// 存储测试结果
const results = {};

// Lighthouse 配置参数
const lhOptions = {
  output: 'json',
  logLevel: 'info',
  defaultViewport: {
    width: 375,
    height: 812,
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    isLandscape: false
  },
  emulatedUserAgent:
      'Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36',
  throttling: {
    rttMs: 144,
    throughputKbps: 300,
    cpuSlowdownMultiplier: 4
  },
  onlyCategories: ['performance'],
  maxWaitForFcp: 60000, // 增加等待 FCP 的时间
  maxWaitForLoad: 90000 // 增加页面加载最大等待时间
};

/**
 * 运行 Lighthouse 性能测试
 */
async function runPerformanceTest(url, framework) {
  console.log(`🚀 Running performance test for ${framework}...`);

  let chrome;
  try {
    chrome = await chromeLauncher.launch({
      chromeFlags: [
        '--headless',
        '--disable-gpu',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage'
      ] });

    // const port = new URL(chrome.wsEndpoint()).port;
    const port = chrome.port;

    const runnerResult = await lighthouse(url, { ...lhOptions, port });
    if (!runnerResult || !runnerResult.lhr) {
      throw new Error('❌ Lighthouse returned empty result');
    }

    const { lhr } = runnerResult;

    const performanceScore = Math.round((lhr.categories.performance.score ?? 0) * 100);
    // console.warn('lhr.audits is ', lhr.audits);
    const fcp = lhr.audits['first-contentful-paint']?.numericValue ?? 0; // First Contentful Paint
    const lcp = lhr.audits['largest-contentful-paint']?.numericValue ?? 0; // Largest Contentful Paint
    const fmp = lhr.audits['first-meaningful-paint']?.numericValue ?? 0; // First Meaningful Paint
    const si = lhr.audits['speed-index']?.numericValue ?? 0; // Speed Index
    const tbt = lhr.audits['total-blocking-time']?.numericValue ?? 0; // Total Blocking Time
    const tti = lhr.audits['time-to-interactive']?.numericValue ?? 0; // Time to Interactive
    const mpf = lhr.audits['max-potential-fid']?.numericValue ?? 0; // Max Potential FID
    const srt = lhr.audits['server-response-time']?.numericValue ?? 0; // Server Response Time
    const interactive = lhr.audits.interactive?.numericValue ?? 0; // Time to Interactive
    const fid = lhr.audits['first-input-delay']?.numericValue ?? 0;
    const cls = lhr.audits['cumulative-layout-shift']?.numericValue ?? 0;

    results[framework] = {
      performanceScore,
      fcp,
      lcp,
      fmp,
      si,
      tbt,
      tti,
      mpf,
      srt,
      interactive,
      fid,
      cls
    };

    console.log(`✅ ${framework} test completed`);
  } catch (error) {
    console.error(`❌ Error running test for ${framework}:`, error.message);
    results[framework] = {
      performanceScore: 0,
      fcp: 'Error',
      lcp: 'Error',
      fmp: 'Error',
      si: 'Error',
      tbt: 'Error',
      tti: 'Error',
      mpf: 'Error',
      srt: 'Error',
      interactive: 'Error',
      fid: 'Error',
      cls: 'Error'
    };
  } finally {
    if (chrome) await chrome.kill();
  }
}

/**
 * 主函数：运行所有框架测试并输出 CSV 结果
 */
async function main() {
  console.log('📊 Starting Lighthouse performance tests...');

  for (const [framework, url] of Object.entries(urls)) {
    await runPerformanceTest(url, framework);
  }

  // 构建 CSV 内容
  const csvContent =
      'Framework,Performance Score,FCP (ms),LCP (ms),FMP(ms),Speed Index(ms), TBT, TTI, MPF, SRT, interactive, FID (ms),CLS\n' +
      Object.entries(results)
          .map(([name, data]) =>
              `${name},${data.performanceScore},${formatMetric(data.fcp)},${formatMetric(data.lcp)},${formatMetric(data.fmp)},${formatMetric(data.si)},${formatMetric(data.tbt)},${formatMetric(data.tti)},${formatMetric(data.mpf)},${formatMetric(data.srt)},${formatMetric(data.interactive)},${formatMetric(data.fid)},${formatMetric(data.cls)}`
          )
          .join('\n');

  fs.writeFileSync('lighthouse_results.csv', csvContent);
  console.log('📊 Performance test completed. Results saved to lighthouse_results.csv');
}

// 辅助函数：格式化指标值
function formatMetric(value) {
  return value !== undefined ? value.toFixed(2) : 'N/A';
}

// 执行主流程
main().catch(console.error);
