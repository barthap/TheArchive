import knex from 'knex';

import config from '../config';

const client = knex({
  client: 'pg',
  ...config.postgres,
});

export default client;
