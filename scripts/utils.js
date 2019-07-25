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
  },
  getNeighbors(board, tile) {
    let grid = board.grid
    let X = tile.x
    let Y = tile.y
    let neighbors = []
    let players = {}
    players[board.player1.socket.id] = 0
    players[board.player2.socket.id] = 0
    players['none'] = 0


    if(grid[X-1] && grid[X-1][Y  ]) players[grid[X-1][Y  ]]++
    if(grid[X-1] && grid[X-1][Y-1]) players[grid[X-1][Y-1]]++
    if(grid[X  ] && grid[X  ][Y-1]) players[grid[X  ][Y-1]]++
    if(grid[X+1] && grid[X+1][Y-1]) players[grid[X+1][Y-1]]++
    if(grid[X+1] && grid[X+1][Y  ]) players[grid[X+1][Y  ]]++
    if(grid[X+1] && grid[X+1][Y+1]) players[grid[X+1][Y+1]]++
    if(grid[X  ] && grid[X  ][Y+1]) players[grid[X  ][Y+1]]++
    if(grid[X-1] && grid[X-1][Y+1]) players[grid[X-1][Y+1]]++

    return players
  }
}