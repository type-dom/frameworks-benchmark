import { useState, useRef } from 'react';
import { FixedSizeList as List } from 'react-window';
import styles from './virtual-list.module.css';
const Row = ({ index, style }: any) => (
  <div className={styles['list-item']} style={style}>
    <p>Item {index + 1}</p>
  </div>
);

export function VirtualList() {
  // const [data] = useState(new Array(10000).fill(null));
  const [, setStart] = useState(0);
  const [, setEnd] = useState(20);
  const listRef = useRef(null);

  const handleScroll = () => {
    const { scrollTop, clientHeight } = listRef.current!;
    const { itemSize } = listRef.current!;
    const startIndex = Math.floor(scrollTop / itemSize);
    setStart(startIndex);
    setEnd(startIndex + Math.ceil(clientHeight / itemSize));
  };

  return (
    <div className={styles['virtual-container']} onScroll={handleScroll}>
      <List
        ref={listRef}
        height={500}
        width={300}
        itemSize={50}
        itemCount={10000}
      >
        {Row}
      </List>
    </div>
  );
}