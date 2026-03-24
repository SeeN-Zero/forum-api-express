import ThreadsHandler from './handler.js';
import createThreadsRouter from './routes.js';
import authenticationMiddleware from '../middlewares/authentication.js';

const threads = (container) => {
  const handler = new ThreadsHandler(container);
  const authentication = authenticationMiddleware(container);

  return createThreadsRouter(handler, authentication);
};

export default threads;
