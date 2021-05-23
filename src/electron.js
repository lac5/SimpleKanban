const { app, BrowserWindow } = require("electron");
const { join } = require("path");
const { promises: { readFile } } = require('fs');
const { pathToFileURL } = require('url');

const DEBUG = process.env.NODE_ENV !== 'production';

let win;

function createWindow() {
    win = new BrowserWindow({
        webPreferences: {
            devTools: DEBUG,
            preload: join(__dirname, "preload.js")
        },
    });

    win.maximize();
    if (!DEBUG) {
        win.setMenu(null);
    }

    win.loadURL(pathToFileURL(join(__dirname, "index.html")).toString()).then(() => {
        let file = process.argv[2];
        if (file) {
            return updateJson(file);
        }
    }).catch(console.error);

    win.webContents.openDevTools();
}

async function updateJson(file) {
    let json = JSON.parse(String(await readFile(file)));
    return BrowserWindow.webContents.executeJavaScript(`window.updateJson(${JSON.stringify(json)})`);
}

app.on("ready", () => {
    createWindow();
    app.on("activate", function () {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("open-closed", (_event, file) => {
    updateJson(file).catch(console.error);
});
