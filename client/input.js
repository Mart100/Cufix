let mousePos = {x: window.innerWidth/2, y: window.innerHeight/2}
let mouseLocked = false

function configureInputs() {

  // disable right click
  document.addEventListener('contextmenu', event => event.preventDefault())

  // mouse movement
  document.addEventListener('mousemove', (event) => {
    mousePos = {x: event.clientX, y: event.clientY}
  })
  
  // on click
  $(document).on('click', (event) => {
    let posX = mousePos.x - ((window.innerWidth-grid.canvas.width)/2)
    let posY = mousePos.y - ((window.innerHeight-grid.canvas.height)/2)
    let tile = grid.canvasToGridPos(posX, posY)
    if(playerNum == 1) tile.x = board.size.x - tile.x
    socket.emit('turn', tile)
    console.log(tile)
  })
}