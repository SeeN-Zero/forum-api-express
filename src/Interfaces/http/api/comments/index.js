import CommentsHandler from './handler.js';
import createCommentsRouter from './routes.js';
import authenticationMiddleware from '../middlewares/authentication.js';

const comments = (container) => {
  const handler = new CommentsHandler(container);
  const authentication = authenticationMiddleware(container);

  return createCommentsRouter(handler, authentication);
};

export default comments;
