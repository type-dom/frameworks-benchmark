import { useState } from 'react';
import {countTime, generateRows} from "utils";

export function List() {
  const [rows, setRows] = useState([] as { id: number, text: string }[]);
  const [selectedRowId, setSelectedRowId] = useState<any>(null);
  const [results, setResults] = useState('');


  // 1. create rows
  const testCreateRows: () => Promise<number> = () => {
    return countTime(() => {
      setRows(generateRows(1000));

      return new Promise<void>(resolve => {
        requestAnimationFrame(() => {
          resolve();
        });
      });
    }, 1, 0);
  };

  // 2. replace all rows
  const testReplaceAllRows: () => Promise<number> = () => {
    return countTime(() => {
      setRows(generateRows(1000));

      return new Promise<void>(resolve => {
        requestAnimationFrame(() => {
          resolve();
        });
      });
    }, 5, 5);
  };

  // 3. partial update
  const testPartialUpdate: () => Promise<number> = () => {
    setRows(generateRows(10000)); // 初始化大表
    return countTime(() => {
      const updated = [...rows];
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
  };

  // 4. select row
  const testSelectRow: () => Promise<number> = () => {
    setSelectedRowId(null);
    return countTime(() => {
      setSelectedRowId(Math.floor(Math.random() * rows.length));

      return new Promise<void>(resolve => {
        requestAnimationFrame(() => {
          resolve();
        });
      });
    }, 5, 5);
  };

  // 5. swap rows
  const testSwapRows: () => Promise<number> = () => {
    return countTime(() => {
      const list = [...rows];
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
  };

  // 6. remove row
  const testRemoveRow: () => Promise<number> = () => {
    return countTime(() => {
      if (rows.length > 0) {
        setRows(rows.slice(1));
      }

      return new Promise<void>(resolve => {
        requestAnimationFrame(() => {
          resolve();
        });
      });
    }, 5, 5);
  };

  // 7. create many rows
  const testCreateManyRows: () => Promise<number> = () => {
    return countTime(() => {
      setRows(generateRows(10000));

      return new Promise<void>(resolve => {
        requestAnimationFrame(() => {
          resolve();
        });
      });
    }, 1, 0);
  };

  // 8. append rows to large table
  const testAppendRowsToLargeTable: () => Promise<number> = () => {
    const oldLength = rows.length;
    return countTime(() => {
      const newRows = generateRows(1000).map(r => ({ ...r, id: r.id + oldLength }));
      setRows([...rows, ...newRows]);

      return new Promise<void>(resolve => {
        requestAnimationFrame(() => {
          resolve();
        });
      });
    }, 1, 0);
  };

  // 9. clear rows
  const testClearRows: () => Promise<number> = () => {
    return countTime(() => {
      setRows([]);

      return new Promise<void>(resolve => {
        requestAnimationFrame(() => {
          resolve();
        });
      });
    }, 1, 0);
  };

  // 运行所有测试
  const runAllTests = async () => {
    const output = [];

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

    setResults(output.join('\n'));
    return output.join('\n');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>React Performance Tests</h2>
      <button id={'rows-test'} onClick={runAllTests}>Run All Tests</button>
      <br /><br />
      <table border={1} cellPadding="5" cellSpacing="0">
        <tbody>
        {rows.map(row => (
          <tr key={row?.id} className={selectedRowId === row?.id ? 'highlight' : ''}>
            <td>{row?.text}</td>
          </tr>
        ))}
        </tbody>
      </table>
      <pre id={'rows-results'} style={{ whiteSpace: 'pre-wrap', marginTop: '20px' }}>{results}</pre>
      <style>
        {`
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
        `}
      </style>
    </div>
  );
}
