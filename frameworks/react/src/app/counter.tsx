import { useState, useEffect } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);
  const [updateTime, setUpdateTime] = useState(0);

  useEffect(() => {
    let iteration = 0;
    let countUpdateTime = 0;
    const interval = setInterval(() => {
      if (iteration >= 1000) {
        clearInterval(interval);
        return;
      }
      const startTime = performance.now();
      setCount(prev => prev + 1);
      const endTime = performance.now();
      countUpdateTime += endTime - startTime;
      setUpdateTime(countUpdateTime);

      iteration++;
    }, 10);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <button className={'btn btn-primary btn-block'} id="counter-btn" onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>
      <p className={'list-item'}>Update delay: {updateTime} ms</p>
    </div>
  );
}
