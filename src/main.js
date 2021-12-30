const { app, BrowserWindow , ipcMain} = require('electron');
const path = require('path');

let mainWindow;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    maximizable:false,
    autoHideMenuBar:true,
    icon:"src/logo.png",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      resizable: false
    },
    frame: false,
  });

  // Register an event listener. When ipcRenderer sends mouse click co-ordinates, show menu at that position.
app.on(`display-app-menu`, function(e, args) {
  if (isWindows && mainWindow) {
    menu.popup({
      window: mainWindow,
      x: args.x,
      y: args.y
    });
  }
});

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

// Function to create child window of parent one
function createChildWindow() {
  childWindow = new BrowserWindow({
    width: 320,
    height: 240,
    modal: true,
    show: false,
    parent: mainWindow, // Make sure to add parent window here,
    autoHideMenuBar:true,
    maximizable:false,
  
    // Make sure to add webPreferences with below configuration
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });
  
  // Child window loads settings.html file
  childWindow.loadFile(path.join(__dirname, 'settings.html'));
  
  childWindow.once("ready-to-show", () => {
    childWindow.show();
  });
}
  
ipcMain.on("openChildWindow", (event, arg) => {
  createChildWindow();
});
  
