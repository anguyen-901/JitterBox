# JitterBox

> The worst possible volume control.

A cross-platform desktop app that turns adjusting system volume into a high-stakes psychological ordeal. To change the volume, you must type the exact English word representation of your desired level into a chaos input field that actively resists being used.

## What It Does

- **Type to set volume** — want 42%? Type `forty-two percent`. Exactly. No digits. No shortcuts.
- **Wrong input** — volume instantly snaps to 100% and plays a smoke detector low-battery chirp (twice).
- **The input fights back** — each character renders in a random font, size, and rotation that reshuffles on every keystroke.
- **The input drifts** — the entire input field floats around the window on a sine wave that slowly gets worse the longer you use it.
- **The UI flips** — every 8–20 seconds the entire interface mirrors horizontally without warning. Input still registers normally.
- **It lies to you** — 40% of submissions silently misspell one word in the last 80ms before validation (e.g. `forty` → `fourty`), causing punishment.
- **It drifts while you're not looking** — the volume jitters every 10–30 seconds even when the app is minimized. Deltas are asymmetric: it can drop by 1–2% but creep up by 3–5%, so it trends louder over time.
- **There is no close button** — the "MAKE LOUDER" button in the title bar triggers punishment instead of closing. Cmd+Q does the same.

## Getting Started

### Prerequisites

- Node.js 18+
- macOS or Windows

### Install

```bash
npm install
```

### Run in development

```bash
npm run dev
```

### Run tests

```bash
npm test
```

### Type check

```bash
npm run typecheck
```

## Building for Distribution

```bash
# macOS (produces .dmg for x64 and arm64)
npm run build:mac

# Windows (produces .exe NSIS installer for x64)
npm run build:win
```

Output lands in `dist-electron/`.

> Note: macOS distribution requires code signing and notarization. The app will run unsigned in development.

## Tech Stack

| | |
|---|---|
| **Shell** | Electron 31 |
| **UI** | React 18 + TypeScript |
| **Build** | electron-vite + Vite 5 |
| **Animations** | framer-motion |
| **Volume control** | loudness (native, macOS + Windows) |
| **Word validation** | number-to-words |
| **Tests** | Vitest + React Testing Library |
| **Packaging** | electron-builder |

## Architecture

```
electron/
  main/index.ts       — Window, IPC handlers, jitter timer (runs when minimized)
  preload/index.ts    — contextBridge: exposes window.jitterbox API to renderer
src/
  lib/
    volumeParser.ts   — Word→number validation ("forty-two percent" → 42)
    chaosFont.ts      — Per-character font/size/rotation randomization
    punishment.ts     — Web Audio API smoke detector chirp synthesis
  hooks/
    useGaslighting.ts — 40% pre-submit word swap, fires 80ms before validation
    useVolumeSync.ts  — Subscribes to main-process volume change events
    useMirrorMode.ts  — Random horizontal UI flip (8–20s interval, 3–7s duration)
  components/
    ChaosInput.tsx    — Hidden input + chaotic visual display layer
    FloatingWrapper.tsx — Escalating sine-wave drift via framer-motion
    VolumeDisplay.tsx — Blinking current volume as English words
    TitleBar.tsx      — Drag region + hostile "MAKE LOUDER" button
  App.tsx             — Submit flow: gaslighting → validation → punish or set
```

The jitter timer lives in the **main process** so it keeps running even when the window is minimized. All visual chaos lives in the **renderer**.

## Valid Input Examples

| Volume | Required input |
|---|---|
| 0% | `zero percent` |
| 1% | `one percent` |
| 20% | `twenty percent` |
| 42% | `forty-two percent` |
| 77% | `seventy-seven percent` |
| 100% | `one hundred percent` |

Input is case-insensitive and trims whitespace. Everything else triggers punishment.
