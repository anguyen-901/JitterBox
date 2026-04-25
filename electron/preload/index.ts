import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('jitterbox', {
  setVolume: (volume: number) =>
    ipcRenderer.invoke('set-volume', { volume }),

  getVolume: () =>
    ipcRenderer.invoke('get-volume'),

  onVolumeChange: (cb: (volume: number) => void) => {
    const handler = (_event: Electron.IpcRendererEvent, payload: { volume: number }) => {
      cb(payload.volume)
    }
    ipcRenderer.on('volume-changed', handler)
    return () => ipcRenderer.removeListener('volume-changed', handler)
  },

  onPunishmentTrigger: (cb: () => void) => {
    const handler = () => cb()
    ipcRenderer.on('trigger-punishment', handler)
    return () => ipcRenderer.removeListener('trigger-punishment', handler)
  },
})
