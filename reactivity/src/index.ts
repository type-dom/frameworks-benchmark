import { dynamicBench } from "./benches/reactively/dynamicBench.js";
import { cellxbench } from "./benches/cellxBench.js";
import { sbench } from "./benches/sBench.js";
import { molBench } from "./benches/molBench.js";
import { kairoBench } from "./benches/kairoBench.js";

import { memoryBench } from "./benches/memoryUsage.js";
import { propagateBench } from "./benches/propagate.js";

import { promiseDelay } from "./util/asyncUtil.js";
import type { FrameworkInfo } from "./types/frameworkTypes.js";

export type { ReactiveFramework } from "./types/reactiveFramework.js";
import {
  perfResultHeaders,
  formatPerfResult,
  formatPerfResultStrings,
  type PerfResult,
  // type PerfResultStrings,
  type PerfResultCallback,
} from "./util/perfLogging.js";
import { frameworkInfo } from "./frameworksList.js";

export async function runTests(
  frameworkInfo: FrameworkInfo[],
  logPerfResult: PerfResultCallback,
) {
  await promiseDelay(0);

  console.warn('runTests, frameworkInfo is ', frameworkInfo);
  for (const { framework } of frameworkInfo) {
    await kairoBench(framework, logPerfResult);
    await promiseDelay(1000);
  }

  for (const { framework } of frameworkInfo) {
    await molBench(framework, logPerfResult);
    await promiseDelay(1000);
  }

  for (const { framework } of frameworkInfo) {
    await sbench(framework, logPerfResult);
    await promiseDelay(1000);
  }

  for (const { framework } of frameworkInfo) {
    await cellxbench(framework, logPerfResult);
    await promiseDelay(1000);
  }

  for (const frameworkTest of frameworkInfo) {
    await dynamicBench(frameworkTest, logPerfResult);
    await promiseDelay(1000);
  }

  for (const { framework } of frameworkInfo) {
    // console.warn('then memoryBench . '); // node 端运行
    await memoryBench(framework, logPerfResult);
    await promiseDelay(1000);
  }

  for (const { framework } of frameworkInfo) {
    await propagateBench(framework, logPerfResult);
    await promiseDelay(1000);
  }

}


function logLine(line: string): void {
  console.log(line);
}

function logPerfResult(result: PerfResult): void {
  logLine(formatPerfResult(result));
}

async function main() {
  logLine(formatPerfResultStrings(perfResultHeaders()));
  await runTests(frameworkInfo, logPerfResult);
}

main();
