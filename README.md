# Hangman (Svelte)

A clean, modern, and reactive implementation of the classic Hangman word-guessing game built with Svelte.

<img width="614" height="360" alt="image" src="https://github.com/user-attachments/assets/68e27d59-8b54-4bde-bc17-0174edcf9873" />


## 🎮 Features
- Reactive UI: Real-time updates as you guess letters, powered by Svelte's reactivity.
- Visual Progress: Dynamic rendering of the "Hangman" figure as lives decrease.
- Responsive Design: Playable on desktop and mobile browsers.
- Instant Reset: Easily start a new game once you win or lose.


## 🚀 Getting Started
### Prerequisites
Make sure you have [Bun](https://bun.sh/) installed on your machine.

### Installation

Clone the repository:
```bash
git clone https://github.com/RAPrograms/Hangman.git
cd Hangman
```

### Install dependencies:
```bash
bun install
```
### Start the development server:
```bash
npm run dev
```

The app will typically be available at http://localhost:5173.


## 🛠️ Built With

    Svelte - Frontend framework for building the UI.

    Vite - Next-generation frontend tooling for fast development.

    SCSS - Styling pre-processer.

## 📖 How to Play

    The game selects a random secret word.

    Guess letters by typing or clicking the available alphabet.

    If the letter is in the word, it will be revealed.

    If the letter is not in the word, a part of the hangman will be drawn.

    Win by revealing the whole word before the hangman is complete!

## 📄 License
This project is licensed under the GPL-2.0 License - see the LICENSE file for details.

## 👤 Author
[RAPrograms](https://github.com/RAPrograms)
