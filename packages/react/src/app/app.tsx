import { createRoot } from 'react-dom/client';

// 引入组件
import {Counter} from './counter';
import {VirtualList} from './virtual-list';
import {List} from './list';

// 页面组件
export function App() {
  return (
    <div className="app-container">
      <h1>React Performance Test</h1>
      <Counter />
      <VirtualList />
      <List/>
    </div>
  );
}

// 渲染到DOM
const root = createRoot(document.getElementById('root')!);
root.render(<App />);
