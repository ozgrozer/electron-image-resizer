const { app, BrowserWindow } = require('electron')
let win

const createWindow = () => {
  win = new BrowserWindow({
    width: 360,
    height: 260,
    show: false,
    resizable: false,
    titleBarStyle: 'hidden',
    backgroundColor: '#3a3936'
  })
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
