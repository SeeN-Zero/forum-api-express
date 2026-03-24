import express from 'express';

const createThreadsRouter = (handler, authentication) => {
  const router = express.Router();

  router.post('/', authentication, handler.postThreadHandler);
  router.get('/:threadId', handler.getThreadDetailHandler);

  return router;
};

export default createThreadsRouter;
