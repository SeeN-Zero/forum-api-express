import express from 'express';

const createRepliesRouter = (handler, authentication) => {
  const router = express.Router();

  router.post('/:threadId/comments/:commentId/replies', authentication, handler.postReplyHandler);
  router.delete('/:threadId/comments/:commentId/replies/:replyId', authentication, handler.deleteReplyHandler);

  return router;
};

export default createRepliesRouter;
