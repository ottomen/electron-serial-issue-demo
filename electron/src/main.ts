import {app, BrowserWindow} from 'electron';
import path from 'node:path';

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        }
    })

    mainWindow.loadURL('http://localhost:3000');

    sessionSetup(mainWindow);

    mainWindow.webContents.openDevTools();
}

const sessionSetup = (mainWindow: BrowserWindow | null) => {
    if (!mainWindow) return;

    mainWindow.webContents.session.on('select-serial-port', (event, portList, webContents, callback) => {
        // Add listeners to handle ports being added or removed before the callback for `select-serial-port`
        // is called.
        mainWindow?.webContents.session.on('serial-port-added', (event, port) => {
            console.log('serial-port-added fired with', port);
        });

        mainWindow?.webContents.session.on('serial-port-removed', (event, port) => {
            console.log('serial-port-removed fired with', port);
        });

        event.preventDefault();

        if (portList && portList.length > 0) {
            callback(portList[0].portId);
        } else {
            callback('');
        }
    });

    mainWindow.webContents.session.setPermissionCheckHandler(
        (webContents, permission, requestingOrigin, details) => {
            console.log('setPermissionCheckHandler fired with', permission, requestingOrigin, details.securityOrigin);

            return permission === 'serial';
        }
    );

    mainWindow.webContents.session.setDevicePermissionHandler((details) => {
        console.log('setDevicePermissionHandler fired with', details.origin);

        return details.deviceType === 'serial';
    });
};

app.whenReady().then(() => {
    createWindow()

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})
