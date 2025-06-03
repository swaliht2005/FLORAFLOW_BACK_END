

class Message {
  constructor(id, user, content, timestamp = new Date()) {
    this.id = id;
    this.user = user;
    this.content = content;
    this.timestamp = timestamp;
  }
}

module.exports = Message;
