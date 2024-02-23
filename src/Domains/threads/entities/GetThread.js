class GetThread {
  constructor(payload) {
    this._verifyPayload(payload);
  
    const { id } = payload;
  
    this.id = id;
  }
  
  _verifyPayload(payload) {
    const { id } = payload;
    if (!id) {
      throw new Error('GET_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }
  
    if (typeof id !== 'string') {
      throw new Error('GET_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}
  
module.exports = GetThread;
