const DeleteComment = require('../../Domains/comments/entities/DeleteComment');

class DeleteCommentUseCase {
  constructor({
    threadRepository,
    commentRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }
      
  async execute(useCasePayload) {
    const deleteComment = new DeleteComment(useCasePayload);
    await this._threadRepository.verifyThreadAvailability(deleteComment.thread);
    await this._commentRepository.verifyCommentAvailability(deleteComment.comment);
    await this._commentRepository.verifyCommentByOwnerAvailability(deleteComment);
    return this._commentRepository.deleteComment(deleteComment);
  }
}
  
module.exports = DeleteCommentUseCase;
