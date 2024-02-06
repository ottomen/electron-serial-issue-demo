# electron-serial-issue-demo

Demo of the issue with serial port on Electron on MacOS
for [https://github.com/electron/electron/issues/41220](https://github.com/electron/electron/issues/41220).

It fails on MacOS in the Electron development mode, but works on Windows.

## How to reproduce

1. Clone this repository
2. Run `yarn install` in the electron directory
3. Run `yarn install` in the ui directory
4. Run `yarn start` in the ui directory
5. Run `yarn start` in the electron directory
6. Click on the "Open port" button
7. The app will crash with the following error:

```
Electron[65218:1757122] -[IOBluetoothDeviceInquiry initWithDelegate:] -  0x13c00db9e00
setDevicePermissionHandler fired with http://localhost:3000
/Users/{user}/electron-serial-issue/electron/node_modules/electron/dist/Electron.app/Contents/MacOS/Electron exited with signal SIGABRT
error Command failed with exit code 1.
```
