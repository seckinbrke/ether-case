/* eslint-disable max-len */
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ConfigModule } from '@nestjs/config';
import { configuration } from '../src/config';
import { ENVIRONMENTS } from '../src/constants';
import { EthersServiceCaller } from '../src/service-caller/ethers.caller';
import { WalletModule } from '../src/api/wallet/wallet.module';
import { mockConstants } from './mocks';

const { accounts, ethereumBalances, usdBalances } = mockConstants;

jest.setTimeout(100000);
describe('Wallet (e2e)', () => {
  let app: INestApplication;

  const etherServiceCaller = {
    getBalance: jest.fn(),
    getCoinValueByCurrency: jest.fn().mockReturnValue({ ethereum: { usd: 1232 } }),
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
    it('Should be valid response.', async () => {
      etherServiceCaller.getBalance =
        jest.fn().mockResolvedValueOnce({
          account: accounts[0],
          ethereumBalance: ethereumBalances[0],
          usdBalance: usdBalances[0],
        }).mockResolvedValueOnce({
          account: accounts[1],
          ethereumBalance: ethereumBalances[1],
          usdBalance: usdBalances[1],
        });

      const response = await request(app.getHttpServer())
        .post('/wallet/get-accounts-balances')
        .send({
          accounts: [accounts[0], accounts[1]],
        });

      const { body, statusCode } = response;

      expect(statusCode).toBe(201);
      expect(body[0].account).toEqual(accounts[0]);
      expect(body[0].ethereumBalance).toEqual(ethereumBalances[0]);
      expect(body[0].usdBalance).toEqual(usdBalances[0]);
      // We filtered 0 balance accounts from the response. So the second account should be undefined.
      expect(body[1]).toBeUndefined();
    });

    it('Invalid account, then return error.', async () => {
      etherServiceCaller.getBalance =
        jest.fn().mockResolvedValue({
          account: accounts[2],
          error: {
            reason: 'invalid address',
            code: 'INVALID_ARGUMENT',
            argument: 'address',
            value: accounts[2],
          },
        });

      const response = await request(app.getHttpServer())
        .post('/wallet/get-accounts-balances')
        .send({
          accounts: [accounts[2]],
        });

      const { body, statusCode } = response;

      expect(statusCode).toBe(201);
      expect(body[0].account).toBe(accounts[2]);
      expect(body[0].error.code).toBe('INVALID_ARGUMENT');
    });

    it('If there is an error on getCoinValueByCurrency, then it will give error.', async () => {
      etherServiceCaller.getCoinValueByCurrency = jest.fn().mockRejectedValue(new BadRequestException('Error'));

      const response = await request(app.getHttpServer())
        .post('/wallet/get-accounts-balances')
        .send({
          accounts: [accounts[0]],
        });

      const { body, statusCode } = response;

      expect(statusCode).toBe(400);
      expect(body.message).toBe('Error');
    });
  });
});
