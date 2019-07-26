// some global variables
const gameID = 'botRoom'
const username = 'Mork-Bot'
let serverAdress = 'http://localhost:3000'
let board
let playerNum
let turnCount = 0
let grid = []
let socket

establishConnection()


// the turn function gets ran everytime its time for your turn. Return a tile object with x and y to click that tile
function turn() {
  let selectedTile = {x: 0, y: 0}

  // loop trough grid
  for(let x=0;x<grid.length;x++) {
    for(let y=0;y<grid[x].length;y++) {
      let tile = grid[x][y]
      let tilePos = {x: x, y: y}

      // if tile is yours --continue
      if(tile == 1) continue

      // if tile is of opponent --continue
      if(tile == 2) continue

      // if tile is empty
      if(tile == 0) {

        // get type of neighbors of tile
        let neighborTypes = getNeighbors(tilePos)

        // if has more enemys then friendly --continue
        if(neighborTypes[2] > neighborTypes[1]) continue

        // if no friendly neighbors at all --continue
        if(neighborTypes[1] == 0) continue

        // else select this tile as target
        selectedTile = tilePos

      }
    }
  }

  console.log('BOT: Tile Clicked: '+`x(${selectedTile.x}) y(${selectedTile.y})`)
  return selectedTile
}

// do whatever you want in this
function gameStart() {

}

// creates an empty grid
function createEmptyGrid() {
  for(let x=0;x<board.size.x;x++) {
    grid[x] = []
    for(let y=0;y<board.size.y;y++) {
      grid[x][y] = 0
    }
  }
}

// check neighboring tiles of a tile in the grid
function getNeighbors(tile) {
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

// create socket client to serverAdress
function establishConnection() {
  console.log('BOT: Attempting to establish connection')
  socket = require('socket.io-client')(serverAdress)
  socketHandler()
}

function socketHandler() {

  // wait on socket connect
  socket.on('connect', () => {
    console.log('Bot Socket connected!')

    // search for game
    socket.emit('findGame', {gameID: gameID, username: username })
  })

  // when player successfully joins a game
  socket.on('joined', (data) => {
    board = data

    console.log(`Bot Joined game ${gameID}!`)

    if(board.player1 == socket.id) playerNum = 1
    if(board.player2 == socket.id) playerNum = 2

    if(playerNum == 1) board.opponent = board.player2
    if(playerNum == 2) board.opponent = board.player1

    if(playerNum == 1) board.me = board.player1
    if(playerNum == 2) board.me = board.player2

    let usernames = {}
    usernames[board.player1] = board.player1Username
    usernames[board.player2] = board.player2Username

    createEmptyGrid()
  })


  // on turnCount update from server
  socket.on("turnCount", (data) => {
    turnCount = data

    // your turn
    if((turnCount % 2) + 1 == playerNum) {
      let tile = turn()
      socket.emit('turn', tile)
    }

    // opponents turn
    if((turnCount % 2) + 1 != playerNum) {

    }
  })

  // on message received from server
  socket.on('msg', (msg) => {
    if(msg == 'Game starting!') gameStart()
    if(msg == 'You won!' || msg == 'You lost! :(' || msg == 'Game stopped!') setTimeout(establishConnection, 1000)
    console.log('BOT-MESSAGE: '+msg)
  })

  // on any grid Changes
  socket.on('gridChanges', changes => {
    for(let change of changes) {
      console.log('BOT: GridChange: ', change)

      let x = change.x
      let y = change.y
      if(playerNum == 2) x = board.size.x - x - 1

      let to
      if(change.to == socket.id) to = 1
      if(change.to == board.opponent) to = 2
      if(change.to == 'none') to = 0

      grid[x][change.y] = to
    }
  })
}