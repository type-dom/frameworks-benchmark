import type { FrameworkInfo } from "./types/frameworkTypes.js";
import { alienFramework } from "./frameworks/alienSignals.js";
import { angularFramework as angularFramework2 } from "./frameworks/angularSignals2.js";

import { mobxFramework } from "./frameworks/mobx.js";
import { preactSignalFramework } from "./frameworks/preactSignals.js";
import { reactivelyFramework } from "./frameworks/reactively.js";

import { solidFramework } from "./frameworks/solid.js";
import { potaFramework } from "./frameworks/pota.js";
import { svelteFramework } from "./frameworks/svelte.js";
// import { tansuFramework } from "./frameworks/tansu";
// import { usignalFramework } from "./frameworks/uSignal.js";
import { vueReactivityFramework } from "./frameworks/vueReactivity.js";
// import { xReactivityFramework } from "./frameworks/xReactivity";

// Currently failing kairoBench tests
// import { molWireFramework } from "./frameworks/molWire";

// Disabled until cleanup performance is fixed
// import { tc39SignalsFramework } from "./frameworks/tc39signals";

// Currently failing cellx tests
// import { obyFramework } from "./frameworks/inactive/oby";
import { typeFramework } from "./frameworks/typedomSignals.js";

export const frameworkInfo: FrameworkInfo[] = [
  { framework: typeFramework, testPullCounts: true },
  { framework: alienFramework, testPullCounts: true },
  { framework: angularFramework2, testPullCounts: true },
  // { framework: compostateFramework, testPullCounts: true },
  { framework: mobxFramework, testPullCounts: true },
  { framework: preactSignalFramework, testPullCounts: true },
  { framework: reactivelyFramework, testPullCounts: true },
  { framework: solidFramework }, // solid can't testPullCounts because batch executes all leaf nodes even if unread
  { framework: potaFramework },
  { framework: svelteFramework, testPullCounts: true },
  // { framework: tansuFramework, testPullCounts: true },
  // { framework: tc39SignalsFramework, testPullCounts: true },
  { framework: vueReactivityFramework, testPullCounts: true },
  // { framework: xReactivityFramework, testPullCounts: true },
];
