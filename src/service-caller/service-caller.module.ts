import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { EthersServiceCaller } from './ethers.caller';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [
    EthersServiceCaller,
  ],
  exports: [
    EthersServiceCaller,
  ],
})
export class ServiceCallerModule {}
