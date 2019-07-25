class Grid {
  constructor(width, height) {
    this.width = Math.floor(width)
    this.height = Math.floor(height)

    this.data = []

    // create grid canvas
    this.canvas = document.getElementById('grid_canvas')
    this.canvas.width = this.width
    this.canvas.height = this.height
    this.canvasCTX = this.canvas.getContext('2d')

    // create canvas 1
    this.canvas1 = document.createElement('canvas')
    this.canvas1.width = this.width
    this.canvas1.height = this.height
    this.ctx1 = this.canvas1.getContext('2d')
    this.imgData = this.ctx1.createImageData(this.width, this.height)

    this.createGrid()
  }
  setCanvasSize(width, height) {
    this.canvas.width = width
    this.canvas.height = height
  }
  createGrid() {
    for(let x=0;x<this.width;x++) {
      this.data[x] = []
      for(let y=0;y<this.height;y++) {
        this.data[x][y] = {}
        let owner = 'none'
        this.setTile(x, y, owner)
      }
    }
  }
  forEveryTile(func) {
    for(let x=0;x<this.width;x++) {
      for(let y=0;y<this.height;y++) {
        let newTile = func(x, y, this.data[x][y])
        if(newTile != undefined) this.data[x][y] = newTile
      }
    }
  }
  getTile(x, y) {
    return this.data[x][y]
  }
  setTile(x, y, to) {
    let tile = this.data[x][y]
    tile = to

    let color = [0,0,0,0]

    if(to == socket.id) color = [0, 0, 200, 255]
    else color = [255, 0, 0, 255]

    if(to == 'none') color = [100, 100, 100, 255]

    if(x % 2 == y%2 || y % 2 == x%2) color[2] -= 55
    if(x % 2 == y%2 || y % 2 == x%2) color[0] -= 55

    this.setImgData(x, y, color)
  }
  completeImgDataCalc() {
    this.forEveryTile((x, y, tile) => {
      for(let prop in tile) {
        this.setTile(x, y, prop, tile[prop])
      }
    })
  }
  setImgData(x, y, color) {
    let idx = (y*this.width*4) + (x*4)
    this.imgData.data[idx] = color[0]
    this.imgData.data[idx+1] = color[1]
    this.imgData.data[idx+2] = color[2]
    this.imgData.data[idx+3] = color[3]
  }
  canvasToGridPos(x, y) {
    let pos = {x:0, y:0}
    pos.x = Math.floor(x/this.canvas.width*this.width)
    pos.y = Math.floor(y/this.canvas.height*this.height)
    return pos
  }
  draw() {
    this.ctx1.putImageData(this.imgData, 0, 0)
    this.canvasCTX.drawImage(this.canvas1, 0, 0, this.canvas.width, this.canvas.height)
    this.canvasCTX.mozImageSmoothingEnabled = false
    this.canvasCTX.imageSmoothingEnabled = false

  }
}