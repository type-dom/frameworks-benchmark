// performance-tester.ts
type TestResult = {
  name: string;
  iterations: number;
  totalTime: number;
  avgTime: number;
  memoryUsage?: number;
};

// 工厂函数：创建测试器
function createPerformanceTester(iterations: number = 100) {
  const results: TestResult[] = [];

  // 基础测试函数
  async function runTest<T>(
    name: string,
    setup: () => T,
    action: (target: T) => void
  ): Promise<TestResult> {
    const result: TestResult = {
      name,
      iterations,
      totalTime: 0,
      avgTime: 0
    };

    console.log(`🚀 Starting test: ${name}`);

    // 强制 GC（Chrome/Edge 支持）
    if (typeof window !== "undefined" && "gc" in window) {
      (window as any).gc();
    }

    for (let i = 0; i < iterations; i++) {
      const target = setup();
      const start = performance.now();
      action(target);
      const end = performance.now();
      result.totalTime += end - start;
    }

    result.avgTime = result.totalTime / iterations;

    // 内存占用（需配合浏览器性能面板）
    if (typeof window !== "undefined" && "performance" in window) {
      result.memoryUsage = (performance as any).memory?.usedJSHeapSize;
    }

    results.push(result);
    return result;
  }

  // 生成测试报告
  function generateReport(): void {
    console.log("\n📊 Performance Test Report");
    console.log("=".repeat(60));
    for (const result of results) {
      console.log(
        `${result.name}: ${result.avgTime.toFixed(2)}ms (Total: ${result.totalTime.toFixed(2)}ms)`
      );
      if (result.memoryUsage) {
        console.log(`Memory Usage: ${(result.memoryUsage / 1024 / 1024).toFixed(2)}MB`);
      }
    }
  }

  return {
    runTest,
    generateReport
  };
}

// 实例化测试器（使用工厂函数）
export const tester = createPerformanceTester();

