// global variables
let grid
let username
let board
let playerTileCount = 0
let opponentTileCount = 0


$(() => {
  let loc = window.location.pathname
  let dir = loc.substring(0, loc.lastIndexOf('/'))

  if(dir != '') {

    username = Cookies.get('username')
    if(username == undefined || username == '') username = 'Guest'

    $('body').html(`
      <canvas id="canvas"></canvas>
      <canvas id="grid_canvas"></canvas>
      <div id="HUD">
        <div id="msg"></div>
        <div id="turn"></div>
        <div id="stats">
          <div id="player-stats">
            <span class="username"></span><br>
            Tiles: <span class="tileCount"></span>
          </div>
          <div id="opponent-stats">
            <span class="username"></span><br>
            Tiles: <span class="tileCount"></span>
          </div>
        </div>
      </div>
    `)

    socket.emit('findGame', {gameID: '', username: username})
  }
  
  // show homepage
  else {
    $('body').html(`
    <div id="title">Cufix</div>
    <div id="username-div"><input id="username" type="text" placeholder="username"></div>
    <div id="play">Click to play</div>
    <br><br>
    <center>
    <a href="https://martvenck.com">Made by: Marto_0</a>
    <br><br>
    <a href="">Join us on discord
    <br><br>
    </center>
    `)

    $('#username').focus()

    let usernameCookie = Cookies.get('username')
    if(usernameCookie != undefined) $('#username').val(usernameCookie)

    $('#play').on('click', () => {

      username = $('#username').val()

      Cookies.set('username', username)

      window.location = './find'
    })
  }
})

function updateTileCount() {
  $('#player-stats .tileCount').html(playerTileCount)
  $('#opponent-stats .tileCount').html(opponentTileCount)
}

function spectate() {
  
}