const { app, BrowserWindow, Menu, shell } = require('electron')
const { autoUpdater } = require('electron-updater')

const menuTemplate = [
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'pasteandmatchstyle' },
      { role: 'delete' },
      { role: 'selectall' }
    ]
  },
  {
    role: 'window',
    submenu: [
      { role: 'minimize' },
      { role: 'close' }
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click () { shell.openExternal('https://github.com/ozgrozer/electron-image-resizer') }
      }
    ]
  }
]

if (process.platform === 'darwin') {
  menuTemplate.unshift({
    label: app.getName(),
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services', submenu: [] },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  })

  // Edit menu
  menuTemplate[1].submenu.push(
    { type: 'separator' },
    {
      label: 'Speech',
      submenu: [
        { role: 'startspeaking' },
        { role: 'stopspeaking' }
      ]
    }
  )

  // Window menu
  menuTemplate[2].submenu = [
    { role: 'close' },
    { role: 'minimize' },
    { role: 'zoom' },
    { type: 'separator' },
    { role: 'front' }
  ]
}

let win

const createWindow = () => {
  const menu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(menu)

  win = new BrowserWindow({
    width: 360,
    height: 260,
    show: false,
    frame: false,
    resizable: false,
    maximizable: false,
    backgroundColor: '#313b46',
    titleBarStyle: 'hiddenInset'
  })
  win.loadURL(`file://${__dirname}/src/index.html`)
  /* win.webContents.openDevTools() */
  win.once('ready-to-show', () => {
    win.show()
  })
  win.on('closed', () => {
    win = null
  })

  autoUpdater.checkForUpdatesAndNotify()
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
