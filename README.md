# Connections Game

This project is a web application inspired by the New York Times [Connections](https://www.nytimes.com/games/connections) game.

The goal is to explore how AI could potentially generate interesting categories (semantic, syntactic, and culture-oriented) for such word-grouping puzzles.

## Architecture

The application has been decoupled to cleanly separate concerns:
- **Game Logic** (`script.js`): Handles the user interface, selecting words, validating groups, and managing game state.
- **Puzzle Generation** (`puzzleGenerator.js`): Responsible for dynamically assembling a puzzle. In the future, this will include advanced logic to deliberately select overlapping words (words that belong to more than one category) to increase difficulty.
- **Word Repository** (`data.js`): A centralized dataset of categories and their corresponding words used to generate puzzles.

Check out the live version of the game here: https://obousquet.github.io/connections/