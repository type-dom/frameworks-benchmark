import {createSignal, onCleanup} from "solid-js";

export const Counter = () => {
  const [count, setCount] = createSignal(0);
  const [updateTime, setUpdateTime] = createSignal(0);

  let countUpdateTime = 0;
  // 每秒自动递增
  const interval = setInterval(() => {
    if (count() === 1000) {
      clearInterval(interval);
      return;
    }
    const startTime = performance.now();
    setCount(c => c + 1);
    const endTime = performance.now();
    countUpdateTime += endTime - startTime;
    setUpdateTime(countUpdateTime);
  }, 10);

  // 清理间隔
  onCleanup(() => clearInterval(interval));

  return (
    <div>
      <button className={"btn btn-primary btn-lg"} id="counter-btn" onClick={() => setCount(count() + 1)}>
        Count: {count()}
      </button>
      <p className={'list-item'}>Update delay: {updateTime()} ms</p>
    </div>
  );
}
