import express from 'express';

const createCommentsRouter = (handler, authentication) => {
  const router = express.Router();

  router.post('/:threadId/comments', authentication, handler.postCommentHandler);
  router.delete('/:threadId/comments/:commentId', authentication, handler.deleteCommentHandler);
  router.put('/:threadId/comments/:commentId/likes', authentication, handler.putCommentLikeHandler);

  return router;
};

export default createCommentsRouter;
