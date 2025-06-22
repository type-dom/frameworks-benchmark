import { createSignal, createMemo, onMount } from 'solid-js';

export function VirtualList() {
  // 基础配置
  const itemHeight = 50; // 每个列表项高度
  const visibleCount = 10; // 可视区域显示 10 行
  const viewHeight = itemHeight * visibleCount; // 可视区域高度
  const totalItems = 10000; // 总数据量
  // 总高度计算（用于占位）
  const totalHeight = createMemo(() => totalItems * itemHeight);

  // const [data] = createSignal(new Array(10000).fill(null).map((_, index) => ({ index: index + 1 })));
  const [scrollTop, setScrollTop] = createSignal(0);
  const [start, setStart] = createSignal(0);
  const [end, setEnd] = createSignal(visibleCount);

  // 计算可视区域项
  const visibleItems = createMemo(() => {
    const startIndex = start();
    const endIndex = Math.min(end(), totalItems);
    const indices = [];
    for (let i = startIndex; i < endIndex; i++) {
      indices.push(i);
    }
    return indices;
  });

  // 滚动事件处理
  function handleScroll(event) {
    const container = event.target;
    setScrollTop(container.scrollTop);
    setStart(Math.floor(scrollTop() / itemHeight));
    setEnd(start() + visibleCount);
  }

  return (
    <div class='virtual-container' onScroll={handleScroll}>
      {/* 虚拟总高度 */}
      <div style={{ height: `${totalHeight()}px` }}>
        {/* 可视区域内容 */}
        <div
          style={{
            transform: `translateY(${start() * itemHeight}px)`,
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%'
          }}
        >
          {visibleItems().map(item => (
            <div class={'list-item'} key={item}>
              <p>Item {item + 1}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
