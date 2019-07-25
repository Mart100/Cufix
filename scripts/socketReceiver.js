const utils = require('./utils.js')

module.exports = (socket, board) => {

  // On disconnect stop game
  socket.on('disconnect', (socket) => {

    board.broadcastMSG('Game stopped!')
    board.reset()
    
    console.log(socket, ' DISCONNECTED')
    console.log('RESTART')
  })

  // on ability
  socket.on('ability', (abilityName) => {
  })

  // on turn
  socket.on('turn', (tile) => {
    let playerNum = board.getPlayerNumBySocketID(socket.id)
    if((board.turnCount % 2) + 1 != playerNum) return socket.emit('msg', 'Not your turn!')

    board.gridChanges.push({x: tile.x, y: tile.y, what: 'owner', to: socket.id })
    board.sendGridChanges()

    board.turnCount++
  })
}