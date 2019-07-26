class Bot {
  constructor(username) {
    this.username = username
    this.serverAdress = ''
    this.socket
    this.logging = true
    this.playerNum
    this.opponent
    this.autoReconnect = true
    this.grid = []
    this.turnCount = 0
    this.usernames = {}
    this.onConnectedFunc = () => {}
    this.onTurnFunc = () => {}
    this.onGameStart = () => {}
  }
  connectSocket()  {
    // create socket client to serverAdress

    if(this.logging) console.log('BOT: Attempting to establish connection')

    this.socket = require('socket.io-client')(this.serverAdress)

    this.socketHandler()
  }
  socketHandler() {
    this.socket.on('connect', (data) => { this.onSocketConnect(data) })
    this.socket.on('joined', (data) => { this.onSocketJoined(data) })
    this.socket.on('turnCount', (data) => { this.onSocketTurnCount(data) })
    this.socket.on('gridChanges', (data) => { this.onSocketGridChanges(data) })
    this.socket.on('msg', (data) => { this.onSocketMSG(data) })
  }
  onSocketJoined(data) {
    this.board = data

    if(this.board.player1 == this.socket.id) this.playerNum = 1
    if(this.board.player2 == this.socket.id) this.playerNum = 2

    if(this.playerNum == 1) this.opponent = this.board.player2
    if(this.playerNum == 2) this.opponent = this.board.player1

    this.usernames[this.board.player1] = this.board.player1Username
    this.usernames[this.board.player2] = this.board.player2Username

    this.createEmptyGrid()
  }
  onSocketMSG(msg) {
    if(msg == 'Game starting!') this.onGameStart()
    if(msg == 'You won!' || msg == 'You lost :(' || msg == 'Game stopped!') {
      if(this.autoReconnect) setTimeout(() => { this.connectSocket() }, 1000)
    }

    if(this.logging) console.log('BOT-MESSAGE: '+msg)
  }
  onSocketConnect(data) {
    if(this.logging) console.log('Bot Socket connected!')
    
    this.onConnectedFunc()
  }
  onSocketTurnCount(data) {
    this.turnCount = data

    // your turn
    if((this.turnCount % 2) + 1 == this.playerNum) {
      let tile = this.onTurnFunc(this.grid)

      if(this.playerNum == 2) tile.x = this.board.size.x - tile.x - 1

      this.socket.emit('turn', tile)

      if(this.logging) console.log('BOT: Tile Clicked: '+`x(${tile.x}) y(${tile.y})`)
    }

    // opponents turn
    if((this.turnCount % 2) + 1 != this.playerNum) {

    }
  }
  onSocketGridChanges(changes) {
    for(let change of changes) {

      let x = change.x
      let y = change.y
      if(this.playerNum == 2) x = this.board.size.x - x - 1

      let to
      if(change.to == this.socket.id) to = 1
      if(change.to == this.opponent) to = 2
      if(change.to == 'none') to = 0

      if(this.logging) console.log('BOT: GridChange: ', {x: x, y: y, to: to})

      this.grid[x][y] = to
    }
  }
  join(gameID) {
    this.socket.emit('findGame', {gameID: gameID, username: this.username })
  }
  createEmptyGrid() {
    for(let x=0;x<this.board.size.x;x++) {
      this.grid[x] = []
      for(let y=0;y<this.board.size.y;y++) {
        this.grid[x][y] = 0
      }
    }
  }
  on(event, func) {
    if(event == 'connect') this.onConnectedFunc = func
    if(event == 'turn') this.onTurnFunc = func
    if(event == 'gameStart') this.onGameStart = func
  }
  getTileNeighbors(grid, tile) {
    let X = Number(tile.x)
    let Y = Number(tile.y)
    let neighborTypes = {}
    neighborTypes[0] = 0
    neighborTypes[1] = 0
    neighborTypes[2] = 0

    let u = undefined
    if(grid[X-1]!=u && grid[X-1][Y  ]!=u) neighborTypes[grid[X-1][Y  ]]++
    if(grid[X-1]!=u && grid[X-1][Y-1]!=u) neighborTypes[grid[X-1][Y-1]]++
    if(grid[X  ]!=u && grid[X  ][Y-1]!=u) neighborTypes[grid[X  ][Y-1]]++
    if(grid[X+1]!=u && grid[X+1][Y-1]!=u) neighborTypes[grid[X+1][Y-1]]++
    if(grid[X+1]!=u && grid[X+1][Y  ]!=u) neighborTypes[grid[X+1][Y  ]]++
    if(grid[X  ]!=u && grid[X  ][Y+1]!=u) neighborTypes[grid[X  ][Y+1]]++
    if(grid[X+1]!=u && grid[X+1][Y+1]!=u) neighborTypes[grid[X+1][Y+1]]++
    if(grid[X-1]!=u && grid[X-1][Y+1]!=u) neighborTypes[grid[X-1][Y+1]]++

    return neighborTypes
  }

}
module.exports = Bot