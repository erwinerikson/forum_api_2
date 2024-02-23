class DeleteReply {
  constructor(payload) {
    this._verifyPayload(payload);
        
    const {
      thread, comment, reply, owner,
    } = payload;
        
    this.thread = thread;
    this.comment = comment;
    this.reply = reply;
    this.owner = owner;
  }
        
  _verifyPayload({
    thread, comment, reply, owner,
  }) {
    if (!thread || !comment || !reply || !owner) {
      throw new Error('DELETE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }
        
    if (typeof thread !== 'string' || typeof comment !== 'string' || typeof reply !== 'string' || typeof owner !== 'string') {
      throw new Error('DELETE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}
        
module.exports = DeleteReply;
