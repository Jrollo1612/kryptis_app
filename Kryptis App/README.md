# Kryptis — Electron

Version desktop de Kryptis, convertie de Python/tkinter vers Electron.

## Installation

```bash
cd kryptis-electron
npm install
npm start
```

## Build (exécutable)

```bash
npm run build
```
L'exécutable se retrouve dans le dossier `dist/`.

## Chiffres disponibles

| Onglet    | Description                          |
|-----------|--------------------------------------|
| Morse     | Texte ↔ Morse (émojis 🟣➖)          |
| Vigenère  | Chiffre de Vigenère avec clé         |
| Avocat    | César décalage fixe +10              |
| César     | César décalage réglable (1–25)       |
| ROT13     | Rotation de 13 (symétrique)          |
| Binaire   | Texte ↔ binaire ASCII                |

## Structure

```
kryptis-electron/
├── main.js          ← Processus Electron principal
├── package.json
└── src/
    ├── index.html   ← Interface (onglets)
    ├── style.css    ← Thème sombre violet
    └── logic.js     ← Tous les algorithmes de chiffrement
```
