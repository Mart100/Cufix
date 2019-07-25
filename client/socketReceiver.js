let msgFadingTimeout
socket.on('msg', (data) => {
  $('#msg').html(data)
  $('#msg').fadeIn(500)
  if(msgFadingTimeout != undefined) clearInterval(msgFadingTimeout)
  if(data == 'Waiting for opponent...') return
  msgFadingTimeout = setTimeout(() => {
    $('#msg').html('')
    $('#msg').fadeOut(0)
  }, 2000)
})

socket.on('gridChanges', changes => {
  for(let change of changes) {
    let x = change.x

    if(change.to != socket.id) {
      if(playerNum == 1) x+=1
      if(playerNum == 2) x-=1
    }

    if(playerNum == 1) x = board.size.x - x

    grid.setTile(x, change.y, change.what, change.to)
  }
})

socket.on('energy', (data) => {
  energy = Math.round(data)
  $('#energy').html('Energy: '+energy)
})

let playerNum = 0
socket.on('joined', (data) => {
  board = data

  if(board.player1 == socket.id) playerNum = 1
  if(board.player2 == socket.id) playerNum = 2

  if(playerNum == 1) board.opponent = board.player2
  if(playerNum == 2) board.opponent = board.player1

  console.log('joined')

  history.replaceState(board.id, '', `/${board.id}/`)
  grid = new Grid(board.size.x, board.size.y)

  // calculate canvas size
  let tileSize = 100
  let maxTileSizeX = (window.innerWidth)/board.size.x
  let maxTileSizeY = (window.innerHeight - 150)/board.size.y

  if(maxTileSizeX < tileSize) tileSize = maxTileSizeX
  if(maxTileSizeY < tileSize) tileSize = maxTileSizeY


  let canvasWidth = tileSize*board.size.x
  let canvasHeight = tileSize*board.size.y

  grid.setCanvasSize(canvasWidth, canvasHeight)

  startDrawing()
  configureInputs()
  setInterval(() => { tick() }, 10)
})

let turn
socket.on("turn", (who) => {
  turn = who
})