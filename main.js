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
	// Building menu
	const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)
	Menu.setApplicationMenu(mainMenu)
});

// Handling createAddWindow function 

function createAddWindow(){
	// Create new window
	addWindow = new BrowserWindow({
		width:200,
		height:300,
		title:'Add Shopping List Item'
	});
	// Load html
	addWindow.loadURL(url.format({
		pathname: path.join(__dirname, "addWindow.html"),
		protocol: 'file:',
		slashes: true	
	}));
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
]


