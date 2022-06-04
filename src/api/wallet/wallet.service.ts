import { Injectable } from '@nestjs/common';
import { EthersServiceCaller } from '../../service-caller/ethers.caller';
import { formatGetBalancesResponse } from '../../utils/formatters';
import { AccountType } from '../../utils/types';

@Injectable()
export class WalletService {
  constructor(
    private ethersServiceCaller: EthersServiceCaller,
  ) {}

  /*
    BigNumber type ının responseta string olarak görünmesi.

    Belirli bir decimal point’ten sonra http Express vb sayıları string olarak client response olarak döner.
    Date timestamp de bu şekilde. Bunun olmaması için repsonse DTO yazılması ve dönüş tiplerinin özellikle
    belirtilmesi lazım bu number’dır, bu string’tir diye.
  */

  async getAccountsBalances(accounts: string[]): Promise<AccountType[]> {
    const { ethereum: { usd } } = await this.ethersServiceCaller.getCoinValueByCurrency('ethereum', 'usd');

    const promises = accounts.map((account: string) => this.ethersServiceCaller.getBalance(account, usd));

    const result = await Promise.all(promises).then((wallets: AccountType[]) => wallets);

    return formatGetBalancesResponse(result);
  }
}
