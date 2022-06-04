/* eslint-disable class-methods-use-this */
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { AccountErrorType, AccountType, CoinByCurrenctType } from '../utils/types';

@Injectable()
export class EthersServiceCaller {
  mainnet: string;

  rpcApiKey: string;

  coingeckoUrl: string;

  provider: ethers.providers.InfuraProvider;

  constructor(
    private configService: ConfigService,
  ) {
    this.mainnet = this.configService.get<any>('networks.mainnet');
    this.coingeckoUrl = this.configService.get<any>('coingeckoUrl');
    this.rpcApiKey = this.configService.get<any>('rpcApiKey');
    this.provider = new ethers.providers.InfuraProvider(this.mainnet, this.rpcApiKey);
  }

  async getBalance(account: string, usdValue: number): Promise<AccountType | AccountErrorType> {
    try {
      const balance = await this.provider.getBalance(account);

      const ethereumBalance = new BigNumber(ethers.utils.formatEther(balance));

      const usdBalance = ethereumBalance.multipliedBy(usdValue);

      return {
        account,
        ethereumBalance,
        usdBalance,
      };
    } catch (error) {
      return {
        error,
        account,
      };
    }
  }

  async getCoinValueByCurrency(coinName: string, currency: string): Promise<CoinByCurrenctType> {
    return axios.get(`${this.coingeckoUrl}/api/v3/simple/price?ids=${coinName}%2C&vs_currencies=${currency}`)
      .then((response) => response.data)
      .catch((error) => {
        throw new BadRequestException(error);
      });
  }
}
