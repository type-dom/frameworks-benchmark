const lighthouse = require('lighthouse').default;
const chromeLauncher = require('chrome-launcher');

// 启动 Chrome 实例
async function launchChrome() {
    const chrome = await chromeLauncher.launch({
        chromeFlags: ['--headless', '--disable-gpu', '--no-sandbox']
    });
    // console.log('✅ Chrome 启动成功:', chrome); // 检查输出中是否有 wsEndpoint
    return chrome;
}

// 执行 Lighthouse 测试
async function runLighthouse(url, opts, config = null) {
    let chrome;
    try {
        chrome = await launchChrome();
        opts.port = chrome.port;
        const results = await lighthouse(url, opts, config);
        await chrome.kill();
        return results;
    } catch (error) {
        if (chrome) await chrome.kill();
        throw error;
    }
}


// 配置选项
const options = {
    logLevel: 'info',
    output: 'html', // 支持 'html' | 'json' | 'csv'
    onlyCategories: ['performance'] // 仅测试性能
};

// 测试目标 URL
const url = 'http://localhost:9200'; // 替换为你的测试 URL

// 执行测试
runLighthouse(url, options).then(results => {
    // 保存报告
    const fs = require('fs');
    fs.writeFileSync(`report.${options.output}`, results.report);
    console.log('✅ 性能测试完成，报告已生成！');
}).catch(err => {
    console.error('❌ 测试失败:', err);
});
