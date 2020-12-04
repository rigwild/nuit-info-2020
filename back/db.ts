import postgres from 'postgres';
import debug from 'debug';

const log = debug('postgres:query');

const sql = postgres({
  database: 'surfor', // FIXME
  debug: (_, q) => log('query: %s', q)
});

export function isError(err: any): err is postgres.Error {
  return err instanceof sql.PostgresError;
}

export default sql;
