import {VirtualList} from "./VirtualList";
import {Counter} from "./Counter";
import {List} from './List';

export function App() {
  return (
    <>
      <h1>SolidJS Performance Test</h1>
      <Counter />
      <VirtualList/>
      <List/>
    </>
  );
}
