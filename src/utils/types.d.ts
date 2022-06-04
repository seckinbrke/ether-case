import BigNumber from 'bignumber.js';

export type AccountType = {
  account: string;
  ethereumBalance: BigNumber;
  usdBalance: BigNumber,
};

export type AccountErrorType = {
  account: string;
  error: any;
};

export type CoinByCurrenctType = {
  [account: string]: {
    [currency: string]: number;
  }
};
