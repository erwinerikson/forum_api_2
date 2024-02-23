const NewLike = require('../../Domains/likes/entities/NewLike');

class NewLikeUseCase {
  constructor({
    threadRepository,
    commentRepository,
    likeRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._likeRepository = likeRepository;
  }

  async execute(useCasePayload) {
    const payload = new NewLike(useCasePayload);
    await this._threadRepository.verifyThreadAvailability(payload.thread);
    await this._commentRepository.verifyCommentAvailability(payload.comment);

    const isLike = await this._likeRepository.verifyAvailableLike(payload);

    if (isLike > 0) {
      return this._likeRepository.deleteLike(payload);
    }

    return this._likeRepository.addLike(payload);
  }
}

module.exports = NewLikeUseCase;
