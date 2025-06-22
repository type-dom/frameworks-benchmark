import {
  Br,
  Button,
  For,
  Head,
  Pre,
  Table,
  TableBody,
  TableDataCell,
  TableRow,
  TypeDiv,
  createStyle,
} from "@type-dom/framework";
import {computed, signal} from "@type-dom/signals";
import {countTime, generateRows} from "utils";

export class List extends TypeDiv {
  className = 'List'

  override setup() {
    createStyle(`
      .highlight {
        background-color: yellow;
      }
      table {
        border-collapse: collapse;
      }
      td {
        border: 1px solid #ccc;
        padding: 4px;
      }
    `)
    const rows = signal<{ id: number, text: string }[]>([])
    const results = signal('')
    const selectedRowId = signal<number | null>(null)

// 1. create rows
    function testCreateRows() {
      return countTime(() => {
        rows.set(generateRows(1000))
        return new Promise<void>(resolve => {
          requestAnimationFrame(() => {
            resolve();
          });
        });
      }, 1, 0)
    }

// 2. replace all rows
    function testReplaceAllRows() {
      return countTime(() => {
        rows.set(generateRows(1000))
        return new Promise<void>(resolve => {
          requestAnimationFrame(() => {
            resolve();
          });
        });
      }, 5, 5)
    }

// 3. partial update
    function testPartialUpdate() {
      rows.set(generateRows(10000))
      return countTime(() => {
        const updated = [...rows.get()]
        for (let i = 0; i < updated.length; i += 10) {
          updated[i].text = `Updated ${Math.random().toFixed(4)}`
        }
        rows.set(updated)
        return new Promise<void>(resolve => {
          requestAnimationFrame(() => {
            resolve();
          });
        });
      }, 5, 5)
    }

// 4. select row
    function testSelectRow() {
      selectedRowId.set(null)
      return countTime(() => {
        selectedRowId.set(Math.floor(Math.random() * rows.get().length))
        return new Promise<void>(resolve => {
          requestAnimationFrame(() => {
            resolve();
          });
        });
      }, 5, 5)
    }

// 5. swap rows
    function testSwapRows() {
      return countTime(() => {
        const list = [...rows.get()]
        const indexA = 10
        const indexB = 20
        ;[list[indexA], list[indexB]] = [list[indexB], list[indexA]]
        rows.set(list)

        return new Promise<void>(resolve => {
          requestAnimationFrame(() => {
            resolve();
          });
        });
      }, 5, 5)
    }

// 6. remove row
    function testRemoveRow() {
      return countTime(() => {
        if (rows.get().length > 0) {
          rows.set(rows.get().slice(1))
        }
        return new Promise<void>(resolve => {
          requestAnimationFrame(() => {
            resolve();
          });
        });
      }, 5, 5)
    }

// 7. create many rows
    function testCreateManyRows() {
      return countTime(() => {
        rows.set(generateRows(10000))

        return new Promise<void>(resolve => {
          requestAnimationFrame(() => {
            resolve();
          });
        });
      }, 1, 0)
    }

// 8. append rows to large table
    function testAppendRowsToLargeTable() {
      const oldLength = rows.get().length
      return countTime(() => {
        const newRows = generateRows(1000).map(r => ({ ...r, id: r.id + oldLength }))
        rows.set([...rows.get(), ...newRows])
        return new Promise<void>(resolve => {
          requestAnimationFrame(() => {
            resolve();
          });
        });
      }, 1, 0)
    }

// 9. clear rows
    function testClearRows() {
      return countTime(() => {
        rows.set([])
        return new Promise<void>(resolve => {
          requestAnimationFrame(() => {
            resolve();
          });
        });
      }, 1, 0)
    }

// 执行所有测试并输出结果
    async function runAllTests() {
      const output = []
      output.push(`create rows: ${await testCreateRows()} ms`)
      output.push(`replace all rows: ${await testReplaceAllRows()} ms`)

      rows.set(generateRows(10000))
      output.push(`partial update: ${await testPartialUpdate()} ms`)

      rows.set(generateRows(1000))
      output.push(`select row: ${await testSelectRow()} ms`)
      output.push(`swap rows: ${await testSwapRows()} ms`)
      output.push(`remove row: ${await testRemoveRow()} ms`)

      output.push(`create many rows: ${await testCreateManyRows()} ms`)

      rows.set(generateRows(10000))
      output.push(`append rows to large table: ${await testAppendRowsToLargeTable()} ms`)
      output.push(`clear rows: ${await testClearRows()} ms`)

      results.set(output.join('\n'))
    }
    this.style.addObj({
      padding: '20px'
    })
    this.addChildren(
      new Head({
        nodeName: 'h2',
        slot: 'TypeDom Performance Tests'
      }),
      new Button({
        attrObj: {
          id: 'rows-test'
        },
        events: {
          click: runAllTests,
        },
        slot: 'Run All Tests'
      }),
      new Br(),
      new Pre({
        attrObj: {
          id: 'rows-results'
        },
        styleObj: {
          whiteSpace: 'pre-wrap'
        },
        slot: results,
      }),
      new Table({
        attrObj: {
          border: 1,
          cellspacing: 0,
          cellpadding: 5,
        },
        slot: new TableBody({
          slot: new For({
            data: rows,
            getter: (item, index) => {
              return new TableRow({
                class: {
                  highlight: computed(() => selectedRowId.get() === index)
                },
                slot: new TableDataCell({
                  slot: item.text
                })
              })
            }
          })
        })
      })
    )
  }
}
