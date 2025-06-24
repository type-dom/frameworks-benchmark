import {VirtualList} from "./VirtualList";
import {Counter} from "./Counter";
import {List} from './List';
import {Rows} from './Rows'

export function App() {
  return (
    <>
      <h1>SolidJS Performance Test</h1>
      <Counter />
      <VirtualList/>
      <List/>
      <Rows/>
    </>
  );
}
