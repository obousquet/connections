// Logic for generating a puzzle from the structured word repository.

class PuzzleGenerator {
    constructor(repository) {
        this.repository = repository;
        this.wordToCategoryCount = {};
        
        // Pre-compute the number of categories each word belongs to across the entire repository
        for (const theme in this.repository) {
            for (const category in this.repository[theme]) {
                const words = this.repository[theme][category];
                words.forEach(word => {
                    const upperWord = word.toUpperCase();
                    if (!this.wordToCategoryCount[upperWord]) {
                        this.wordToCategoryCount[upperWord] = new Set();
                    }
                    this.wordToCategoryCount[upperWord].add(category);
                });
            }
        }
    }

    generatePuzzle() {
        const themes = Object.keys(this.repository);
        // Randomly pick 4 distinct themes
        const selectedThemes = this.shuffleArray([...themes]).slice(0, 4);
        
        const puzzleWords = [];
        const selectedCategories = [];
        const usedWords = new Set();

        selectedThemes.forEach(theme => {
            const categoriesInTheme = Object.keys(this.repository[theme]);
            // Pick 1 category from this theme
            const category = this.shuffleArray([...categoriesInTheme])[0];
            selectedCategories.push(category);

            const wordsInCategory = this.repository[theme][category];
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

        // Compute difficulty: sum of numbers of categories each word belongs to across the entire repo, minus 16
        let difficultyScore = 0;
        puzzleWords.forEach(item => {
            const upperWord = item.word.toUpperCase();
            difficultyScore += this.wordToCategoryCount[upperWord] ? this.wordToCategoryCount[upperWord].size : 1;
        });
        
        // A minimum score of 0
        const finalDifficulty = Math.max(0, difficultyScore - 16);

        return {
            words: puzzleWords,          // Array of { word, category }
            categories: selectedCategories, // Array of 4 category names
            difficulty: finalDifficulty
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