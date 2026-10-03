const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("facturizeDesktop", {
  isElectron: true,
  version: () => ipcRenderer.invoke("facturize:version"),
  listPrinters: () => ipcRenderer.invoke("facturize:list-printers"),
  printPdf: (payload) => ipcRenderer.invoke("facturize:print-pdf-url", payload),
  printTicket: (payload) => ipcRenderer.invoke("facturize:print-ticket", payload),
});
