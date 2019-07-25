// global variables
let energy = 0
let abilitiesData = []
let abilities = []
let grid
let board


$(() => {
  let loc = window.location.pathname
  let dir = loc.substring(0, loc.lastIndexOf('/'))

  if(dir != '') {
    $('body').html(`
      <canvas id="canvas"></canvas>
      <canvas id="grid_canvas"></canvas>
      <div id="HUD">
        <div id="msg"></div>
        <div id="energy">Energy: 0</div>
      </div>
    `)

    socket.emit('findGame', '')
  }
  
  // show homepage
  else {
    $('body').html(`
    <div id="title">Cufix</div>
    <div id="play">Click to play</div>
    <br><br>
    <center>
    <a href="https://martve.me">Made by: Marto_0</a>
    <br><br>
    <a href="">Join us on discord:<br> <img src="https://i.imgur.com/yoSi7FR.png"/></a>
    <br><br>
    </center>
    `)
    $('#play').on('click', () => {
      window.location = './find'
    })
  }
})