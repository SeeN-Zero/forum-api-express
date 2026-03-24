import ThreadHandler from './ThreadHandler.js';
import CommentHandler from './CommentHandler.js';
import ReplyHandler from './ReplyHandler.js';
import CommentLikeHandler from './CommentLikeHandler.js';
import createThreadsRouter from './routes.js';
import authenticationMiddleware from '../middleware/authentication.js';

const threads = (container) => {
  const handlers = {
    threadHandler: new ThreadHandler(container),
    commentHandler: new CommentHandler(container),
    replyHandler: new ReplyHandler(container),
    commentLikeHandler: new CommentLikeHandler(container),
  };
  const authentication = authenticationMiddleware(container);

  return createThreadsRouter(handlers, authentication);
};

export default threads;
