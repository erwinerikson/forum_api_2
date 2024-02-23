class DeleteComment {
  constructor(payload) {
    this._verifyPayload(payload);
      
    const { thread, comment, owner } = payload;
      
    this.thread = thread;
    this.comment = comment;
    this.owner = owner;
  }
      
  _verifyPayload({ thread, comment, owner }) {
    if (!thread || !comment || !owner) {
      throw new Error('DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }
      
    if (typeof thread !== 'string' || typeof comment !== 'string' || typeof owner !== 'string') {
      throw new Error('DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}
      
module.exports = DeleteComment;
