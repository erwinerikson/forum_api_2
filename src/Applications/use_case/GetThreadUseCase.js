const GetThread = require('../../Domains/threads/entities/GetThread');

class ReadThreadUseCase {
  constructor({
    threadRepository,
    commentRepository,
    replyRepository,
    likeRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._likeRepository = likeRepository;
  }
    
  async execute(useCasePayload) {
    const threadId = new GetThread(useCasePayload);
    const thread = await this._threadRepository.getThread(threadId);
    let comments = await this._commentRepository.getComment(threadId);
    const replies = await this._replyRepository.getReply(threadId);

    this._processData(comments);
    this._processData(replies);

    comments = await Promise.all(comments.map(async (comment) => ({
      id: comment.id,
      username: comment.username,
      date: comment.date,
      content: comment.content,
      replies: replies.filter((reply) => reply.comment === comment.id)
        .map((reply) => ({
          id: reply.id,
          content: reply.content,
          date: reply.date,
          username: reply.username,
        })),
    })));

    return { ...thread, comments };
  }

  _processData(data) {
    let content = '';
    Object.values(data).forEach((item) => {
      if (item.is_delete) {
        (item.id.slice(0, 8) === 'comment-') ? content = 'komentar' : content = 'balasan';
        item.content = `**${content} telah dihapus**`;
      }
      delete item.is_delete;
      return item;
    });
    return data;
  }
}

module.exports = ReadThreadUseCase;
