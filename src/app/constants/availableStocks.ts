export const stockOptions = ['AAPL', 'GOOG', 'TSLA', 'AMZN', 'FB'] as const;

type AllStocks = typeof stockOptions;
export type StockSymbol = AllStocks[number];
