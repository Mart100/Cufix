const SocketReceiver = require('./socketReceiver.js')
const utils = require('./utils.js')

class Board {
  constructor(id, settings) {
    this.settings = settings
    this.id = id
    this.player1 = undefined
    this.player2 = undefined
    this.socketReceiver = SocketReceiver
    this.turnCount = 0
    this.started = false
    this.size = {x: 20, y: 11}
    this.grid = []
    this.turnTimer = 10
    this.turnTimerInterval
    this.lastTurn = {x: 0, y:0}
    this.gridChanges = []
  }
  createGrid() {

    for(let x=0;x<this.size.x;x++) {
      this.grid[x] = []
      for(let y=0;y<this.size.y;y++) {
        this.grid[x][y] = 'none'
      }
    }

    this.changeGridTile(0, Math.floor(this.size.y/2), this.player1.socket.id)
    this.changeGridTile(this.size.x-1, Math.floor(this.size.y/2), this.player2.socket.id)
    this.confirmGridChanges()

  }
  join(socket) {
    let playerNum = 0

    if(this.player1 == undefined) playerNum = 1
    else if(this.player2 == undefined) playerNum = 2
    else return 'FULL'

    let player = {
      socket: socket,
      username: socket.username
    }
  
    if(playerNum == 1) this.player1 = player
    if(playerNum == 2) this.player2 = player

    this.socketReceiver(socket, this)

    if(playerNum == 1) socket.emit('msg', 'Waiting for opponent...')
    if(playerNum == 2) this.start()

    return 'JOINED'

  }
  start() {
    console.log(`Game ${this.id} has started!`)

    // player joins
    this.socketBroadcast('joined', {
      id: this.id,
      size: this.size,
      player1: this.player1.socket.id,
      player2: this.player2.socket.id,
      player1Username: this.player1.username,
      player2Username: this.player2.username
    })

    // send start message
    this.broadcastMSG('Game starting!')

    // create pixels
    this.createGrid()

    // send turn
    this.socketBroadcast('turnCount', this.turnCount)

    // send start message
    this.broadcastMSG('Game started!')

    // start
    this.started = true

    // turn timer
    this.turnTimerInterval = setInterval(() => {
      this.turnTimer -= 1
      this.socketBroadcast('turnTimer', this.turnTimer)
      if(this.turnTimer < 0) this.nextTurn()
    }, 1000)

  }
  nextTurn() {
    this.turnCount++
    this.turnTimer = 10
    this.socketBroadcast('turnCount', this.turnCount)
  }
  reset() {
    if(this.player1 != undefined) this.player1.socket.removeAllListeners()
    if(this.player2 != undefined) this.player2.socket.removeAllListeners()
    this.player1 = undefined
    this.player2 = undefined
    this.started = false
    this.turnCount = 0
    clearInterval(this.turnTimerInterval)
    this.grid = []
    console.log(`RESETTED GAME ${this.id}`)
  }
  checkWin() {

    if(!this.started) return
     
    // check player1 win
    for(let y=0;y<this.size.y;y++) if(this.grid[this.size.x-1][y] == this.player1.socket.id) return this.win(this.player1)

    // check player2 win
    for(let y=0;y<this.size.y;y++) if(this.grid[0][y] == this.player2.socket.id) return this.win(this.player2)
  }
  win(winner) {

    // some vars
    let loser = this.getOpponentBySocketID(winner.socket.id)

    console.log(`${winner.username} Won against ${loser.username} in game ${this.id}`)

    // send won / lost text
    winner.socket.emit('msg', 'You won!')
    loser.socket.emit('msg', 'You lost :(')

    // reset game
    this.reset()

  }
  getPlayerBySocketID(id) {
    if(this.player1.socket.id == id) return this.player1
    if(this.player2.socket.id == id) return this.player2
  }
  getPlayerNumBySocketID(id) {
    if(this.player1.socket.id == id) return 1
    if(this.player2.socket.id == id) return 2
  }
  getOpponentBySocketID(id) {
    if(this.player1.socket.id == id) return this.player2
    if(this.player2.socket.id == id) return this.player1
  }
  broadcastMSG(msg) {
    if(this.player1 != undefined) this.player1.socket.emit('msg', msg)
    if(this.player2 != undefined) this.player2.socket.emit('msg', msg)
  }
  socketBroadcast(channel, data) {
    if(this.player1 != undefined) this.player1.socket.emit(channel, data)
    if(this.player2 != undefined) this.player2.socket.emit(channel, data)
  }
  confirmGridChanges(newGrid) {
    this.socketBroadcast('gridChanges', this.gridChanges)
    this.gridChanges = []
  }
  changeGridTile(x, y, to) {
    this.grid[x][y] = to
    this.gridChanges.push({x:x,y:y,to:to})
  }
}

module.exports = Board