const {
  app,
  BrowserWindow,
  ipcMain,
  Tray,
  Menu,
  Notification,
} = require("electron");
const path = require("path");

let mainWindow;
let tray = null;

app.setAppUserModelId("BreakRem");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

const gotTheLock = app.requestSingleInstanceLock();

// Prevent multiple instaces of the app
if (!gotTheLock) {
  app.exit();
}

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    title: "BreakRem",
    width: 800,
    height: 650,
    icon: path.join(__dirname, `../dist/frontend/assets/images/logo.ico`),
    webPreferences: {
      preload: path.join(__dirname, "../preload.js"),
      nodeIntegration: true,
      // contextIsolation: true,
      backgroundThrottling: false,
    },
  });

  // load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, `../dist/frontend/index.html`));

  // Remove the default menu
  Menu.setApplicationMenu(null);

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.on("minimize", function (event) {
    event.preventDefault();
    mainWindow.hide();
  });

  mainWindow.on("restore", function (event) {
    mainWindow.show();
    // tray.destroy();
  });

  mainWindow.on("close", (event) => {
    // Prevent the window from closing immediately
    event.preventDefault();

    // Hide the main window after showing the notification
    mainWindow.hide();

    // Create and show the notification
    const notification = new Notification({
      body: "App is still running in the background.",
      icon: path.join(__dirname, `../dist/frontend/assets/images/logo.ico`), // Replace 'path-to-icon' with the actual path to your app icon
    });
    notification.show();
  });

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

const createTray = () => {
  tray = new Tray(
    path.join(__dirname, `../dist/frontend/assets/images/logo.ico`)
  );
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Show App",
      click: () =>
        mainWindow.isVisible() ? mainWindow.focus() : mainWindow.show(),
    },
    { type: "separator" },
    { label: "Exit BreakRem", click: app.exit },
  ]);

  tray.setToolTip("BreakRem");
  tray.setContextMenu(contextMenu);
  tray.on("click", () =>
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
  );
};

const fireNotification = (event, notificationData) => {
  const window = BrowserWindow.fromWebContents(event.sender);
  // Create and show the notification based on the data received from the Angular component
  const notification = new Notification({
    title: notificationData.title,
    body: notificationData.message,
    icon: path.join(__dirname, `../dist/frontend/assets/images/logo.ico`),
    silent: notificationData.sound,
  });

  notification.on("click", () => {
    // Notify the Angular renderer process that the notification is clicked
    window.webContents.send("close-notification");
    window.isVisible() ? window.focus() : window.show();
  });

  notification.on("close", () => {
    // Notify the Angular renderer process that the notification is closed
    window.webContents.send("close-notification");
  });

  notification.show();
};

const showMainWindow = () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) {
      // Restore the window if it is minimized
      mainWindow.restore();
    }

    if (mainWindow.isVisible()) {
      // Bring the window to focus if it is visible but not minimized
      mainWindow.focus();
    } else {
      mainWindow.show();
    }
  }
};

// Globally enable sandboxing for all renderers
app.enableSandbox();

// This method will be called when Electron has finished initialization and is ready to create browser windows.
app.whenReady().then(() => {
  createWindow();
  createTray();

  ipcMain.handle("fire-notification", fireNotification);
  ipcMain.handle("show-main-window", showMainWindow);
});

// Quit when all windows are closed
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // to re-create a window
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
