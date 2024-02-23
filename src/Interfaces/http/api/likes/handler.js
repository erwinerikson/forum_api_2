const NewLikeUseCase = require('../../../../Applications/use_case/NewLikeUseCase');

class LikesHandler {
  constructor(container) {
    this._container = container;
     
    this.putLikeHandler = this.putLikeHandler.bind(this);
  }

  async putLikeHandler(request, h) {
    const newLikeUseCase = this._container.getInstance(NewLikeUseCase.name);
    const { id: owner } = request.auth.credentials;
    const { threadId: thread, commentId: comment } = request.params;
    await newLikeUseCase.execute({
      thread, comment, owner,
    });

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = LikesHandler;
