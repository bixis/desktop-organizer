const electron = require("electron");
const url = require("url");
const path = require("path");

const {app, BrowserWindow, Menu} = electron;

let mainWindow;
let addWindow;

//Listen for app to be ready

app.on('ready', function(){
	// Create new window
	mainWindow = new BrowserWindow();
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
		title:'Add Shopping List Item'
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
	})
}

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
			},
		
		]
	}
];

// Have the menu show as "File" insted of "Electron" on MACOS
if (process.platform == "darwin"){
	//unshift adds this empty object to the first item of the mainMenuTemplate array.
	mainMenuTemplate.unshift({role: 'fill'})  // role fill avoids an error but must check if there's an actual role for this purposse
}

// Add devTools if not in production 
if (process.env.NODE_ENV !== "production"){
	mainMenuTemplate.push({
		label: "Developer Tools",
		submenu:[
			{
				label: "Toggle DevTools",
				accelerator: process.platform == 'darwin' ? 'Command+I':'Ctrl+I',
				click(item, focusedWindow){
					focusedWindow.toggleDevTools();
				}
			},
			{
				role: "reload"
			}
		]
	});
}

app.on('window-all-closed', () => {                // quitting the app when no windows are open on non-macOS platforms
    if (process.platform !== 'darwin') {
        app.quit()
    }
})