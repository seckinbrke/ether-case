/* eslint-disable arrow-body-style */
import BigNumber from 'bignumber.js';
import { AccountType } from './types';

export const formatGetBalancesResponse = (accounts: AccountType[]): AccountType[] => {
  return accounts.filter((wallet: AccountType) => (wallet.usdBalance ? new BigNumber(wallet.usdBalance).isGreaterThan(0) : wallet));
};
