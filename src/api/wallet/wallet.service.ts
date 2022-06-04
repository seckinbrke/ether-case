import { Injectable } from '@nestjs/common';
import { EthersServiceCaller } from '../../service-caller/ethers.caller';
import { formatGetBalancesResponse } from '../../utils/formatters';
import { AccountType } from '../../utils/types';

@Injectable()
export class WalletService {
  constructor(
    private ethersServiceCaller: EthersServiceCaller,
  ) {}

  // BigInt değerlerinin toString methodu çağırmadan string bir şekilde dönmesi konusunu uzun bir süre
  // araştırdım fakat net bir sonuca varamadım. Son adıma gelene kadar BigInt type ında olmasına rağmen,
  // node js response u dönerken stringe çeviriyor. Bu gizemi araştırmaya devam edeceğim :)

  async getAccountsBalances(accounts: string[]): Promise<AccountType[]> {
    const { ethereum: { usd } } = await this.ethersServiceCaller.getCoinValueByCurrency('ethereum', 'usd');

    const promises = accounts.map((account: string) => this.ethersServiceCaller.getBalance(account, usd));

    const result = await Promise.all(promises).then((wallets: AccountType[]) => wallets);

    return formatGetBalancesResponse(result);
  }
}
