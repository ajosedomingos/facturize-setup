const { app, BrowserWindow, Menu, shell, ipcMain, nativeImage } = require("electron");
const path = require("path");
const { printer: ThermalPrinter, types: PrinterTypes, CharacterSet, BreakLine } = require("node-thermal-printer");

let mainWindow;

const APP_ID = "net.facturize.app";
const APP_NAME = "Facturize";
const APP_URL = "https://app.facturize.net";
const APP_ICON_PATH = path.join(__dirname, "assets", "facturize-logo.png");
const APP_ICON = nativeImage.createFromPath(APP_ICON_PATH);


function createWindow() {

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1000,
    minHeight: 700,
    title: APP_NAME,
    autoHideMenuBar: true,
    show: false,
    icon: APP_ICON,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      plugins: true,
      preload: path.join(__dirname, "preload.js")
    }
  });

  Menu.setApplicationMenu(null);

  mainWindow.loadURL(APP_URL);

  mainWindow.once("ready-to-show", () => {
    if (process.platform === "win32") mainWindow.setIcon(APP_ICON);
    mainWindow.show();
  });

  // =========================================
  // CONTROLAR NOVAS JANELAS
  // =========================================
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {

    // PDFs e relatórios abrem DENTRO do Electron
    if (
      url.includes(".pdf") ||
      url.includes("/prints/")
    ) {

      const pdfWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        autoHideMenuBar: true,

        title: APP_NAME,

        icon: APP_ICON,

        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true,
          sandbox: true,
          plugins: true
        }
      });

      pdfWindow.loadURL(url);

      return { action: "deny" };
    }

    // Links do sistema continuam dentro
    if (url.startsWith(APP_URL)) {
      mainWindow.loadURL(url);
      return { action: "deny" };
    }

    // Links externos abrem navegador
    shell.openExternal(url);

    return { action: "deny" };
  });

  // =========================================
  // EVITAR ABERTURA EXTERNA
  // =========================================
  mainWindow.webContents.on("will-navigate", (event, url) => {

    const currentUrl = mainWindow.webContents.getURL();

    // PDFs ficam internos
    if (
      url.includes(".pdf") ||
      url.includes("/prints/")
    ) {
      event.preventDefault();

      const pdfWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        autoHideMenuBar: true,

        title: APP_NAME,

        icon: APP_ICON,

        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true,
          sandbox: true,
          plugins: true
        }
      });

      pdfWindow.loadURL(url);

      return;
    }

    // Navegação interna
    if (url.startsWith(APP_URL)) {
      return;
    }

    // Navegação externa
    if (url !== currentUrl) {
      event.preventDefault();
      shell.openExternal(url);
    }

  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

}

// =========================================
// APP READY
// =========================================
app.whenReady().then(() => {

  createWindow();

  // Corrige ícone da barra de tarefas no Windows
  if (process.platform === "win32") {
    app.setAppUserModelId(APP_ID);
  }

});

// macOS
app.on("activate", () => {

  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }

});

// Fechar app
app.on("window-all-closed", () => {

  if (process.platform !== "darwin") {
    app.quit();
  }

});
