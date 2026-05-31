# Battle Card: Market Garden 1944

A single-page Print & Play solitaire wargame about Operation Market Garden. Play as the Allied commander and establish a supply corridor from Belgium to Arnhem.

## Quick Start

Open `index.html` in any browser. No server or build step needed.

**[Play online](https://blog.linjunhalida.com/battle_card_market_garden/)**

## Features

- Dice-driven combat system with Attack/Defend tables
- German reinforcement, airborne drops, and turn tracking
- 30 Corps breakthrough mechanic
- Language toggle: 中文 / English

## How to Play

1. Click **Start Game** to roll airdrop adjustment dice
2. Choose **Attack** or **Defend** for each contested location
3. Resolve battles, then German reinforcements arrive
4. Advance your units (airborne and 30 Corps) toward Arnhem
5. Reinforce 1st Airborne, advance the turn, and repeat

**Win**: 30 Corps reaches Arnhem
**Lose**: Any Allied unit eliminated, or Turn Die > 6

See `info.md` for full rules, or click the info link in-game (`info.png`).

## Files

| File | Description |
|---|---|
| `index.html` | Entry point |
| `app.js` | Game logic and i18n |
| `styles.css` | Dark wargame-themed UI |
| `info.md` | Full rules reference |
| `map.png` | Game board background |
| `info.png` | Rules image for in-game modal |

## Tech

Static HTML + CSS + JS (jQuery 3.7). No dependencies to install.
