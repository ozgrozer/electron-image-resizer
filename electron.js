const { app, BrowserWindow } = require('electron')
let win

const createWindow = () => {
  win = new BrowserWindow({ width: 640, height: 480, show: false })
  win.loadURL(`file://${__dirname}/src/index.html`)
  win.once('ready-to-show', () => {
    win.show()
  })
  win.on('closed', () => {
    win = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  app.quit()
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})
