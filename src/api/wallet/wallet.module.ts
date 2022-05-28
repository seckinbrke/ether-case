import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { ServiceCallerModule } from '../../service-caller/service-caller.module';

@Module({
  controllers: [WalletController],
  providers: [WalletService],
  imports: [ServiceCallerModule, ConfigModule],
  exports: [WalletService],
})
export class WalletModule {}
