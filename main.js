const electron = require("electron");
const url = require("url");
const path = require("path");

const {app, BrowserWindow, Menu} = electron;

let mainWindow;

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
	// Building menu
	const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)
	Menu.setApplicationMenu(mainMenu)
});


// Create menu template
const mainMenuTemplate = [
	{
		label: "File",
		submenu: [
			{
				label:"Add Item" // not yet implemeted

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
]


