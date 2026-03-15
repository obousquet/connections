// Connections Game Logic

let selectedWordsObjects = [];
let foundCategories = [];
let remainingLives = 4;
let currentPuzzle = null;

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

document.addEventListener('DOMContentLoaded', () => {
    // Generate the puzzle using our generator and data
    const generator = new PuzzleGenerator(wordRepository);
    currentPuzzle = generator.generatePuzzle();

    const gameGrid = document.getElementById('game-grid');
    const livesDisplay = document.createElement('div');
    livesDisplay.id = 'lives-display';
    livesDisplay.textContent = `Lives remaining: ${remainingLives}`;
    gameGrid.parentNode.insertBefore(livesDisplay, gameGrid.nextSibling);

    const shuffledWords = shuffleArray([...currentPuzzle.words]);

    shuffledWords.forEach(item => {
        const wordBox = document.createElement('div');
        wordBox.classList.add('word-box');
        wordBox.textContent = item.word;
        wordBox.dataset.word = item.word;
        wordBox.dataset.category = item.category;
        gameGrid.appendChild(wordBox);
    });

    gameGrid.addEventListener('click', (event) => {
        const clickedBox = event.target;
        if (clickedBox.classList.contains('word-box') && !clickedBox.classList.contains('found-group') && !clickedBox.classList.contains('selected')) {
            selectWord(clickedBox);
        } else if (clickedBox.classList.contains('selected')) {
            deselectWord(clickedBox);
        }
    });

    updateLivesDisplay();
});

function selectWord(wordBox) {
    if (selectedWordsObjects.length < 4) {
        wordBox.classList.add('selected');
        selectedWordsObjects.push({
            word: wordBox.dataset.word,
            element: wordBox,
            category: wordBox.dataset.category
        });

        if (selectedWordsObjects.length === 4) {
            checkGroup();
        }
    }
}

function deselectWord(wordBox) {
    wordBox.classList.remove('selected');
    selectedWordsObjects = selectedWordsObjects.filter(item => item.element !== wordBox);
}

function deselectAllSelected() {
    selectedWordsObjects.forEach(item => {
        item.element.classList.remove('selected');
    });
    selectedWordsObjects = [];
}

function checkGroup() {
    if (selectedWordsObjects.length !== 4) return;

    const selectedCategories = new Set(selectedWordsObjects.map(item => item.category));

    if (selectedCategories.size === 1) {
        const category = selectedWordsObjects[0].category;
        
        if (currentPuzzle.categories.includes(category) && !foundCategories.includes(category)) {
            foundCategories.push(category);
            
            selectedWordsObjects.forEach(item => {
                item.element.classList.add('found-group');
                item.element.classList.remove('selected');
                item.element.style.pointerEvents = 'none'; 
            });
            selectedWordsObjects = [];
            checkWinCondition();
        } else {
            handleIncorrectGroup();
        }
    } else {
        handleIncorrectGroup();
    }
}

function handleIncorrectGroup() {
    selectedWordsObjects.forEach(item => {
        item.element.classList.add('error');
    });

    setTimeout(() => {
        selectedWordsObjects.forEach(item => {
            item.element.classList.remove('error');
        });
        deselectAllSelected();
        remainingLives--;
        updateLivesDisplay();
        if (remainingLives <= 0) {
            gameOver();
        }
    }, 1000);
}

function updateLivesDisplay() {
    const livesDisplay = document.getElementById('lives-display');
    if (livesDisplay) {
        livesDisplay.textContent = `Lives remaining: ${remainingLives}`;
    }
}

function checkWinCondition() {
    if (foundCategories.length === currentPuzzle.categories.length) {
        alert('Congratulations! You found all the groups!');
        disableAllInteraction();
    }
}

function gameOver() {
    alert('Game Over! You ran out of lives.');
    disableAllInteraction();
}

function disableAllInteraction() {
    const allWordBoxes = document.querySelectorAll('.word-box');
    allWordBoxes.forEach(box => {
        box.style.pointerEvents = 'none';
        if (!box.classList.contains('found-group')) {
            box.style.opacity = '0.5';
        }
    });
}