import {A, Button, Div, For, Head, Span, Table, TableBody, TableDataCell, TableRow, TypeDiv} from "@type-dom/framework";
import {signal} from "@type-dom/signals";
import {buildData} from "./data";

export class Rows extends TypeDiv {
  className = 'Rows';

  override setup() {

    const selected = signal()
    const rows = signal<{ id: number; label: string; }[]>([])

    function setRows(update = rows.get().slice()) {
      rows.set(update)
    }

    function add() {
      rows.set(rows.get().concat(buildData(1000)))
    }

    function remove(id: number) {
      rows.get().splice(
        rows.get().findIndex((d) => d.id === id),
        1
      )
      setRows()
    }

    function select(id: number) {
      selected.set(id)
    }

    function run() {
      setRows(buildData())
      selected.value = undefined
    }

    function update() {
      const _rows = rows.get()
      for (let i = 0; i < _rows.length; i += 10) {
        _rows[i].label += ' !!!'
      }
      setRows()
    }

    function runLots() {
      setRows(buildData(10000))
      selected.set(undefined)
    }

    function clear() {
      setRows([])
      selected.set(undefined)
    }

    function swapRows() {
      const _rows = rows.get();
      if (_rows.length > 998) {
        const d1 = _rows[1]
        const d998 = _rows[998]
        _rows[1] = d998
        _rows[998] = d1
        setRows()
      }
    }
    this.attr.addClass('jumbotron')
    this.addChildren(
      new Div({
        class: 'jumbotron',
        slot: new Div({
          class: 'row',
          slot: [
            new Div({
              class: 'col-md-6',
              slot: new Head({
                nodeName: 'h1',
                slot: 'TypeDom Performance Test',
              })
            }),
            new Div({
              class: 'col-md-6',
              slot: new Div({
                class: 'row',
                slot: [
                  new Div({
                    class: 'col-sm-6 smallpad',
                    slot: new Button({
                      class: 'btn btn-primary btn-block',
                      attrObj: {
                        type: 'button',
                        id: 'run',
                      },
                      events: {
                        click: run,
                      },
                      slot: 'Create 1,000 rows',
                    })
                  }),
                  new Div({
                    class: 'col-sm-6 smallpad',
                    slot: new Button({
                      class: 'btn btn-primary btn-block',
                      attrObj: {
                        type: 'button',
                        id: 'runlots',
                      },
                      events: {
                        click: runLots,
                      },
                      slot: 'Create 10,000 rows',
                    })
                  }),
                  new Div({
                    class: 'col-sm-6 smallpad',
                    slot: new Button({
                      class: 'btn btn-primary btn-block',
                      attrObj: {
                        type: 'button',
                        id: 'add',
                      },
                      events: {
                        click: add,
                      },
                      slot: 'Append 1,000 rows',
                    })
                  }),
                  new Div({
                    class: 'col-sm-6 smallpad',
                    slot: new Button({
                      class: 'btn btn-primary btn-block',
                      attrObj: {
                        type: 'button',
                        id: 'update',
                      },
                      events: {
                        click: update,
                      },
                      slot: 'Update every 10th row',
                    })
                  }),
                  new Div({
                    class: 'col-sm-6 smallpad',
                    slot: new Button({
                      class: 'btn btn-primary btn-block',
                      attrObj: {
                        type: 'button',
                        id: 'clear',
                      },
                      events: {
                        click: clear,
                      },
                      slot: 'Clear',
                    })
                  }),
                  new Div({
                    class: 'col-sm-6 smallpad',
                    slot: new Button({
                      class: 'btn btn-primary btn-block',
                      attrObj: {
                        type: 'button',
                        id: 'swaprows',
                      },
                      events: {
                        click: swapRows,
                      },
                      slot: 'Swap Rows',
                    })
                  })
                ]
              })
            })
          ]
        })
      }),
      new Table({
        class: 'table table-hover table-striped test-data',
        slot: new TableBody({
          slot: new For({
            data: rows,
            getter: ({id, label}) => new TableRow({
              class: { danger: id === selected },
              attrObj: {
                dataLabel: label,
              },
              slot: [
                new TableDataCell({
                  class: 'col-md-1',
                  slot: id,
                }),
                new TableDataCell({
                  class: 'col-md-4',
                  slot: new A({
                    events:  {
                      click: () => select(id),
                    },
                    slot: label,
                  })
                }),
                new TableDataCell({
                  class: 'col-md-1',
                  slot: new A({
                    events: {
                      click: () => remove(id),
                    },
                    slot: new Span({
                      class: 'glyphicon glyphicon-remove',
                      attrObj: {
                        ariaHidden: 'true',
                      }
                    })
                  })
                }),
                new TableDataCell({
                  class: 'col-md-6'
                })
              ]
            })
          })
        })
      }),
      new Span({
        class: 'preloadicon glyphicon glyphicon-remove',
        attrObj: {
          ariaHidden: 'true',
        }
      })
    )
  }
}
