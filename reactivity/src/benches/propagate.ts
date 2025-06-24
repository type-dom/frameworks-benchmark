import { bench, boxplot, run } from 'mitata';
import {PerfResultCallback} from "../util/perfLogging.js";
import { Computed, ReactiveFramework, Signal } from "../types/reactiveFramework.js";

export async function propagateBench(
    framework: ReactiveFramework,
    logPerfResult: PerfResultCallback,
) {
    boxplot(async () => {
        console.warn('framework: ', framework.name);
        bench('propagate: $w * $h', function* (state: any) {
            const w = state.get('w');
            const h = state.get('h');
            const src = framework.signal(1);
            for (let i = 0; i < w; i++) {
                let last: Signal<number> | Computed<number> = src;
                for (let j = 0; j < h; j++) {
                    const prev = last;
                    last = framework.computed(() => prev.read() + 1);
                }
                framework.effect(() => last.read());
            }
            yield () => src.write(src.read() + 1);
        })
            .args('h', [1, 10, 100])
            .args('w', [1, 10, 100]);
    });
    await run({ format: 'markdown' });
}
