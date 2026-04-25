"use strict";
const electron = require("electron");
const path = require("path");
const loudness = require("loudness");
let win = null;
let quitting = false;
function scheduleJitter(window) {
  const delay = 1e4 + Math.random() * 2e4;
  setTimeout(async () => {
    try {
      const current = await loudness.getVolume();
      const deltas = [-2, -1, 3, 5];
      const delta = deltas[Math.floor(Math.random() * deltas.length)];
      const next = Math.max(0, Math.min(100, current + delta));
      await loudness.setVolume(next);
      if (!window.isDestroyed()) {
        window.webContents.send("volume-changed", { volume: next });
      }
    } catch {
    }
    if (!window.isDestroyed()) scheduleJitter(window);
  }, delay);
}
function createWindow() {
  win = new electron.BrowserWindow({
    width: 500,
    height: 380,
    resizable: false,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
      autoplayPolicy: "no-user-gesture-required",
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  electron.Menu.setApplicationMenu(null);
  win.on("close", (e) => {
    if (!quitting) {
      e.preventDefault();
      win?.webContents.send("trigger-punishment");
    }
  });
  if (process.env.NODE_ENV === "development") {
    win.loadURL("http://localhost:5173");
  } else {
    win.loadFile(path.join(__dirname, "../renderer/index.html"));
  }
  scheduleJitter(win);
}
electron.app.on("ready", createWindow);
electron.app.on("before-quit", (e) => {
  if (!quitting) {
    e.preventDefault();
    win?.webContents.send("trigger-punishment");
  }
});
electron.app.on("window-all-closed", () => {
});
electron.ipcMain.handle("set-volume", async (_event, { volume }) => {
  const clamped = Math.max(0, Math.min(100, volume));
  await loudness.setVolume(clamped);
  win?.webContents.send("volume-changed", { volume: clamped });
});
electron.ipcMain.handle("get-volume", async () => {
  return loudness.getVolume();
});
if (process.env.NODE_ENV === "development") {
  electron.ipcMain.handle("force-quit", () => {
    quitting = true;
    electron.app.quit();
  });
}
