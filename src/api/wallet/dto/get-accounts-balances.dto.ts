import { ArrayNotEmpty, IsString } from 'class-validator';

export class GetAccountsBalancesDto {
  @IsString({ each: true })
  @ArrayNotEmpty()
    accounts: string[];
}
