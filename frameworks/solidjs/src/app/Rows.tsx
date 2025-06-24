import { createSignal, createSelector, batch, For } from "solid-js";
// import { render } from "solid-js/web";

// 定义 Row 类型
interface Row {
  id: number;
  label: () => string;
  setLabel: (updater: (prev: string) => string) => void;
}

const adjectives = [
  "pretty",
  "large",
  "big",
  "small",
  "tall",
  "short",
  "long",
  "handsome",
  "plain",
  "quaint",
  "clean",
  "elegant",
  "easy",
  "angry",
  "crazy",
  "helpful",
  "mushy",
  "odd",
  "unsightly",
  "adorable",
  "important",
  "inexpensive",
  "cheap",
  "expensive",
  "fancy",
];
const colors = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];

const random = (max: number): number => Math.round(Math.random() * 1000) % max;

let nextId = 1;

const buildData = (count: number): Row[] => {
  const data: Row[] = new Array(count);
  for (let i = 0; i < count; i++) {
    const [label, setLabel] = createSignal<string>(
      `${adjectives[random(adjectives.length)]} ${colors[random(colors.length)]} ${nouns[random(nouns.length)]}`
    );
    data[i] = { id: nextId++, label, setLabel };
  }
  return data;
};

type ButtonProps = [id: string, text: string, fn: () => void];

const Button = ([id, text, fn]: ButtonProps) => (
  <div className="col-sm-6 smallpad">
    <button prop:id={id} class="btn btn-primary btn-block" type="button" onClick={fn}>
      {text}
    </button>
  </div>
);

export const Rows = () => {
  const [data, setData] = createSignal<Row[]>([]);
  const [selected, setSelected] = createSignal<number | null>(null);

  const run = () => setData(buildData(1_000));
  const runLots = () => setData(buildData(10_000));
  const add = () => setData((d) => [...d, ...buildData(1_000)]);
  const update = () =>
    batch(() => {
      const d = data();
      for (let i = 0, len = d.length; i < len; i += 10) {
        d[i].setLabel((l) => l + " !!!");
      }
    });
  const clear = () => setData([]);
  const swapRows = () => {
    const list = data().slice();
    if (list.length > 998) {
      const item = list[1];
      list[1] = list[998];
      list[998] = item;
      setData(list);
    }
  };

  const isSelected = createSelector(selected);

  return (
    <div className="container">
      <div className="jumbotron">
        <div className="row">
          <div className="col-md-6">
            <h1>Solid Performance Test</h1>
          </div>
          <div className="col-md-6">
            <div className="row">
              <Button {...["run", "Create 1,000 rows", run]} />
              <Button {...["runlots", "Create 10,000 rows", runLots]} />
              <Button {...["add", "Append 1,000 rows", add]} />
              <Button {...["update", "Update every 10th row", update]} />
              <Button {...["clear", "Clear", clear]} />
              <Button {...["swaprows", "Swap Rows", swapRows]} />
            </div>
          </div>
        </div>
      </div>
      <table className="table table-hover table-striped test-data">
        <tbody>
        <For each={data()}>
          {(row, index) => {
            const rowId = row.id;
            return (
              <tr className={isSelected(rowId) ? "danger" : ""}>
                <td className="col-md-1" textContent={rowId} />
                <td className="col-md-4">
                  <a onClick={() => setSelected(rowId)} textContent={row.label()} />
                </td>
                <td className="col-md-1">
                  <a
                    onClick={() =>
                      setData((d) => d.toSpliced(d.findIndex((d) => d.id === rowId), 1))
                    }
                  >
                    <span className="glyphicon glyphicon-remove" aria-hidden="true" />
                  </a>
                </td>
                <td className="col-md-6" />
              </tr>
            );
          }}
        </For>
        </tbody>
      </table>
      <span className="preloadicon glyphicon glyphicon-remove" aria-hidden="true" />
    </div>
  );
}
