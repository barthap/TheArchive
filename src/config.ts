import env from './utils/env';

const config = {
  port: env('PORT', { defaultValue: 3009, transform: Number }),
  logger: {
    name: env('LOGGER_NAME', { defaultValue: 'submission-service' }),
    //    level: env('LOGGER_LEVEL', { defaultValue: LoggerLevel.INFO, oneOf: LoggerLevel }),
  },

  postgres: {
    connection: {
      host: env('DB_HOST'),
      port: env('DB_PORT', { defaultValue: 2345, transform: Number }),
      user: env('DB_USER'),
      password: env('DB_PASSWORD'),
      database: env('DB_NAME'),
    },
    pool: {
      min: env('POSTGRES_POOL_MIN', { defaultValue: 1, transform: Number }),
      max: env('POSTGRES_POOL_MAX', { defaultValue: 10, transform: Number }),
    },
  },
};

export default config;
