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
        const selectedCategoriesInfo = [];
        const usedWords = new Set();

        // First, pick the categories
        selectedThemes.forEach(theme => {
            const categoriesInTheme = Object.keys(this.repository[theme]);
            // Pick 1 category from this theme
            const category = this.shuffleArray([...categoriesInTheme])[0];
            selectedCategoriesInfo.push({ theme, category });
        });

        const selectedCategories = selectedCategoriesInfo.map(info => info.category);

        // Helper to get ambiguity within the chosen puzzle categories
        const getAmbiguityInPuzzle = (word) => {
            const upperWord = word.toUpperCase();
            const wordCategories = this.wordToCategoryCount[upperWord] || new Set();
            let count = 0;
            selectedCategories.forEach(cat => {
                if (wordCategories.has(cat)) count++;
            });
            return count;
        };

        // Now pick words prioritizing those that appear in multiple chosen categories
        selectedCategoriesInfo.forEach(({ theme, category }) => {
            const wordsInCategory = this.repository[theme][category];
            // Filter out words that have already been used in this puzzle
            const availableWords = wordsInCategory.filter(word => !usedWords.has(word));
            
            // Maximize ambiguity by sorting based on appearance in the selected puzzle categories
            const shuffledAvailable = this.shuffleArray([...availableWords]);
            shuffledAvailable.sort((a, b) => getAmbiguityInPuzzle(b) - getAmbiguityInPuzzle(a));
            
            // Pick 4 distinct words for this category
            const selectedWords = shuffledAvailable.slice(0, 4);
            
            selectedWords.forEach(word => {
                usedWords.add(word);
                puzzleWords.push({
                    word: word,
                    category: category // The intended category for this puzzle
                });
            });
        });

        // Compute difficulty: sum of overlaps across the chosen categories for the words in the puzzle, minus 16
        let difficultyScore = 0;
        puzzleWords.forEach(item => {
            difficultyScore += getAmbiguityInPuzzle(item.word);
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