import { resolve } from 'path';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import logged from './routers/logged';
import unlogged from './routers/unlogged';

const app = express();

const dist = resolve(__dirname, '../../dist'); // Resolved from server/dist/index.js

app.use(express.static(dist));

const apiErrorHandler: express.ErrorRequestHandler = (error, req, res) => res.status(500).json({
  error: {
    code: 'INTERNAL_SERVER_ERROR',
    message: 'An internal server occured: ' + (error && (error.message || error)),
    error
  }
});

const notFoundHandler: express.RequestHandler = (req, res) => res.status(404).json({
  error: {
    code: 'NOT_FOUND',
    message: 'Route not found: ' + req.path,
    route: req.path
  }
});

app.use('/api',
  cors({ origin: 'http://localhost:8080', credentials: true }),
  express.json(),
  unlogged,
  session({
    secret: process.env.COOKIE_SECRET || 'asecret'
  }),
  logged,
  apiErrorHandler,
  notFoundHandler
);

app.use((_, res) => res.sendFile('index.html', { root: dist }));

const PORT = +(process.env.PORT || 4000);
app.listen(PORT, () => console.info('Server ready. http://localhost:%d/', PORT));
