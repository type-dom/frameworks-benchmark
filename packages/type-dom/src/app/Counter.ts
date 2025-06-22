import {computed, signal} from "@type-dom/signals";
import {Button, P, TypeDiv, onUnmounted} from "@type-dom/framework";

export class Counter extends TypeDiv {
   className = 'Counter';

  override setup() {
    // const props = this.props;
    const count = signal(0);
    let updateTime = signal(0);

    // 每秒自动递增
    let countUpdateTime = 0;
    const interval = setInterval(() => {
      if (count.get() === 1000) {
        clearInterval(interval);
        return;
      }
      const startTime = performance.now();
      count.set(count.get() + 1);
      const endTime = performance.now();
      countUpdateTime += endTime - startTime;
      updateTime.set(countUpdateTime);
    }, 10);

    // 清理间隔
    onUnmounted(() => clearInterval(interval));

    // return { count, updateTime };
    this.addChildren(
      new Button({
        attrObj: {
          id: 'counter-btn'
        },
        slot: computed(() => `Count is ${count.get()}`),
        events: {
          click: () => {
            count.set(count.get() + 1)
           }
        }
      }),
      new P({
        slot: computed(() => `Update time is ${updateTime.get()}`)
      })
    )
  }
}
