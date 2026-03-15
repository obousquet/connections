// Logic for generating a puzzle from the word repository.

class PuzzleGenerator {
    constructor(repository) {
        this.repository = repository;
    }

    // Generates a basic puzzle. 
    // Phase 2: Update this logic to deliberately pick categories and words 
    // to maximize overlap (words that fit multiple selected categories).
    generatePuzzle() {
        const allCategories = Object.keys(this.repository);
        // Randomly pick 4 distinct categories
        const selectedCategories = this.shuffleArray([...allCategories]).slice(0, 4);
        
        const puzzleWords = [];
        const usedWords = new Set();

        selectedCategories.forEach(category => {
            const wordsInCategory = this.repository[category];
            // Filter out words that have already been used in this puzzle
            const availableWords = wordsInCategory.filter(word => !usedWords.has(word));
            
            // Randomly pick 4 distinct words for this category
            const selectedWords = this.shuffleArray([...availableWords]).slice(0, 4);
            
            selectedWords.forEach(word => {
                usedWords.add(word);
                puzzleWords.push({
                    word: word,
                    category: category // The intended category for this puzzle
                });
            });
        });

        return {
            words: puzzleWords,          // Array of { word, category }
            categories: selectedCategories // Array of 4 category names
        };
    }

    shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }
}