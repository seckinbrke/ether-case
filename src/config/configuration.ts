import * as pkg from '../../package.json';

const name = process.env.NAME || pkg.name;
const version = process.env.VERSION || pkg.version;
const env = process.env.NODE_ENV || 'dev';

export default () => ({
  name,
  version,
  env,
  server: {
    port: +(process.env.SERVER_PORT || process.env.PORT || 8081),
    keepAliveTimeout: +(process.env.SERVER_KEEP_ALIVE_TIMEOUT || 120000),
    returnValidationInfoError:
      (process.env.SERVER_RETURN_VALIDATION_INFO_ERROR || 'false')
        .trim()
        .toLowerCase() === 'true',
  },
  swagger: {
    enabled:
      (process.env.SWAGGER_ENABLED || 'false').trim().toLowerCase() === 'true',
  },
  networks: {
    mainnet: 'mainnet',
  },
  rpcApiKey: '1fc2785020d7443f880e99e4f25c5464',
});
