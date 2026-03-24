import express from 'express';

const createThreadsRouter = (handlers, authentication) => {
  const router = express.Router();
  const {
    threadHandler,
    commentHandler,
    replyHandler,
    commentLikeHandler,
  } = handlers;

  router.post('/', authentication, threadHandler.postThreadHandler);
  router.post('/:threadId/comments', authentication, commentHandler.postCommentHandler);
  router.delete('/:threadId/comments/:commentId', authentication, commentHandler.deleteCommentHandler);
  router.put('/:threadId/comments/:commentId/likes', authentication, commentLikeHandler.putCommentLikeHandler);
  router.post('/:threadId/comments/:commentId/replies', authentication, replyHandler.postReplyHandler);
  router.delete('/:threadId/comments/:commentId/replies/:replyId', authentication, replyHandler.deleteReplyHandler);
  router.get('/:threadId', threadHandler.getThreadDetailHandler);

  return router;
};

export default createThreadsRouter;
