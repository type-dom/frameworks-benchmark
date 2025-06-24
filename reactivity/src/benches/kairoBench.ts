import { avoidablePropagation } from "./kairo/avoidable.js";
import { broadPropagation } from "./kairo/broad.js";
import { deepPropagation } from "./kairo/deep.js";
import { diamond } from "./kairo/diamond.js";
import { mux } from "./kairo/mux.js";
import { repeatedObservers } from "./kairo/repeated.js";
import { triangle } from "./kairo/triangle.js";
import { unstable } from "./kairo/unstable.js";
import { nextTick } from "../util/asyncUtil.js";
import { fastestTest } from "../util/benchRepeat.js";
import { ReactiveFramework } from "../types/reactiveFramework.js";
import { PerfResultCallback } from "../util/perfLogging.js";

const cases = [
  { name: "avoidablePropagation", fn: avoidablePropagation },
  { name: "broadPropagation", fn: broadPropagation },
  { name: "deepPropagation", fn: deepPropagation },
  { name: "diamond", fn: diamond },
  { name: "mux", fn: mux },
  { name: "repeatedObservers", fn: repeatedObservers },
  { name: "triangle", fn: triangle },
  { name: "unstable", fn: unstable },
];

export async function kairoBench(
  framework: ReactiveFramework,
  logPerfResult: PerfResultCallback,
) {
  // console.warn('kairo bench . ');
  for (const c of cases) {
    const iter = framework.withBuild(() => {
      const iter = c.fn(framework);
      return iter;
    });

    iter();
    iter();

    await nextTick();
    iter();

    const { timing } = await fastestTest(5, () => {
      for (let i = 0; i < 1000; i++) {
        iter();
      }
    });

    framework.cleanup();
    if (globalThis.gc) gc!(), gc!();

    logPerfResult({
      framework: framework.name,
      test: c.name,
      time: timing.time,
    });
  }
}
