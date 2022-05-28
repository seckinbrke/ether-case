import { ArrayNotEmpty, IsArray } from 'class-validator';

export class GetAccountsBalancesDto {
  @IsArray()
  @ArrayNotEmpty()
    accounts: string[];
}
