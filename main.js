const electron = require("electron");
const path = require("path");
const url = require("url");

const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;
let addWindow;

// ONLY FOR DEVELOPMENT MUST DELETE FOR PROD:
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
// MUST DELETE LINE ABOVE FOR PROD.



//Listen for app to be ready
app.on('ready', function(){
	// Create new window
	mainWindow = new BrowserWindow({
		webPreferences: {
			preload: path.join(__dirname, 'preload.js')
		}
	});
	// Load html
	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, "mainWindow.html"),
		protocol: 'file:',
		slashes: true	
	}));
	// Quit everyting when closing main window
	mainWindow.on('closed', function(){
		app.quit();
	})
	// Building menu
	const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)
	Menu.setApplicationMenu(mainMenu)
});

// Handling createAddWindow function 

function createAddWindow(){
	// Create new window
	addWindow = new BrowserWindow({
		width:300,
		height:200,
		title:'Add Shopping List Item',
		webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
	});
	// Load html
	addWindow.loadURL(url.format({
		pathname: path.join(__dirname, "addWindow.html"),
		protocol: 'file:',
		slashes: true	
	}));
	// Garbage collection handling for this window
	addWindow.on('closed', function(){
		addWindow = null;
	});
	addWindow.webContents.openDevTools();
}

ipcMain.on('item:add', function (e, item) {
    console.log(item, "From main.js");
    mainWindow.webContents.send('item:add', item);
    addWindow.close();
});

ipcMain.on("msg", (event, data) => {
    console.log(data);
});

// Create menu template
const mainMenuTemplate = [
	{
		label: "File",
		submenu: [
			{
				label:"Add Item",
				click(){
					createAddWindow();
				} // not yet implemeted

			},
			{
				label:"Clear Items" // not yet implemented
			},
			{
				label:"Quit",
				accelerator: process.platform == 'darwin' ? 'Command+Q':'Ctrl+Q',
				click(){
					app.quit();
				}
			}
		]
	}
];

// Have the menu show as "File" insted of "Electron" on MACOS
if (process.platform == "darwin"){
	//unshift adds this empty object to the first item of the mainMenuTemplate array.
	mainMenuTemplate.unshift({ role: 'fileMenu' });  // role fill avoids an error but must check if there's an actual role for this purposse
}

// Add devTools if not in production 
if (process.env.NODE_ENV !== "production"){
	mainMenuTemplate.push({
		label: "Developer Tools",
		submenu:[
			{
				role: "reload"
			},
			{
				label: "Toggle DevTools",
				accelerator:process.platform == 'darwin' ? 'Command+I':'Ctrl+I',
				click(item, focusedWindow){
					focusedWindow.toggleDevTools();
				}
			}
		]
	});
}

app.on('window-all-closed', () => {                // quitting the app when no windows are open on non-macOS platforms
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

