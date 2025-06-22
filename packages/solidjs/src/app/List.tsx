// SolidJS Performance Test Component
import { createSignal, onMount } from "solid-js";
import { For } from "solid-js/web";
import {countTime, generateRows} from "utils";

export function List() {
  // 响应式状态
  const [rows, setRows] = createSignal([]);
  const [results, setResults] = createSignal("");
  const [selectedRowId, setSelectedRowId] = createSignal<number | null>(null);

  // 测试函数
  function testCreateRows(): Promise<void> {
    return countTime(() => {
      setRows(generateRows(1000));
      return new Promise<void>(resolve => {
        requestAnimationFrame(() => {
          resolve();
        });
      });
    }, 1, 0);
  }

  function testReplaceAllRows(): Promise<void> {
    return countTime(() => {
      setRows(generateRows(1000));
      return new Promise<void>(resolve => {
        requestAnimationFrame(() => {
          resolve();
        });
      });
    }, 5, 5);
  }

  function testPartialUpdate(): Promise<void> {
    setRows(generateRows(10000));
    return countTime(() => {
      const updated = [...rows()];
      for (let i = 0; i < updated.length; i += 10) {
        updated[i].text = `Updated ${Math.random().toFixed(4)}`;
      }
      setRows(updated);
      return new Promise<void>(resolve => {
        requestAnimationFrame(() => {
          resolve();
        });
      });
    }, 5, 5);
  }

  function testSelectRow(): Promise<void> {
    setSelectedRowId(null);
    return countTime(() => {
      setSelectedRowId(Math.floor(Math.random() * rows().length));
      return new Promise<void>(resolve => {
        requestAnimationFrame(() => {
          resolve();
        });
      });
    }, 5, 5);
  }

  function testSwapRows(): Promise<void> {
    return countTime(() => {
      const list = [...rows()];
      const indexA = 10;
      const indexB = 20;
      [list[indexA], list[indexB]] = [list[indexB], list[indexA]];
      setRows(list);
      return new Promise<void>(resolve => {
        requestAnimationFrame(() => {
          resolve();
        });
      });
    }, 5, 5);
  }

  function testRemoveRow(): Promise<void> {
    return countTime(() => {
      if (rows().length > 0) {
        setRows(rows().slice(1));
        return new Promise<void>(resolve => {
          requestAnimationFrame(() => {
            resolve();
          });
        });
      }
    }, 5, 5);
  }

  function testCreateManyRows(): Promise<void> {
    return countTime(() => {
      setRows(generateRows(10000));
      return new Promise<void>(resolve => {
        requestAnimationFrame(() => {
          resolve();
        });
      });
    }, 1, 0);
  }

  function testAppendRowsToLargeTable(): Promise<void> {
    const oldLength = rows().length;
    return countTime(() => {
      const newRows = generateRows(1000).map((r) => ({ ...r, id: r.id + oldLength }));
      setRows([...rows(), ...newRows]);
      return new Promise<void>(resolve => {
        requestAnimationFrame(() => {
          resolve();
        });
      });
    }, 1, 0);
  }

  function testClearRows(): Promise<void> {
    return countTime(() => {
      setRows([]);
      return new Promise<void>(resolve => {
        requestAnimationFrame(() => {
          resolve();
        });
      });
    }, 1, 0);
  }

  // 运行所有测试
  async function runAllTests() {
    const output: string[] = [];

    output.push(`create rows: ${await testCreateRows()} ms`);
    output.push(`replace all rows: ${await testReplaceAllRows()} ms`);

    setRows(generateRows(10000));
    output.push(`partial update: ${await testPartialUpdate()} ms`);

    setRows(generateRows(1000));
    output.push(`select row: ${await testSelectRow()} ms`);
    output.push(`swap rows: ${await testSwapRows()} ms`);
    output.push(`remove row: ${await testRemoveRow()} ms`);

    output.push(`create many rows: ${await testCreateManyRows()} ms`);

    setRows(generateRows(10000));
    output.push(`append rows to large table: ${await testAppendRowsToLargeTable()} ms`);
    output.push(`clear rows: ${await testClearRows()} ms`);

    setResults(output.join("\n"));
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>SolidJS Performance Tests</h2>
      <button id={'rows-test'} onClick={runAllTests}>Run All Tests</button>
      <br />
      <br />
      <table border={1} cellSpacing="0" cellPadding="5">
        <tbody>
        <For each={rows()}>
          {(row, index) => (
            <tr
              class={selectedRowId() === index() ? "highlight" : ""}
              key={row.id}
            >
              <td>{row.text}</td>
            </tr>
          )}
        </For>
        </tbody>
      </table>
      <pre id={'rows-results'} style={{ whiteSpace: "pre-wrap" }}>{results()}</pre>
    </div>
  );
}
