///////////////////////////////////////////
//  XRI TEAM
//  Senior Project
//  Trying stuff out
//////////////////////////////////////////////

const electron = require('electron')
const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')
const {Menu, MenuItem} = require('electron')

const template = [
    {
      label: 'File',
      submenu: [
        {role: 'quit'}
      ]
     },
  {
    label: 'Edit',
    submenu: [
      {role: 'undo'},
      {role: 'redo'},
      {type: 'separator'},
      {role: 'cut'},
      {role: 'copy'},
      {role: 'paste'},
      {role: 'pasteandmatchstyle'},
      {role: 'delete'},
      {role: 'selectall'}
    ]
  },
  {
    label: 'View',
    submenu: [
      {role: 'reload',
			accelerator: 'CmdOrCtrl+R'},
      {role: 'forcereload',
            accelerator: 'CmdOrCtrl+.'},
      {role: 'toggledevtools',
            accelerator: 'F12'},
      {type: 'separator'},
      {role: 'resetzoom',
            accelerators: [ 'CmdOrCtrl+Plus', 'CmdOrCtrl+=' ]},
      {label: 'Zoom In',accelerator: 'CmdOrCtrl+=',click() { zoomIn() }},
      {label: 'Zoom Out',accelerator: 'CmdOrCtrl+-',click() { zoomOut() }},
      {type: 'separator'},
      {role: 'togglefullscreen',
             accelerator: 'Alt+Space+X'}
    ]
  },
  {
    role: 'window',
    submenu: [
      {role: 'minimize',
		accelerator: 'Alt+Space+N'},
      {role: 'close',
      accelerator: 'CmdOrCtrl+W'}
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
				accelerator: 'F1',

        // Open a local file in the default app
        click () { require('electron').shell.openItem('help.txt'); }
      }
    ]
  }
]

if (process.platform === 'darwin') {
  template.unshift({
    label: app.getName(),
    submenu: [
      {role: 'about'},
      {type: 'separator'},
      {role: 'services', submenu: []},
      {type: 'separator'},
      {role: 'hide'},
      {role: 'hideothers'},
      {role: 'unhide'},
      {type: 'separator'},
      {role: 'quit'}
    ]
  })

  // Edit menu
  template[1].submenu.push(
    {type: 'separator'},
    {
      label: 'Speech',
      submenu: [
        {role: 'startspeaking'},
        {role: 'stopspeaking'}
      ]
    }
  )

  // Window menu
  template[3].submenu = [
    {role: 'close',accelerator: 'CmdOrCtrl+W'},
    {role: 'minimize'},
    {role: 'zoom'},
    {type: 'separator'},
    {role: 'front'}
  ]
}


// Global reference of window to prevent garbage-collection
let win
//------------------------------------------------------------------------------
function createWindow () {

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)

	let height = electron.screen.getPrimaryDisplay().bounds.height
	let width = electron.screen.getPrimaryDisplay().bounds.width

	win = new BrowserWindow({width, height, icon: path.join(__dirname,'images/eye.png')})

	win.loadURL(url.format({
		pathname: path.join(__dirname, 'exercise_screen.html'),
		protocol: 'file',
		slashes: true
	}))

	// Emitted when the window is closed
	win.on('closed', () => {
		// Dereference window object
		win = null
	})
}
//------------------------------------------------------------------------------
// Response for pressing of zoom in hotkey
function zoomIn() {
    win.webContents.executeJavaScript(`handleZooming(true)`)
}
//------------------------------------------------------------------------------
// Response for pressing of zoom out hotkey
function zoomOut() {
    win.webContents.executeJavaScript(`handleZooming(false)`)
}
//------------------------------------------------------------------------------
// Called when Electron has finished initializing
app.on('ready', createWindow)

//------------------------------------------------------------------------------
// Quit when all windows are closed
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})
//------------------------------------------------------------------------------
app.on('activate', () => {
	if (win == null) {
		createWindow()
	}
})
//------------------------------------------------------------------------------
