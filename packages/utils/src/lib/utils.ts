export function utils(): string {
  return 'utils';
}


// 初始化数据模型
export function generateRows(n) {
  const data = [];
  for (let i = 0; i < n; i++) {
    data.push({ id: i, text: `Row ${i}` });
  }
  return data;
}


// 工具函数：测量执行时间
export async function countTime(fn: () => Promise<void>, iterations = 1, warmup = 0) {
  for (let i = 0; i < warmup; i++) await fn() // Warmup
  let totalTime = 0
  for (let i = 0; i < iterations; i++) {
    const start = performance.now()
    await fn()
    const end = performance.now()
    totalTime += end - start
  }
  return totalTime / iterations
}
