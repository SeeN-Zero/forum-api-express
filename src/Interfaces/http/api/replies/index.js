import RepliesHandler from './handler.js';
import createRepliesRouter from './routes.js';
import authenticationMiddleware from '../middlewares/authentication.js';

const replies = (container) => {
  const handler = new RepliesHandler(container);
  const authentication = authenticationMiddleware(container);

  return createRepliesRouter(handler, authentication);
};

export default replies;
