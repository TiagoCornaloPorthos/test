class UnexpectedHttpResponseStatusCodeError extends Error {
  constructor(message, status) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
  }

  toJSON() {
    const { name, message, status } = this;
    return {
      name,
      message,
      status
    };
  }
}

module.exports = UnexpectedHttpResponseStatusCodeError;