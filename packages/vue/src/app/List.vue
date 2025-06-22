<script setup>
import { ref } from 'vue'
import {countTime, generateRows} from "utils";

const rows = ref([])
const results = ref('')
const selectedRowId = ref(null)

// 1. create rows
function testCreateRows() {
  return countTime(() => {
    rows.value = generateRows(1000)

    return new Promise(resolve => {
      requestAnimationFrame(() => {
        resolve();
      });
    });
  }, 1, 0)
}

// 2. replace all rows
function testReplaceAllRows() {
  return countTime(() => {
    rows.value = generateRows(1000)

    return new Promise(resolve => {
      requestAnimationFrame(() => {
        resolve();
      });
    });
  }, 5, 5)
}

// 3. partial update
function testPartialUpdate() {
  rows.value = generateRows(10000)
  return countTime(() => {
    const updated = [...rows.value]
    for (let i = 0; i < updated.length; i += 10) {
      updated[i].text = `Updated ${Math.random().toFixed(4)}`
    }
    rows.value = updated

    return new Promise(resolve => {
      requestAnimationFrame(() => {
        resolve();
      });
    });
  }, 5, 5)
}

// 4. select row
function testSelectRow() {
  selectedRowId.value = null
  return countTime(() => {
    selectedRowId.value = Math.floor(Math.random() * rows.value.length)

    return new Promise(resolve => {
      requestAnimationFrame(() => {
        resolve();
      });
    });
  }, 5, 5)
}

// 5. swap rows
function testSwapRows() {
  return countTime(() => {
    const list = [...rows.value]
    const indexA = 10
    const indexB = 20
    ;[list[indexA], list[indexB]] = [list[indexB], list[indexA]]
    rows.value = list

    return new Promise(resolve => {
      requestAnimationFrame(() => {
        resolve();
      });
    });
  }, 5, 5)
}

// 6. remove row
function testRemoveRow() {
  console.log('testRemoveRow . ');
  return countTime(() => {
    console.warn('rows.value.length is ', rows.value.length)
    if (rows.value.length > 0) {
      rows.value = rows.value.slice(1)
    }

    return new Promise(resolve => {
      requestAnimationFrame(() => {
        resolve();
      });
    });
  }, 5, 5)
}
// todo 这样的测试，不包含表格渲染的时间吧？
// 7. create many rows
function testCreateManyRows() {
  return countTime(() => {
    rows.value = generateRows(10000)
    return new Promise(resolve => {
      requestAnimationFrame(() => {
        resolve();
      });
    });
  }, 1, 0)
}

// 8. append rows to large table
function testAppendRowsToLargeTable() {
  const oldLength = rows.value.length
  return countTime(() => {
    const newRows = generateRows(1000).map(r => ({ ...r, id: r.id + oldLength }))
    rows.value = [...rows.value, ...newRows]

    return new Promise(resolve => {
      requestAnimationFrame(() => {
        resolve();
      });
    });
  }, 1, 0)
}

// 9. clear rows
function testClearRows() {
  return countTime(() => {
    rows.value = []

    return new Promise(resolve => {
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

  rows.value = generateRows(10000)
  output.push(`partial update: ${await testPartialUpdate()} ms`)

  rows.value = generateRows(1000)
  output.push(`select row: ${await testSelectRow()} ms`)
  output.push(`swap rows: ${await testSwapRows()} ms`)
  output.push(`remove row: ${await testRemoveRow()} ms`)

  output.push(`create many rows: ${await testCreateManyRows()} ms`)

  rows.value = generateRows(10000)
  output.push(`append rows to large table: ${await testAppendRowsToLargeTable()} ms`)
  output.push(`clear rows: ${await testClearRows()} ms`)

  results.value = output.join('\n')
}
</script>

<template>
  <div style="padding: 20px;">
    <h2>Vue 3 Performance Tests</h2>
    <button id="rows-test" @click="runAllTests">Run All Tests</button>
    <br /><br />
    <table border="1" cellspacing="0" cellpadding="5">
      <tr v-for="(row, index) in rows" :key="row.id" :class="{ highlight: selectedRowId === index }">
        <td>{{ row.text }}</td>
      </tr>
    </table>
    <pre id="rows-results" style="white-space: pre-wrap;">{{ results }}</pre>
  </div>
</template>

<style>
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
</style>
