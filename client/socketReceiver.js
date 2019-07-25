let msgFadingTimeout
socket.on('msg', (data) => {
  $('#msg').html(data)
  $('#msg').fadeIn(500)
  if(msgFadingTimeout != undefined) clearInterval(msgFadingTimeout)
  if(data == 'Waiting for opponent...') return
  if(data == 'You won!') return
  if(data == 'You lost :(') return
  msgFadingTimeout = setTimeout(() => {
    $('#msg').html('')
    $('#msg').fadeOut(0)
  }, 2000)
})

socket.on('gridChanges', changes => {
  for(let change of changes) {
    let x = change.x

    if(playerNum == 2) x = board.size.x - x - 1

    if(change.to == socket.id) playerTileCount++
    else opponentTileCount++

    grid.setTile(x, change.y, change.to)

    updateTileCount()
  }
})

socket.on('turnTimer', timeLeft => {
  $('#turnTimeLeft').html(timeLeft+'s..')
})

let playerNum = 0
socket.on('joined', (data) => {
  board = data

  if(board.player1 == socket.id) playerNum = 1
  if(board.player2 == socket.id) playerNum = 2

  if(playerNum == 1) board.opponent = board.player2
  if(playerNum == 2) board.opponent = board.player1

  if(playerNum == 1) board.me = board.player1
  if(playerNum == 2) board.me = board.player2

  let usernames = {}
  usernames[board.player1] = board.player1Username
  usernames[board.player2] = board.player2Username

  $('#player-stats .username').html(usernames[board.me])
  $('#opponent-stats .username').html(usernames[board.opponent])

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
})

let turnCount
socket.on("turnCount", (data) => {
  turnCount = data

  if((turnCount % 2) + 1 == playerNum) $('#turn').html('Your turn! <span id="turnTimeLeft"></span>')
  if((turnCount % 2) + 1 != playerNum) $('#turn').html('Opponents turn! <span id="turnTimeLeft"></span>')
})