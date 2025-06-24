const table = document.getElementById('test-table') as HTMLTableElement;

/**
 * 创建指定数量的表格行
 *
 * 此函数用于在页面表格中动态生成指定数量的行，每行包含一个单元格，用于展示行号
 * 主要用于演示如何通过JavaScript操作DOM来动态改变页面内容
 *
 * @param count 需要创建的行数
 * @returns 返回创建这些行所花费的时间（毫秒）
 */
export function createRows(count: number) {
  // 记录开始时间，用于后续计算创建行所花费的时间
  const start = performance.now();

  // // 清理表格，确保在添加新行之前移除所有现有的行
  // table.innerHTML = '';
  //
  // // 循环创建指定数量的行
  // for (let i = 0; i < count; i++) {
  //   // 创建一个新的行元素
  //   const row = document.createElement('tr');
  //
  //   // 设置行元素的内部HTML，包含当前行号
  //   row.innerHTML = `<td>Row ${i}</td>`;
  //
  //   // 将新创建的行添加到表格中
  //   table.appendChild(row);
  // }
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    const row = document.createElement('tr');
    row.innerHTML = `<td>Row ${i}</td>`;
    fragment.appendChild(row);
  }
  table.appendChild(fragment);
  // 计算并返回创建行所花费的时间
  // return performance.now() - start;
  return new Promise<number>(resolve => {
    requestAnimationFrame(() => {
      resolve(performance.now() - start);
    });
  });
}


export async function replaceAllRows(count: number, warmup: number = 5) {
  // 预热
  for (let i = 0; i < warmup; i++) {
    await createRows(count);
  }

  const start = performance.now();
  await createRows(count);
  // return performance.now() - start;
  return new Promise<number>(resolve => {
    requestAnimationFrame(() => {
      resolve(performance.now() - start);
    });
  });
}

export async function partialUpdate(totalCount: number, step: number = 10, warmup: number = 5) {
  await createRows(totalCount);

  // 预热
  for (let w = 0; w < warmup; w++) {
    for (let i = 0; i < totalCount; i += step) {
      const cell = table.rows[i]?.cells[0];
      if (cell) cell.textContent = `Updated ${i}`;
    }
  }

  const start = performance.now();
  for (let i = 0; i < totalCount; i += step) {
    const cell = table.rows[i]?.cells[0];
    if (cell) cell.textContent = `Updated ${i}`;
  }

  // return performance.now() - start;
  return new Promise<number>(resolve => {
    requestAnimationFrame(() => {
      resolve(performance.now() - start);
    });
  });
}

export async function selectRow(warmup: number = 5) {
  const row = table.rows[0];
  if (!row) return NaN;

  for (let i = 0; i < warmup; i++) {
    row.classList.add('highlight');
    row.classList.remove('highlight');
  }

  const start = performance.now();
  row.classList.add('highlight');

  // return performance.now() - start;
  return new Promise<number>(resolve => {
    requestAnimationFrame(() => {
      resolve(performance.now() - start);
    });
  });
}

export async function swapRows(warmup: number = 5) {
  await createRows(1000);

  for (let i = 0; i < warmup; i++) {
    let row1 = table.rows[10];
    let row2 = table.rows[20];
    if (row1 && row2 && row1.parentNode) {
      row1.parentNode.insertBefore(row2, row1);
    }
  }

  const start = performance.now();

  let row1 = table.rows[10];
  let row2 = table.rows[20];
  if (row1 && row2 && row1.parentNode) {
    row1.parentNode.insertBefore(row2, row1);
  }

  // return performance.now() - start;
  return new Promise<number>(resolve => {
    requestAnimationFrame(() => {
      resolve(performance.now() - start);
    });
  });
}

export async function removeRow(warmup: number = 5) {
  await createRows(1000);

  for (let i = 0; i < warmup; i++) {
    if (table.rows.length > 10) {
      table.deleteRow(10);
    } else {
      console.warn('delete 10 , table.rows.length < 10, table.rows.length is ', table.rows.length)
    }
    // createRows(1);
  }

  const start = performance.now();

  if (table.rows.length > 10) {
    table.deleteRow(10);
  } else {
    console.warn('delete 10, table.rows.length < 10, table.rows.length is ', table.rows.length)
  }

  // return performance.now() - start;
  return new Promise<number>(resolve => {
    requestAnimationFrame(() => {
      resolve(performance.now() - start);
    });
  });
}

export async function createManyRows(count: number = 10000) {
  // return createRows(count);
  const start = performance.now();
  await createRows(count);
  return new Promise<number>(resolve => {
    requestAnimationFrame(() => {
      resolve(performance.now() - start);
    });
  });
}

export async function appendRowsToLargeTable(baseCount: number = 10000, appendCount: number = 1000) {
  await createRows(baseCount);
  const start = performance.now();

  for (let i = baseCount; i < baseCount + appendCount; i++) {
    const row = document.createElement('tr');
    row.innerHTML = `<td>Row ${i}</td>`;
    table.appendChild(row);
  }

  // return performance.now() - start;
  return new Promise<number>(resolve => {
    requestAnimationFrame(() => {
      resolve(performance.now() - start);
    });
  });
}

export async function clearRows(count: number = 10000): Promise<number> {
  await createRows(count);
  const start = performance.now();
  table.innerHTML = '';
  // const long = performance.now() - start;
  return new Promise<number>(resolve => {
    requestAnimationFrame(() => {
      resolve(performance.now() - start);
    });
  });
}

export async function runAllTests(): Promise<void> {
  const div = document.getElementById('rows-div')!;
  div.innerHTML = '';
  const output = []
  output.push("create rows:" + await createRows(1000) + "ms");
  output.push("replace all rows:" + await replaceAllRows(1000) + "ms");

  output.push("partial update:" + await partialUpdate(10000) + "ms");
  // console.log('selectRow() is ', await selectRow());
  const selectLong = await selectRow();
  output.push("select row:" + selectLong + "ms");
  output.push("swap rows:" + await swapRows() + "ms");
  output.push("remove row:" + await removeRow() + "ms");

  output.push("create many rows:" + await createManyRows() + "ms");

  output.push("append rows to large table:" + await appendRowsToLargeTable() + "ms");
  output.push("clear rows:" + await clearRows() + "ms");
  const pre = document.createElement('pre');
  pre.setAttribute('id', 'rows-results')
  pre.innerHTML = output.join('\n');
  div.appendChild(pre);
}

// 暴露给全局作用域，供 HTML 中调用
(window as any).runAllTests = runAllTests;
