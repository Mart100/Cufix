let canvas
let ctx


function startDrawing() {
  // prepare ctx and canvas
  canvas = document.getElementById('canvas')
  ctx = canvas.getContext("2d")

  // Set Canvas size
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  // begin frame
  frame()
}



function frame() {
  requestAnimationFrame(frame)

  // Set Canvas size
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  // Clear Screen
  ctx.clearRect(0, 0, canvas.width, canvas.height)


  grid.draw()

}


const draw = {
}