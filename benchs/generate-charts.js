const fs = require('fs');
const { parse } = require('csv-parser');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const { promises: fsPromises } = require('fs-extra');

const width = 800;
const height = 600;

// 创建输出目录
async function createOutputDir() {
    await fsPromises.ensureDir('charts');
}

// 生成柱状图
async function generateBarChart(data, metric) {
    const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });
    const labels = data.map(d => d.framework);
    const values = data.map(d => parseFloat(d[`${metric}_avg`]));

    const config = {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: `Average ${metric.toUpperCase()}`,
                data: values,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: false,
            scales: { y: { beginAtZero: true } },
            plugins: {
                title: { display: true, text: `Average ${metric.toUpperCase()} by Framework` },
                legend: { display: false }
            }
        }
    };

    const imageBuffer = await chartJSNodeCanvas.renderToBuffer(config);
    await fsPromises.writeFile(`charts/${metric}-bar.png`, imageBuffer);
    console.log(`✅ 柱状图已生成: ${metric}-bar.png`);
}

// 主函数
async function main() {
    try {
        await createOutputDir();
        const data = await fs.readFileSync('framework-performance-results.csv', 'utf-8');
        const parser = parse({ delimiter: ',', columns: true });
        const results = [];

        parser.on('data', (row) => results.push(row));
        parser.on('end', async () => {
            const metrics = [
                'fcp', 'tti', 'lcp', 'loadTime', 'memory', 'cpuUsage',
                'eventResponseTime', 'lighthouseScore', 'cls', 'fcpToTtiGap', 'scrollFPS'
            ];
            for (const metric of metrics) {
                await generateBarChart(results, metric);
            }
        });
        parser.write(data);
        parser.end();
    } catch (error) {
        console.error('❌ 图表生成失败:', error.message);
    }
}

main();