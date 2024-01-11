class UnsentContentError extends Error {
  constructor(message, source, contentId) {
    super(message);
    this.name = this.constructor.name;
    this.source = source;
    this.contentId = contentId;
  }

  toJSON() {
    const { name, message, source, contentId } = this;
    return {
      name,
      message,
      source,
      contentId,
    };
  }
}

module.exports = UnsentContentError;
