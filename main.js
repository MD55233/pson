const { app, BrowserWindow } = require('electron');
const path = require('path');
const { exec } = require('child_process');

let mainWindow;

function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            contextIsolation: true,
        },
    });

    // Load React frontend
    mainWindow.loadFile(path.join(__dirname, 'build', 'index.html'));
    // For development

    // In production, load the built React files
    // mainWindow.loadFile(path.join(__dirname, 'build', 'index.html'));

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// Start Express server
function startServer() {
    exec('node server.js', (err, stdout, stderr) => {
        if (err) {
            console.error(`Error starting server: ${stderr}`);
        } else {
            console.log(stdout);
        }
    });
}

app.on('ready', () => {
    startServer(); // Start backend
    createMainWindow(); // Create desktop app
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (!mainWindow) {
        createMainWindow();
    }
});
