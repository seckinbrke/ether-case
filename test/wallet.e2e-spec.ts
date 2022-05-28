import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ConfigModule } from '@nestjs/config';
import { configuration } from '../src/config';
import { ENVIRONMENTS } from '../src/constants';
import { EthersServiceCaller } from '../src/service-caller/ethers.caller';
import { WalletModule } from '../src/api/wallet/wallet.module';

jest.setTimeout(100000);
describe('Wallet (e2e)', () => {
  let app: INestApplication;

  const mockAccount = '0xBb4640ef33cB62a1f0F90998643378Cec1DE7A77';
  const mockBalance = '0.00 ETH';

  const etherServiceCaller = {
    getBalance: jest.fn().mockReturnValue({ account: mockAccount, balance: mockBalance }),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        WalletModule,
        ConfigModule.forRoot({
          load: [configuration],
          envFilePath: ENVIRONMENTS.test,
        }),
      ],
    })
      .overrideProvider(EthersServiceCaller)
      .useValue(etherServiceCaller)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });
  describe('POST /wallet/get-accounts-balances', () => {
    it('should be valid response.', async () => {
      const response = await request(app.getHttpServer())
        .post('/wallet/get-accounts-balances')
        .send({
          accounts: [mockAccount],
        });

      const { body, statusCode } = response;

      expect(statusCode).toBe(201);
      expect(body[0].account).toBe(mockAccount);
      expect(body[0].balance).toBe(mockBalance);
    });

    it('invalid payload then throw error', async () => {
      const response = await request(app.getHttpServer())
        .post('/wallet/get-accounts-balances')
        .send({
          accountss: [],
        });

      const { body, statusCode } = response;

      expect(statusCode).toBe(500);
      expect(body.message).toBe('Internal server error');
    });
  });
});
