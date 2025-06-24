import {TypeRoot, Head, createStyle} from '@type-dom/framework';
import {Counter} from "./Counter";
import {VirtualList} from "./VirtualList";
import {List} from "./List";
import {Rows} from './Rows';

export class AppRoot extends TypeRoot {
  className = 'AppRoot';

  override setup() {
    // return { count, updateTime };
    createStyle(`
      .app-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
      }
    `)
    this.addChildren(
      new Head({
        nodeName: 'h1',
        slot:  'TypeDom Performance Test'
      }),
      new Counter(),
      new VirtualList(),
      new List(),
      new Rows(),
    )
  }
}
