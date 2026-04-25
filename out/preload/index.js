"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("jitterbox", {
  setVolume: (volume) => electron.ipcRenderer.invoke("set-volume", { volume }),
  getVolume: () => electron.ipcRenderer.invoke("get-volume"),
  onVolumeChange: (cb) => {
    const handler = (_event, payload) => {
      cb(payload.volume);
    };
    electron.ipcRenderer.on("volume-changed", handler);
    return () => electron.ipcRenderer.removeListener("volume-changed", handler);
  },
  onPunishmentTrigger: (cb) => {
    const handler = () => cb();
    electron.ipcRenderer.on("trigger-punishment", handler);
    return () => electron.ipcRenderer.removeListener("trigger-punishment", handler);
  }
});
