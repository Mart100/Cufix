const Bot = require('./bot.js')

let bot = new Bot('Mork-Bot')
bot.serverAdress = 'http://localhost:3000'
bot.logging = false

bot.connectSocket()


bot.on('connect', () => {
  bot.join('botRoom')
})

bot.on('turn', (grid) => {
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
        let neighborTypes = bot.getTileNeighbors(grid, tilePos)

        // if has more enemys then friendly --continue
        if(neighborTypes[2] > neighborTypes[1]) continue

        // if no friendly neighbors at all --continue
        if(neighborTypes[1] == 0) continue

        // else select this tile as target
        selectedTile = tilePos

      }
    }
  }
  return selectedTile
})