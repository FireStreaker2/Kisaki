<div align="center">
  <div>
    <img src="resources/icon.webp" alt="logo" height="80" style="vertical-align: middle;" />
    <span style="font-size: 2.5em; font-weight: bold; vertical-align: middle; margin-left: 15px;">Kisaki</span>
  </div>
  <p>The personal desktop companion for the elderly.</p>
  <div>
    <img src="https://img.shields.io/badge/Made with-TypeScript-blue" />
    <img src="https://img.shields.io/badge/Made for-The Elderly-brown" />
  </div>
</div>

# About

Kisaki is an Electron desktop companion focused on accessibility and ease of use.
It combines a configurable dashboard, text-assist tools, and voice output into a lightweight cross-platform app.

## Highlights

- Desktop app built with Electron + Next.js (Nextron)
- Configurable companion personality (name, tone, verbosity, humor)
- Voice controls (enable/disable, voice selection, speed, pitch)
- Smart text tools overlay for:
  - Explain
  - Summarize
  - Translate
  - Fact-check
- Quick actions for test voice and app restart
- Multi-language UI support (English, Spanish, French, Chinese, plus runtime language handling)
- Persistent settings saved across restarts
- Linux-friendly runtime flags and TTS handling

## Settings Persistence

Kisaki persists settings to a JSON file in Electron's per-OS user data directory.

- Implementation: `main/helpers/settings.ts`
- Runtime hookup: `main/background.ts`
- File name: `settings.json`

Typical locations:

- Linux: `~/.config/<AppName>/settings.json`
- macOS: `~/Library/Application Support/<AppName>/settings.json`
- Windows: `%APPDATA%\\<AppName>\\settings.json`

On first launch, default settings are generated automatically.

> [!NOTE]  
> Kisaki has not been extensively tested on macOS and Windows. However, it should work due to the cross-platform nature of Electron.

## Overlay Behavior

- Overlay window is a frameless, always-on-top mini window.
- Clipboard polling detects selected/copied text and forwards it to overlay tools.
- If the overlay window is closed, it is recreated automatically on the next clipboard event.

# Getting Started

To get started with Kisaki, please either build it locally or download a copy in the releases section.

# Development

## Tech Stack

- Electron
- Next.js (Pages Router)
- React + TypeScript
- Tailwind CSS + Radix UI
- Hugging Face Inference API (`@huggingface/inference`)
- `say` package for native TTS in Electron main process

## Project Structure

```text
main/                 Electron main process + preload + window helpers
renderer/             Next.js UI (dashboard, overlay, i18n, components)
app/                  Built renderer output used in production packaging
resources/            Packaging resources (icons)
electron-builder.yml  Electron Builder configuration
```

## Environment Variables

Create a local env file for renderer values:

- `renderer/.env`

Used by text tools:

- `NEXT_PUBLIC_HF_API_KEY`

Example:

```env
NEXT_PUBLIC_HF_API_KEY=""
```

## Running locally

```bash
$ npm i
$ npm run dev # development
$ npm run build # production build
```

## Configuration Files

- App packaging: `electron-builder.yml`
- TypeScript: `tsconfig.json` and `renderer/tsconfig.json`
- Next config: `renderer/next.config.js`

# Contributing

Contributions are welcome! Feel free to submit a pull request for features or translations.

# License

[MIT](https://github.com/FireStreaker2/Kisaki/blob/main/LICENSE)
