const utils = require('./utils.js')

module.exports = (socket, board) => {

  // On disconnect stop game
  socket.on('disconnect', (socket) => {

    board.broadcastMSG('Game stopped!')
    board.reset()
    
    console.log(socket, ' DISCONNECTED')
    console.log('RESTART')
  })

  // on turn
  socket.on('turn', (tile) => {
    let playerNum = board.getPlayerNumBySocketID(socket.id)
    let opponent = board.getOpponentBySocketID(socket.id)
    let player = board.getPlayerBySocketID(socket.id)

    if((board.turnCount % 2) + 1 != playerNum) return socket.emit('msg', 'Not your turn!')

    if(board.grid[tile.x] == undefined) return
    if(board.grid[tile.x][tile.y] == undefined) return
    if(board.grid[tile.x][tile.y] == socket.id) return
    
    // check if more own neighbors
    let neighbors = utils.getNeighbors(board, tile)
    if(neighbors[player.socket.id] < 1) return socket.emit('Not enough neighbors!')
    if(neighbors[player.socket.id] < neighbors[opponent.socket.id]) return socket.emit('Not enough neighbors!')

    board.changeGridTile(tile.x, tile.y, socket.id)
    board.confirmGridChanges()


    board.turnCount++
    board.socketBroadcast('turnCount', board.turnCount)
  })
}