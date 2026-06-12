const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 680,
    minWidth: 700,
    minHeight: 500,
    backgroundColor: '#0f1117',
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    icon: path.join(__dirname, 'src', 'icon.png'),
  });

  win.loadFile(path.join(__dirname,'src','index.html'));

  // Menu minimal (Paramètres)
  const template = [
    {
      label: 'Paramètres',
      submenu: [
        {label: 'Changer la langue',click: () => win.webContents.send('open-settings')},
        { type: 'separator' },
        { label: 'Noter maintenant', click: () => require('electron').shell.openExternal('https://kryptis.netlify.app/reviews?source=app') },
        { type: 'separator' },
        { role: 'quit', label: 'Quitter' }
      ]
    }
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
