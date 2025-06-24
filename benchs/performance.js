const puppeteer = require('puppeteer');
const lighthouse = require('lighthouse').default;
// const { launch } = lighthouse;
const fs = require('fs');
// const path = require('path');

// 配置项
const FRAMEWORKS = [
    // { name: 'Angular', url: 'http://localhost:4200' },
    { name: 'React', url: 'http://localhost:5200' },
    { name: 'Solidjs', url : 'http://localhost:6200' },
    // { name: 'Svelte', url: 'http://localhost:7200' },
    { name: 'type-dom', url:  'http://localhost:8200' },
    { name: 'Vue', url: 'http://localhost:9200' },
];

const TEST_RUNS = 1; // 每个框架测试次数

// 辅助函数：计算平均值、中值、最大值、最小值
function calculateStats(values) {
    if (!values.length) return {};
    values.sort((a, b) => a - b);
    const sum = values.reduce((acc, val) => acc + val, 0);
    const avg = sum / values.length;
    const median = values[Math.floor(values.length / 2)];
    const min = Math.min(...values);
    const max = Math.max(...values);
    return { avg, median, min, max };
}

// 主测试函数
async function runTests() {
    const results = [];

    for (const framework of FRAMEWORKS) {
        console.log(`🚀 测试框架: ${framework.name}`);
        const allRuns = [];

        for (let i = 0; i < TEST_RUNS; i++) {
            const browser = await puppeteer.launch({ headless: true });
            const page = await browser.newPage();
            const client = await page.target().createCDPSession();

            try {
                // 1. 导航页面
                await page.goto(framework.url, { waitUntil: 'networkidle2' });

                // 2. 获取基础性能指标
                const metrics = await page.metrics();
                console.log('🚀 获取基础性能指标: ', metrics)
                // const fcp = metrics.FCP;
                // const tti = metrics.TTI;
                // const lcp = metrics.LCP;
                // const loadTime = metrics.loadEventEnd - metrics.navigationStart;

                // 3. 获取内存和 CPU 使用率
                await client.send('Performance.enable');
                const performanceMetrics = await client.send('Performance.getMetrics');
                console.log('🚀 获取内存和 CPU 使用率: ', performanceMetrics)
                const memory = performanceMetrics.metrics.find(m => m.name === 'JSHeapUsedSize')?.value || 0;
                const cpuUsage = performanceMetrics.metrics.find(m => m.name === 'CPUTimeUsed')?.value || 0;

                // 4. 虚拟列表滚动性能测试
                const scrollFPS = await page.evaluate(() => {
                    let frames = 0;
                    const virtualList = document.querySelector('.virtual-list');
                    if (!virtualList) {
                        console.error('❌ .virtual-list 元素未找到');
                        return 0;
                    }

                    // 滚动虚拟列表
                    const start = performance.now();
                    const interval = setInterval(() => {
                        virtualList.scrollTo(0, virtualList.scrollTop + 100);
                        if (performance.now() - start > 3000) clearInterval(interval);
                    }, 16);

                    // 记录帧数
                    const raf = requestAnimationFrame(() => {
                        frames++;
                        if (performance.now() - start < 3000) requestAnimationFrame(raf);
                    });

                    return new Promise(resolve => {
                        setTimeout(() => resolve(frames / 3), 3000); // 3秒内的平均帧率
                    });
                });

                // 5. 事件响应时间测试
                const eventResponseTime = await page.evaluate(() => {
                    let responseTime = 0;
                    const button = document.querySelector('#counter-btn');
                    console.log('🚀 获取事件响应时间测试, button: ', button)
                    if (button) {
                        button.addEventListener('click', () => {
                            responseTime = performance.now() - button.dataset.timestamp;
                        });
                        button.click(); // 模拟点击
                    }
                    return responseTime;
                });

                // 6. Lighthouse 报告
                const lighthouseOptions = {
                    port: Number(browser.wsEndpoint().match(/ws:.*:(\d+)/)[1]),
                    output: 'json',
                    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo', 'pwa'],
                };
                console.warn('🚀 测试 Lighthouse...lighthouseOptions is ', lighthouseOptions);

                const runnerResult = await lighthouse(framework.url, lighthouseOptions);
                console.log('🚀 获取 Lighthouse 报告 runnerResult.lhr.audits : ', runnerResult.lhr.audits);
                // 新增 CLS 和 FCP 到 TTI 间隔时间
                const cls = runnerResult.lhr.audits['cumulative-layout-shift'].numericValue;
                const fcp = runnerResult.lhr.audits['first-contentful-paint'].numericValue;
                const tti = runnerResult.lhr.audits['interactive'].numericValue;
                const lcp  = runnerResult.lhr.audits['largest-contentful-paint'].numericValue;
                //  metrics.loadEventEnd - metrics.navigationStart;
                // const loadEventEnd = runnerResult.lhr.audits['load-event-end'].numericValue;
                // const navigationStart = runnerResult.lhr.audits['navigation-start'].numericValue;
                // const loadTime  = loadEventEnd - navigationStart;
                // const fcpToTtiGap = tti - fcp;
                // console.log('🚀 新增 CLS 和 FCP 到 TTI 间隔时间: ', cls, fcpToTtiGap)

                // 7. 资源统计
                const resourceStats = await page.evaluate(() => {
                    const resources = performance.getEntriesByType('resource');
                    console.log('🚀 获取资源统计: ', resources);
                    return {
                        totalRequests: resources.length,
                        totalSize: resources.reduce((sum, r) => sum + r.transferSize, 0),
                        staticSize: resources
                            .filter(r => r.name.includes('.js') || r.name.includes('.css'))
                            .reduce((sum, r) => sum + r.transferSize, 0),
                        dynamicSize: resources
                            .filter(r => !r.name.includes('.js') && !r.name.includes('.css'))
                            .reduce((sum, r) => sum + r.transferSize, 0),
                    };
                });
                console.log('🚀 获取资源统计 resourceStats: ', resourceStats)
                // 整合结果
                allRuns.push({
                    fcp,
                    tti,
                    lcp,
                    // loadTime,
                    memory,
                    cpuUsage,
                    scrollFPS,
                    eventResponseTime,
                    lighthouseScore: runnerResult.lhr.categories.performance.score * 100,
                    cls,
                    // fcpToTtiGap,
                    ...resourceStats,
                });

                console.log(`✅ 第 ${i + 1} 次测试完成`);
            } catch (error) {
                console.error(`❌ 第 ${i + 1} 次测试失败: ${error.message}`);
            } finally {
                await browser.close();
            }
        }

        // 统计结果
        const stats = {
            framework: framework.name,
            ...Object.entries(calculateStats(allRuns.map(r => r.fcp))).reduce((acc, [key, value]) => ({ ...acc, [`fcp_${key}`]: value }), {}),
            ...Object.entries(calculateStats(allRuns.map(r => r.tti))).reduce((acc, [key, value]) => ({ ...acc, [`tti_${key}`]: value }), {}),
            ...Object.entries(calculateStats(allRuns.map(r => r.lcp))).reduce((acc, [key, value]) => ({ ...acc, [`lcp_${key}`]: value }), {}),
            ...Object.entries(calculateStats(allRuns.map(r => r.loadTime))).reduce((acc, [key, value]) => ({ ...acc, [`loadTime_${key}`]: value }), {}),
            ...Object.entries(calculateStats(allRuns.map(r => r.memory))).reduce((acc, [key, value]) => ({ ...acc, [`memory_${key}`]: value }), {}),
            ...Object.entries(calculateStats(allRuns.map(r => r.cpuUsage))).reduce((acc, [key, value]) => ({ ...acc, [`cpuUsage_${key}`]: value }), {}),
            ...Object.entries(calculateStats(allRuns.map(r => r.scrollFPS))).reduce((acc, [key, value]) => ({ ...acc, [`scrollFPS_${key}`]: value }), {}),
            ...Object.entries(calculateStats(allRuns.map(r => r.eventResponseTime))).reduce((acc, [key, value]) => ({ ...acc, [`eventResponseTime_${key}`]: value }), {}),
            ...Object.entries(calculateStats(allRuns.map(r => r.lighthouseScore))).reduce((acc, [key, value]) => ({ ...acc, [`lighthouseScore_${key}`]: value }), {}),
            ...Object.entries(calculateStats(allRuns.map(r => r.cls))).reduce((acc, [key, value]) => ({ ...acc, [`cls_${key}`]: value }), {}),
            ...Object.entries(calculateStats(allRuns.map(r => r.fcpToTtiGap))).reduce((acc, [key, value]) => ({ ...acc, [`fcpToTtiGap_${key}`]: value }), {}),
            ...Object.entries(calculateStats(allRuns.map(r => r.totalRequests))).reduce((acc, [key, value]) => ({ ...acc, [`totalRequests_${key}`]: value }), {}),
            ...Object.entries(calculateStats(allRuns.map(r => r.totalSize))).reduce((acc, [key, value]) => ({ ...acc, [`totalSize_${key}`]: value }), {}),
            ...Object.entries(calculateStats(allRuns.map(r => r.staticSize))).reduce((acc, [key, value]) => ({ ...acc, [`staticSize_${key}`]: value }), {}),
            ...Object.entries(calculateStats(allRuns.map(r => r.dynamicSize))).reduce((acc, [key, value]) => ({ ...acc, [`dynamicSize_${key}`]: value }), {}),
        };

        results.push(stats);
    }

    console.warn('results is ', results);
    console.warn('results is ', results.map(r => Object.values(r).join(',')));
    // 输出 CSV
    const csvHeader = Object.keys(results[0]).join(',');
     console.log(csvHeader);
    const csvRows = results.map(r => Object.values(r).map(v => v).join(','));
    const csvContent = [csvHeader, ...csvRows].join('\n');

    fs.writeFileSync('framework-performance-results.csv', csvContent);
    console.log('📊 测试结果已保存至 framework-performance-results.csv');
}

// 执行测试
runTests();
