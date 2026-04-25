import { app, BrowserWindow, ipcMain, Menu } from 'electron'
import { join } from 'path'
import loudness from 'loudness'

let win: BrowserWindow | null = null
let quitting = false

function scheduleJitter(window: BrowserWindow): void {
  const delay = 10_000 + Math.random() * 20_000 // 10–30s
  setTimeout(async () => {
    try {
      const current = await loudness.getVolume()
      const deltas = [-2, -1, 3, 5] as const
      const delta = deltas[Math.floor(Math.random() * deltas.length)]!
      const next = Math.max(0, Math.min(100, current + delta))
      await loudness.setVolume(next)
      if (!window.isDestroyed()) {
        window.webContents.send('volume-changed', { volume: next })
      }
    } catch {
      // ignore errors (e.g., no audio device)
    }
    if (!window.isDestroyed()) scheduleJitter(window)
  }, delay)
}

function createWindow(): void {
  win = new BrowserWindow({
    width: 500,
    height: 380,
    resizable: false,
    frame: false,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      autoplayPolicy: 'no-user-gesture-required',
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  Menu.setApplicationMenu(null)

  win.on('close', (e) => {
    if (!quitting) {
      e.preventDefault()
      // Trigger punishment instead of closing
      win?.webContents.send('trigger-punishment')
    }
  })

  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:5173')
  } else {
    win.loadFile(join(__dirname, '../renderer/index.html'))
  }

  scheduleJitter(win)
}

app.on('ready', createWindow)

// Prevent quit on macOS Cmd+Q
app.on('before-quit', (e) => {
  if (!quitting) {
    e.preventDefault()
    win?.webContents.send('trigger-punishment')
  }
})

// Prevent quit when all windows closed (required for before-quit override to work)
// The before-quit handler already prevents the quit; this listener keeps the app alive on all platforms
app.on('window-all-closed', () => {
  // intentionally do nothing — before-quit handles prevention
})

// IPC handlers
ipcMain.handle('set-volume', async (_event, { volume }: { volume: number }) => {
  const clamped = Math.max(0, Math.min(100, volume))
  await loudness.setVolume(clamped)
  win?.webContents.send('volume-changed', { volume: clamped })
})

ipcMain.handle('get-volume', async () => {
  return loudness.getVolume()
})

// Emergency escape hatch for development
if (process.env.NODE_ENV === 'development') {
  ipcMain.handle('force-quit', () => {
    quitting = true
    app.quit()
  })
}
