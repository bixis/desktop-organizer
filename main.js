const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
const url = require('url');

let mainWindow;
let addWindow;

// Listen for app to be ready
app.on('ready', function () {
  // Create main window
  mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Load main window HTML
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, "mainWindow.html"),
    protocol: 'file:',
    slashes: true
  }));

  // Quit app when main window is closed
  mainWindow.on('closed', function () {
    app.quit();
  });

  // Build menu
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(mainMenu);
});

// Create add window
function createAddWindow() {
  addWindow = new BrowserWindow({
    width: 300,
    height: 200,
    title: 'Add Shopping List Item',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Load add window HTML
  addWindow.loadURL(url.format({
    pathname: path.join(__dirname, "addWindow.html"),
    protocol: 'file:',
    slashes: true
  }));

  // Handle garbage collection
  addWindow.on('closed', function () {
    addWindow = null;
  });
}

// Handle add-todo event
ipcMain.on('add-todo', (event, todo) => {
  console.log('Received todo from renderer process:', todo);
  mainWindow.webContents.send('update-todo-list', todo);
});

// Menu template
const mainMenuTemplate = [
  {
    label: "File",
    submenu: [
      {
        label: "Add Item",
        click() {
          createAddWindow();
        }
      },
      {
        label: "Clear Items" // not yet implemented
      },
      {
        label: "Quit",
        accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click() {
          app.quit();
        }
      }
    ]
  }
];

// Handle macOS
if (process.platform === 'darwin') {
  mainMenuTemplate.unshift({ role: 'fileMenu' });
}

// Add devTools if not in production
if (process.env.NODE_ENV !== "production") {
  mainMenuTemplate.push({
    label: "Developer Tools",
    submenu: [
      { role: "reload" },
      {
        label: "Toggle DevTools",
        accelerator: process.platform === 'darwin' ? 'Command+I' : 'Ctrl+I',
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        }
      }
    ]
  });
};