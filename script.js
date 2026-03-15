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

function initGame() {
    selectedWordsObjects = [];
    foundCategories = [];
    remainingLives = 4;

    const gameGrid = document.getElementById('game-grid');
    gameGrid.innerHTML = ''; // Clear grid
    
    // Remove solution button if exists
    const solutionBtn = document.getElementById('solution-btn');
    if (solutionBtn) solutionBtn.remove();
    
    // Clear message
    document.getElementById('message-area').textContent = '';

    const generator = new PuzzleGenerator(wordRepository);
    currentPuzzle = generator.generatePuzzle();

    const difficultyDisplay = document.getElementById('difficulty-display');
    if (difficultyDisplay) {
        difficultyDisplay.textContent = `Difficulty Level: ${currentPuzzle.difficulty}`;
    }

    const shuffledWords = shuffleArray([...currentPuzzle.words]);

    shuffledWords.forEach(item => {
        const wordBox = document.createElement('div');
        wordBox.classList.add('word-box');
        wordBox.textContent = item.word;
        wordBox.dataset.word = item.word;
        wordBox.dataset.category = item.category;
        gameGrid.appendChild(wordBox);
    });

    updateLivesDisplay();
}

document.addEventListener('DOMContentLoaded', () => {
    const gameGrid = document.getElementById('game-grid');
    
    // Create lives display container
    const livesDisplay = document.createElement('div');
    livesDisplay.id = 'lives-display';
    gameGrid.parentNode.insertBefore(livesDisplay, gameGrid.nextSibling);

    document.getElementById('reset-btn').addEventListener('click', initGame);

    gameGrid.addEventListener('click', (event) => {
        const clickedBox = event.target;
        if (clickedBox.classList.contains('word-box') && !clickedBox.classList.contains('found-group') && !clickedBox.classList.contains('selected')) {
            selectWord(clickedBox);
        } else if (clickedBox.classList.contains('selected')) {
            deselectWord(clickedBox);
        }
    });

    initGame();
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

function showMessage(msg, persistent = false) {
    const messageArea = document.getElementById('message-area');
    messageArea.textContent = msg;
    if (!persistent) {
        setTimeout(() => {
            if (messageArea.textContent === msg) {
                messageArea.textContent = '';
            }
        }, 2000);
    }
}

function checkGroup() {
    if (selectedWordsObjects.length !== 4) return;

    // Check how many words belong to each category in the selection
    const categoryCounts = {};
    selectedWordsObjects.forEach(item => {
        categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
    });

    const categories = Object.keys(categoryCounts);
    let isCorrect = false;
    let isOneAway = false;
    let correctCategory = null;

    if (categories.length === 1) {
        correctCategory = categories[0];
        isCorrect = true;
    } else if (categories.length === 2) {
        // If 3 words from one category and 1 from another
        if (categoryCounts[categories[0]] === 3 || categoryCounts[categories[1]] === 3) {
            isOneAway = true;
        }
    }

    if (isCorrect) {
        if (currentPuzzle.categories.includes(correctCategory) && !foundCategories.includes(correctCategory)) {
            foundCategories.push(correctCategory);
            
            const gameGrid = document.getElementById('game-grid');
            
            selectedWordsObjects.forEach(item => {
                item.element.remove();
            });

            const solvedRow = document.createElement('div');
            solvedRow.classList.add('solved-row');
            
            const wordsString = selectedWordsObjects.map(item => item.word).join(', ');
            solvedRow.innerHTML = `<strong>${correctCategory}</strong><span>${wordsString}</span>`;
            
            gameGrid.prepend(solvedRow);

            selectedWordsObjects = [];
            checkWinCondition();
        } else {
            handleIncorrectGroup();
        }
    } else {
        handleIncorrectGroup(isOneAway);
    }
}

function handleIncorrectGroup(isOneAway = false) {
    if (isOneAway) {
        showMessage('One away!');
    }

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
        showMessage('Congratulations! You found all the groups!', true);
        disableAllInteraction();
    }
}

function gameOver() {
    showMessage('Game Over! You ran out of lives.', true);
    disableAllInteraction();
    
    // Add "Show Solution" button
    const controls = document.getElementById('controls');
    if (!document.getElementById('solution-btn')) {
        const solutionBtn = document.createElement('button');
        solutionBtn.id = 'solution-btn';
        solutionBtn.textContent = 'Show Solution';
        solutionBtn.addEventListener('click', showSolution);
        controls.appendChild(solutionBtn);
    }
}

function showSolution() {
    const gameGrid = document.getElementById('game-grid');
    const solutionBtn = document.getElementById('solution-btn');
    if (solutionBtn) solutionBtn.remove();

    // Find unfound categories
    const unfoundCategories = currentPuzzle.categories.filter(cat => !foundCategories.includes(cat));

    unfoundCategories.forEach(category => {
        // Collect words for this category from the current grid
        const wordBoxes = Array.from(document.querySelectorAll('.word-box')).filter(box => box.dataset.category === category);
        
        // Remove individual boxes
        wordBoxes.forEach(box => box.remove());

        // Create revealed row
        const revealedRow = document.createElement('div');
        revealedRow.classList.add('revealed-row');
        
        const wordsString = wordBoxes.map(box => box.dataset.word).join(', ');
        revealedRow.innerHTML = `<strong>${category}</strong><span>${wordsString}</span>`;
        
        gameGrid.appendChild(revealedRow);
    });
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