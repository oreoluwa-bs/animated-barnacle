const BASE_URL = "https://api.coinlore.net/api";

export interface Ticker {
  id: string;
  symbol: string;
  name: string;
  nameid: string;
  rank: string;
  price_usd: string;
  percent_change_24h: string;
  percent_change_1h: string;
  percent_change_7d: string;
  price_btc: string;
  market_cap_usd: string;
  volume24: string;
  volume24a: string;
  csupply: string;
  tsupply: string;
  msupply: string;
}

interface TickerResponse {
  data: Ticker[];
  info: {
    coins_num: number;
    time: number;
  };
}

export const coinloreApi = Object.freeze({
  ticker: async function (filter: { page: number; limit: number }) {
    const resp = await fetch(
      `${BASE_URL}/tickers/?start=${filter.page * filter.limit}&limit=${filter.limit}`,
    );

    const result = (await resp.json()) as TickerResponse;

    return result;
  },
});
