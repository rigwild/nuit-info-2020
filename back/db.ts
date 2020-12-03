import postgres from 'postgres';
import debug from 'debug';

const log = debug('postgres:query');

export default postgres({
  debug: (_, q) => log('query: %s', q)
});
