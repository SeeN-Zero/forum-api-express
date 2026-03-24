import AddCommentUseCase from '../../../../Applications/use_case/AddCommentUseCase.js';
import DeleteCommentUseCase from '../../../../Applications/use_case/DeleteCommentUseCase.js';
import ToggleCommentLikeUseCase from '../../../../Applications/use_case/ToggleCommentLikeUseCase.js';

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
    this.putCommentLikeHandler = this.putCommentLikeHandler.bind(this);
  }

  async postCommentHandler(req, res, next) {
    try {
      const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
      const { threadId } = req.params;
      const addedComment = await addCommentUseCase.execute(req.body, req.auth.id, threadId);

      res.status(201).json({
        status: 'success',
        data: {
          addedComment,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteCommentHandler(req, res, next) {
    try {
      const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);
      const { threadId, commentId } = req.params;
      await deleteCommentUseCase.execute({
        threadId,
        commentId,
        owner: req.auth.id,
      });

      res.status(200).json({
        status: 'success',
      });
    } catch (error) {
      next(error);
    }
  }

  async putCommentLikeHandler(req, res, next) {
    try {
      const toggleCommentLikeUseCase = this._container.getInstance(ToggleCommentLikeUseCase.name);
      const { threadId, commentId } = req.params;
      await toggleCommentLikeUseCase.execute({
        userId: req.auth.id,
        threadId,
        commentId,
      });

      res.status(200).json({
        status: 'success',
      });
    } catch (error) {
      next(error);
    }
  }
}

export default CommentsHandler;
