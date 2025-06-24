import {TypeDiv, Div, P, createStyle} from '@type-dom/framework';
import { computed, signal } from "@type-dom/signals";

export class VirtualList extends TypeDiv {
  className = 'VirtualList';
  override setup() {
    // 基础配置
    const itemHeight = 50; // 每个列表项高度
    const visibleCount = 10; // 可视区域显示 10 行
    const viewHeight = itemHeight * visibleCount; // 可视区域高度
    const totalItems = 10000; // 总数据量
    // 总高度计算（用于占位）
    const totalHeight = totalItems * itemHeight;

    const scrollTop = signal(0);
    const start = signal(0);
    const end = signal(visibleCount);

    const visibleItems = computed(() => {
      const startIndex = start.get();
      const endIndex = Math.min(end.get(), totalItems);
      const indices = [];
      for (let i = startIndex; i < endIndex; i++) {
        indices.push(i);
      }
      return indices;
    });

    const handleScroll = () => {
      console.warn('handleScroll');
      const container = this.dom!;
      scrollTop.set(container.scrollTop);
      const startIndex = Math.floor(scrollTop.get() / itemHeight);
      start.set(startIndex);
      end.set(startIndex + visibleCount);
    };

    createStyle(`
      .virtual-container {
        position: relative;
        height: ${viewHeight}px;
        width: 300px;
        overflow-y: auto;
        border: 1px solid #ccc;
        will-change: transform;
      }
      .list-item {
        height: ${itemHeight}px;
        line-height: ${itemHeight}px;
        border: 1px solid #eee;
        p {
          height: ${itemHeight}px;
          margin: 0
        }
      }
    `);
    this.attr.addClass('virtual-container');
    this.addEvents({
      scroll: handleScroll
    });
    this.addChild( new Div({
      styleObj: {
        height: `${totalHeight}px` /* 虚拟总高度 */
      },
      slot: new Div({
          styleObj: {
            transform: computed(() => `translateY(${start.get() * itemHeight}px)`),
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%'
          },
          slot: computed(() => visibleItems.get()
            .map(item => new Div({
              class: 'list-item',
              slot: new P({
                slot: () => 'Item ' + (item + 1)
              }),
            })))
        }
      )
    }))
  }
}