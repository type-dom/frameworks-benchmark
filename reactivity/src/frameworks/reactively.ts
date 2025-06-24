import { Reactive, stabilize } from "@reactively/core";
import { ReactiveFramework } from "../types/reactiveFramework.js";

export const reactivelyFramework: ReactiveFramework = {
  name: "Reactively",
  signal: (initialValue) => {
    const r = new Reactive(initialValue);
    return {
      write: (v) => r.set(v),
      read: () => r.get(),
    };
  },
  computed: (fn) => {
    const r = new Reactive(fn);
    return {
      read: () => r.get(),
    };
  },
  effect: (fn) => new Reactive(fn, true),
  withBatch: (fn) => {
    fn();
    stabilize();
  },
  withBuild: (fn) => fn(),
  cleanup: () => {
    // TODO: reactively doesn't support cleaning up effects yet
  },
};
