import { Controller, Body, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { WalletService } from './wallet.service';
import { GetAccountsBalancesDto } from './dto/get-accounts-balances.dto';

@ApiTags('wallet')
@Controller('wallet')
export class WalletController {
  constructor(private walletService: WalletService) {}

  @Post('get-accounts-balances')
  @ApiOperation({ summary: 'Gets accounts balances by given accounts.' })
  getAccountsBalances(@Body() getAccountsBalancesDTO: GetAccountsBalancesDto) {
    const { accounts } = getAccountsBalancesDTO;

    return this.walletService.getAccountsBalances(accounts);
  }
}
