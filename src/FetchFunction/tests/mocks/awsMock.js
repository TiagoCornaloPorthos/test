const awsMock = {
  get : (obj) => {
    return {
      promise: () => {
        return Promise.resolve({
          Item : {
            content: "token"
          }
        })
      }
    }
  }
}

module.exports = awsMock
