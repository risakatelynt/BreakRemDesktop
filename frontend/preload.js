const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  fireNotification: (props) => ipcRenderer.invoke("fire-notification", props),
  onNotificationClose: (props) => ipcRenderer.on("close-notification", props),
  showMainWindow: () => ipcRenderer.invoke("show-main-window")
});
