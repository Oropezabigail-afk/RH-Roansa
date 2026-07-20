const { app, BrowserWindow } = require('electron');
const path = require('path');

// index.html vive en la raíz del repo (RH-Roansa/index.html).
// electron-builder lo copia como "extraResources" al empaquetar.
function getIndexPath() {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, 'index.html');
  }
  return path.join(__dirname, '..', 'index.html');
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1366,
    height: 860,
    minWidth: 1000,
    minHeight: 650,
    autoHideMenuBar: true,
    backgroundColor: '#eef0f3',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  win.loadFile(getIndexPath());
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
