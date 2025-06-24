export interface PerfResult {
  framework: string;
  test: string;
  time: number;

  signalMem?: number,
  computedMem?: number,
  effectMem?: number,
  treeMem?: number,
}

export interface PerfResultStrings {
  framework: string;
  test: string;
  time: string;
  signalMem?: string,
  computedMem?: string,
  effectMem?: string,
  treeMem?: string,
}

export type PerfResultCallback = (result: PerfResult) => void;

const columnWidth = {
  framework: 32,
  test: 40,
  time: 8,

  signalMem: 18,
  computedMem: 18,
  effectMem: 18,
  treeMem: 18,
};

export function perfResultHeaders(): PerfResultStrings {
  const keys: (keyof PerfResultStrings)[] = Object.keys(columnWidth) as any;
  const kv = keys.map((key) => [key, key]);
  const untrimmed = Object.fromEntries(kv);
  return trimColumns(untrimmed);
}

function trimColumns(row: PerfResultStrings): PerfResultStrings {
  const keys: (keyof PerfResultStrings)[] = Object.keys(columnWidth) as any;
  const trimmed = { ...row };
  for (const key of keys) {
    const length = columnWidth[key];
    const value = (row[key] || "").slice(0, length).padEnd(length);
    trimmed[key] = value;
  }
  return trimmed;
}

export function formatPerfResultStrings(row: PerfResultStrings): string {
  return Object.values(trimColumns(row)).join(" , ");
}

export function formatPerfResult(row: PerfResult): string {
  return formatPerfResultStrings({
    framework: row.framework,
    test: row.test,
    time: row.time.toFixed(2),
    signalMem: row.signalMem?.toFixed(2),
    computedMem: row.computedMem?.toFixed(2),
    effectMem: row.effectMem?.toFixed(2),
    treeMem: row.treeMem?.toFixed(2),
  });
}
