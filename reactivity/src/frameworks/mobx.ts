import {computed, observable, autorun, runInAction, action} from "mobx";
import { ReactiveFramework } from "../types/reactiveFramework.js";

let toCleanup: (() => void)[] = [];
export const mobxFramework: ReactiveFramework = {
  name: "MobX",
  signal(initial) {
    const s = observable.box(initial, { deep: false });
    return {
      read: () => s.get(),
      write: action((x) => {
        s.set(x);
      }),
    };
  },
  computed: (fn) => {
    const read = computed(fn);
    return {
      read: () => read.get(),
    };
  },
  effect: (fn) => toCleanup.push(autorun(fn)),
  withBatch: (fn) => runInAction(fn),
  withBuild: (fn) => fn(),
  cleanup: () => {
    for (const cleanup of toCleanup) {
      cleanup();
    }
    toCleanup = [];
  },
};
