module.exports = {
  sleep(ms) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve()
      }, ms)
    })
  },
  randomToken(length=5) {
    let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'.split("")
    let token = ''
    for(let i=0;i<length;i++) {
      token += chars[Math.floor(Math.random()*chars.length)]
    }
    return token
  }
}