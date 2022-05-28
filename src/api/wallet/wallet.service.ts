import { Injectable } from '@nestjs/common';
import { EthersServiceCaller } from '../../service-caller/ethers.caller';

@Injectable()
export class WalletService {
  constructor(
    private ethersServiceCaller: EthersServiceCaller,
  ) {}

  async getAccountsBalances(accounts: any) {
    const promises = accounts.map((account: string) => this.ethersServiceCaller.getBalance(account));

    return Promise.all(promises);
  }
}
