const DeleteReply = require('../../Domains/replies/entities/DeleteReply');

class DeleteReplyUseCase {
  constructor({
    threadRepository,
    commentRepository,
    replyRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }
      
  async execute(useCasePayload) {
    const deleteReply = new DeleteReply(useCasePayload);
    const {
      thread, comment, reply: id, owner,
    } = deleteReply;
    await this._threadRepository.verifyThreadAvailability(thread);
    await this._commentRepository.verifyCommentAvailability(comment);
    await this._replyRepository.verifyReplyAvailability(id);
    await this._replyRepository.verifyReplyByOwnerAvailability({
      id, thread, comment, owner,
    });
    return this._replyRepository.deleteReply(deleteReply);
  }
}
  
module.exports = DeleteReplyUseCase;
