import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';

@Injectable()
export class EthersServiceCaller {
  mainnet: string;

  rpcApiKey: string;

  provider: ethers.providers.InfuraProvider;

  constructor(
    private configService: ConfigService,
  ) {
    this.mainnet = this.configService.get<any>('networks.mainnet');
    this.rpcApiKey = this.configService.get<any>('rpcApiKey');
    this.provider = new ethers.providers.InfuraProvider(this.mainnet, this.rpcApiKey);
  }

  async getBalance(account: string): Promise<any> {
    try {
      const balance = await this.provider.getBalance(account);

      return {
        balance: `${ethers.utils.formatEther(balance)} ETH`,
        account,
      };
    } catch (error) {
      return {
        error,
        account,
      };
    }
  }
}
