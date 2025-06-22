// /**
//  * 前端框架性能测试类
//  */
// export class PerformanceTester {
//   /**
//    * 创建指定数量的行
//    * @param {number} count 行数
//    * @returns {number} 耗时（毫秒）
//    */
//   createRows(count: number): number {
//     const start = performance.now();
//     this._clearTable();
//
//     for (let i = 0; i < count; i++) {
//       const row = document.createElement('tr');
//       row.innerHTML = `<td>Row ${i}</td>`;
//       this._appendRow(row);
//     }
//
//     return performance.now() - start;
//   }
//
//   /**
//    * 替换所有行
//    * @param {number} count 行数
//    * @param {number} warmup 预热次数
//    * @returns {number} 耗时（毫秒）
//    */
//   replaceAllRows(count: number, warmup: number = 5): number {
//     for (let i = 0; i < warmup; i++) {
//       this.createRows(count);
//     }
//     return this.createRows(count);
//   }
//
//   /**
//    * 部分更新（每 step 行更新一次）
//    * @param {number} totalCount 总行数
//    * @param {number} step 步长
//    * @param {number} warmup 预热次数
//    * @returns {number} 耗时（毫秒）
//    */
//   partialUpdate(totalCount: number, step: number = 10, warmup: number = 5): number {
//     this.createRows(totalCount);
//
//     // 预热
//     for (let w = 0; w < warmup; w++) {
//       for (let i = 0; i < totalCount; i += step) {
//         this._updateCell(i, `Updated ${i}`);
//       }
//     }
//
//     const start = performance.now();
//     for (let i = 0; i < totalCount; i += step) {
//       this._updateCell(i, `Updated ${i}`);
//     }
//     return performance.now() - start;
//   }
//
//   /**
//    * 选择某一行（高亮）
//    * @param {number} index 行号
//    * @param {number} warmup 预热次数
//    * @returns {number} 耗时（毫秒）
//    */
//   selectRow(index: number = 0, warmup: number = 5): number {
//     const row = this._getRow(index);
//     if (!row) return NaN;
//
//     // 预热
//     for (let i = 0; i < warmup; i++) {
//       this._highlightRow(row, true);
//       this._highlightRow(row, false);
//     }
//
//     const start = performance.now();
//     this._highlightRow(row, true);
//     return performance.now() - start;
//   }
//
//   /**
//    * 交换两行
//    * @param {number} indexA 第一个行号
//    * @param {number} indexB 第二个行号
//    * @param {number} warmup 预热次数
//    * @returns {number} 耗时（毫秒）
//    */
//   swapRows(indexA: number = 10, indexB: number = 20, warmup: number = 5): number {
//     this.createRows(1000); // 确保有足够行数
//
//     // 预热
//     for (let i = 0; i < warmup; i++) {
//       this._swapTwoRows(indexA, indexB);
//     }
//
//     const start = performance.now();
//     this._swapTwoRows(indexA, indexB);
//     return performance.now() - start;
//   }
//
//   /**
//    * 删除某一行
//    * @param {number} index 行号
//    * @param {number} warmup 预热次数
//    * @returns {number} 耗时（毫秒）
//    */
//   removeRow(index: number = 10, warmup: number = 5): number {
//     this.createRows(1000); // 确保有足够行数
//
//     // 预热
//     for (let i = 0; i < warmup; i++) {
//       this._deleteRow(index);
//       this._insertRow(index, `Row ${index}`);
//     }
//
//     const start = performance.now();
//     this._deleteRow(index);
//     return performance.now() - start;
//   }
//
//   /**
//    * 创建大量行（10000）
//    * @returns {number} 耗时（毫秒）
//    */
//   createManyRows(): number {
//     return this.createRows(10000);
//   }
//
//   /**
//    * 在大表格后追加行
//    * @param {number} baseCount 初始行数
//    * @param {number} appendCount 追加行数
//    * @returns {number} 耗时（毫秒）
//    */
//   appendRowsToLargeTable(baseCount: number = 10000, appendCount: number = 1000): number {
//     this.createRows(baseCount);
//     const start = performance.now();
//
//     for (let i = baseCount; i < baseCount + appendCount; i++) {
//       const row = document.createElement('tr');
//       row.innerHTML = `<td>Row ${i}</td>`;
//       this._appendRow(row);
//     }
//
//     return performance.now() - start;
//   }
//
//   /**
//    * 清空所有行
//    * @param {number} count 行数
//    * @returns {number} 耗时（毫秒）
//    */
//   clearRows(count: number = 10000): number {
//     this.createRows(count);
//     const start = performance.now();
//     this._clearTable();
//     return performance.now() - start;
//   }
//
//   /**
//    * 执行所有测试项
//    * @returns {Object} 测试结果
//    */
//   runAllTests(): Record<string, number> {
//     const results: Record<string, number> = {};
//
//     console.log("创建1000行...");
//     results.createRows = this.createRows(1000);
//
//     console.log("替换全部1000行...");
//     results.replaceAllRows = this.replaceAllRows(1000);
//
//     console.log("部分更新（每10行）...");
//     results.partialUpdate = this.partialUpdate(10000);
//
//     console.log("选择行...");
//     results.selectRow = this.selectRow(0);
//
//     console.log("交换行...");
//     results.swapRows = this.swapRows(10, 20);
//
//     console.log("删除行...");
//     results.removeRow(10);
//
//     console.log("创建10000行...");
//     results.createManyRows = this.createManyRows();
//
//     console.log("追加1000行到大表格...");
//     results.appendRowsToLargeTable = this.appendRowsToLargeTable(10000, 1000);
//
//     console.log("清空10000行...");
//     results.clearRows = this.clearRows(10000);
//
//     console.log("✅ 所有测试完成！");
//     console.table(results);
//
//     return results;
//   }
//
//   /*************************************
//    * 可重写方法（适配器模式）
//    *************************************/
//
//   /**
//    * 获取表格容器
//    * @returns {HTMLElement}
//    */
//   protected _getTableElement(): HTMLElement {
//     const table = document.getElementById('test-table');
//     if (!table) throw new Error('Table element not found');
//     return table;
//   }
//
//   /**
//    * 获取指定行
//    * @param {number} index 行号
//    * @returns {HTMLTableRowElement | undefined}
//    */
//   protected _getRow(index: number): HTMLTableRowElement | undefined {
//     return this._getTableElement().rows[index];
//   }
//
//   /**
//    * 插入一行
//    * @param {number} index 行号
//    * @param {string} text 文本内容
//    */
//   protected _insertRow(index: number, text: string): void {
//     const row = document.createElement('tr');
//     row.innerHTML = `<td>${text}</td>`;
//     this._getTableElement().insertRow(index).innerHTML = row.innerHTML;
//   }
//
//   /**
//    * 删除一行
//    * @param {number} index 行号
//    */
//   protected _deleteRow(index: number): void {
//     this._getTableElement().deleteRow(index);
//   }
//
//   /**
//    * 高亮/取消高亮某行
//    * @param {HTMLTableRowElement} row 行元素
//    * @param {boolean} isHighlighted 是否高亮
//    */
//   protected _highlightRow(row: HTMLTableRowElement, isHighlighted: boolean): void {
//     row.classList.toggle('highlight', isHighlighted);
//   }
//
//   /**
//    * 更新单元格内容
//    * @param {number} index 行号
//    * @param {string} text 新文本
//    */
//   protected _updateCell(index: number, text: string): void {
//     const cell = this._getRow(index)?.cells[0];
//     if (cell) cell.textContent = text;
//   }
//
//   /**
//    * 添加一行到表格
//    * @param {HTMLTableRowElement} row 行元素
//    */
//   protected _appendRow(row: HTMLTableRowElement): void {
//     this._getTableElement().appendChild(row);
//   }
//
//   /**
//    * 清空表格内容
//    */
//   protected _clearTable(): void {
//     this._getTableElement().innerHTML = '';
//   }
// }
