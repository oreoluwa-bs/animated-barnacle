import { coinloreApi, Ticker } from "./lib/coin-ticker/api";

type TableFilters = {
  page: number;
  limit: number;
};

const rowsKey: { header: string; getValue: (d: Ticker) => string }[] = [
  { header: "💰 Coin", getValue: (d) => d.name },
  { header: "📄 Code", getValue: (d) => d.symbol },
  { header: "🤑 Price", getValue: (d) => "$" + d.price_usd },
  {
    header: "📉 Total Supply",
    getValue: (d) =>
      `${new Intl.NumberFormat("en-US", { maximumSignificantDigits: 3 }).format(Number(d.tsupply))} ${d.symbol}`,
  },
];

const search = new URLSearchParams(window.location.search);
let page = Math.max(Number(search.get("page") ?? "1"), 1);
let limit = Number(search.get("limit") ?? "10");
initCoinloreTable();

function initCoinloreTable() {
  renderCoinloreTable();
  renderCoinloreTablePagination();
}

function renderCoinloreTable() {
  const coinloreTable =
    document.querySelector<HTMLTableElement>("#coinlore-table");

  if (!coinloreTable) return;

  const th = coinloreTable.createTHead();
  const thr = th.insertRow();

  rowsKey.forEach((r) => {
    const c = document.createElement("th");
    c.textContent = r.header;
    c.scope = "row";
    thr.append(c);
  });

  renderCoinloreTableData({ page, limit });
}

async function renderCoinloreTableData(filter: TableFilters) {
  const coinloreTable =
    document.querySelector<HTMLTableElement>("#coinlore-table");

  if (!coinloreTable) return;

  let tb = coinloreTable.querySelector("tbody");

  if (!tb) {
    tb = coinloreTable.createTBody();
  }

  try {
    const data = await coinloreApi.ticker({
      page: filter.page - 1,
      limit: filter.limit,
    });

    tb.innerHTML = "";

    data.data.forEach((coin) => {
      const tr = tb.insertRow();
      rowsKey.forEach((k) => {
        const c = tr.insertCell();
        // c.textContent = k.value(coin);
        c.innerHTML = `
          <div>
          <div class="coinlore-table__row--mobile">
            <div>
              <dt>${k.header}</dt>
              <dd>${k.getValue(coin)}</dd>
            </div>
            <div>
              <dt>${rowsKey[3].header}</dt>
              <dd>${rowsKey[3].getValue(coin)}</dd>
            </div>
          </div>
          <div class="coinlore-table__row--desktop">
          ${k.getValue(coin)}
          </div>
          </div>
          `;
      });
    });
  } catch (err) {
    if (typeof err === "string") {
      alert(err);
      return;
    }

    if (err instanceof Error) {
      alert(err.message);
      return;
    }

    alert("Something went wrong");
  }
}

function renderCoinloreTablePagination() {
  const coinlorePagination = document.querySelector<HTMLDivElement>(
    ".coinlore-table__pagination",
  );
  if (!coinlorePagination) {
    return;
  }

  const nextPaginationButton = document.createElement("button");
  const prevPaginationButton = document.createElement("button");

  nextPaginationButton.innerHTML =
    "Next <i class='ph-bold ph-arrow-right'></i>";
  nextPaginationButton.addEventListener("click", handleCoinloreTableNextPage);

  prevPaginationButton.innerHTML = "<i class='ph-bold ph-arrow-left'></i> Prev";
  prevPaginationButton.addEventListener("click", handleCoinloreTablePrevPage);

  coinlorePagination.innerHTML = "";
  coinlorePagination.append(
    page > 1 ? prevPaginationButton : document.createElement("div"),
    nextPaginationButton,
  );
}

function handleCoinloreTableNextPage() {
  page = page + 1;

  renderCoinloreTableData({ page, limit }).then(() => {
    window.history.pushState(
      undefined,
      "unused",
      `${window.location.pathname}?page=${page}`,
    );
    renderCoinloreTablePagination();
  });
}

function handleCoinloreTablePrevPage() {
  page = Math.max(page - 1, 1);
  renderCoinloreTableData({ page, limit }).then(() => {
    window.history.pushState(
      undefined,
      "unused",
      `${window.location.pathname}?page=${page}`,
    );
    renderCoinloreTablePagination();
  });
}
