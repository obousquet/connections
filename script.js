// Game logic for the Connections game

const words = [
    { word: 'Apple', category: 'Fruits' },
    { word: 'Banana', category: 'Fruits' },
    { word: 'Orange', category: 'Fruits' },
    { word: 'Grape', category: 'Fruits' },
    { word: 'Car', category: 'Vehicles' },
    { word: 'Truck', category: 'Vehicles' },
    { word: 'Bus', category: 'Vehicles' },
    { word: 'Motorcycle', category: 'Vehicles' },
    { word: 'Dog', category: 'Animals' },
    { word: 'Cat', category: 'Animals' },
    { word: 'Bird', category: 'Animals' },
    { word: 'Fish', category: 'Animals' },
    { word: 'Red', category: 'Colors' },
    { word: 'Blue', category: 'Colors' },
    { word: 'Green', category: 'Colors' },
    { word: 'Yellow', category: 'Colors' }
];

// Shuffle words and define correct groups (for this small set)
// In a real game, this would be loaded from a data source and shuffled.
words.sort(() => 0.5 - Math.random());

const correctGroups = [
    ['Apple', 'Banana', 'Orange', 'Grape'],
    ['Car', 'Bus', 'Motorcycle', 'Truck'],
    ['Dog', 'Cat', 'Bird', 'Fish'],
    ['Blue', 'Green', 'Red', 'Yellow']
];

let selectedWords = [];
let foundGroups = [];
let lives = 4;

document.addEventListener('DOMContentLoaded', () => {
    const gameGrid = document.getElementById('game-grid');
    
    // Populate the grid with words
    words.forEach(item => {
        const wordBox = document.createElement('div');
        wordBox.classList.add('word-box');
        wordBox.textContent = item.word;
        wordBox.dataset.word = item.word;
        wordBox.dataset.category = item.category; // Store category for checking
        gameGrid.appendChild(wordBox);
    });

    // Add click event listeners to word boxes
    gameGrid.addEventListener('click', (event) => {
        const clickedBox = event.target;
        if (clickedBox.classList.contains('word-box') && !clickedBox.classList.contains('found-group') && !clickedBox.classList.contains('selected')) {
            selectWord(clickedBox);
        } else if (clickedBox.classList.contains('selected')) {
            deselectWord(clickedBox);
        }
    });
});

function selectWord(wordBox) {
    if (selectedWords.length < 4) {
        wordBox.classList.add('selected');
        selectedWords.push({
            word: wordBox.dataset.word,
            element: wordBox
        });

        if (selectedWords.length === 4) {
            checkGroup();
        }
    }
}

function deselectWord(wordBox) {
    wordBox.classList.remove('selected');
    selectedWords = selectedWords.filter(item => item.element !== wordBox);
}

function checkGroup() {
    const currentSelectionWords = selectedWords.map(item => item.word);
    let groupFound = false;

    for (const group of correctGroups) {
        // Check if the selected words match a correct group (order doesn't matter)
        if (currentSelectionWords.every(word => group.includes(word)) && group.every(word => currentSelectionWords.includes(word))) {
            groupFound = true;
            foundGroups.push(group);
            
            // Mark selected words as found
            selectedWords.forEach(item => {
                item.element.classList.add('found-group');
                item.element.classList.remove('selected');
                item.element.removeEventListener('click', handleWordClick);
            });
            break; // Exit loop once a group is found
        }
    }

    if (groupFound) {
        // Provide positive feedback, maybe clear selection for next group
        console.log('Group found!');
        selectedWords = []; // Clear selection for the next group
        checkWinCondition();
    } else {
        // Provide negative feedback
        selectedWords.forEach(item => {
            item.element.classList.add('error');
        });
        // Temporarily shake the boxes and then reset them
        setTimeout(() => {
            selectedWords.forEach(item => {
                item.element.classList.remove('error');
            });
            deselectAllSelected();
            lives--;
            updateLivesDisplay();
            if (lives <= 0) {
                gameOver();
            }
        }, 1000); // Shake duration
    }
}

function deselectAllSelected() {
    selectedWords.forEach(item => {
        item.element.classList.remove('selected');
    });
    selectedWords = [];
}

function updateLivesDisplay() {
    // You'd need an HTML element to display lives, e.g., <div id='lives'>Lives: 4</div>
    console.log(`Lives remaining: ${lives}`);
}

function checkWinCondition() {
    if (foundGroups.length === correctGroups.length) {
        alert('Congratulations! You found all the groups!');
        // Optionally, disable further interaction or show a reset button
    }
}

function gameOver() {
    alert('Game Over! You ran out of lives.');
    // Disable all word boxes, show a reset button, etc.
    const allWordBoxes = document.querySelectorAll('.word-box');
    allWordBoxes.forEach(box => {
        box.removeEventListener('click', handleWordClick); // Ensure no more clicks
        if (!box.classList.contains('found-group')) {
            box.style.opacity = '0.5'; // Visually indicate they were not found
        }
    });
}

// Helper to handle the click event directly on the box if needed elsewhere
function handleWordClick(event) {
    const clickedBox = event.target;
    if (!clickedBox.classList.contains('found-group')) {
        if (clickedBox.classList.contains('selected')) {
            deselectWord(clickedBox);
        } else {
            selectWord(clickedBox);
        }
    }
}

// Re-attach event listeners to selected words if they were removed or if needed.
// For this example, we are removing listeners on found groups, but if you need to re-select a word after deselecting it, you'd need to manage that.
// The current logic for `handleWordClick` is implicitly handled by the grid event listener for simplicity.
// If you were to implement individual listeners, ensure they are managed correctly.
// For now, the grid listener is sufficient.

// Initial call to update lives display when the page loads
updateLivesDisplay();

// Add a placeholder for the event listener in case it's needed for individual boxes, though the grid listener is generally better.
// document.querySelectorAll('.word-box').forEach(box => {
//     box.addEventListener('click', handleWordClick);
// });


// Update the correctGroups array to match the words more accurately for the demo
// This is a simplified setup. A real game would have distinct categories.
// For example, if 'Apple', 'Banana', 'Orange', 'Grape' are selected, we check if they all belong to 'Fruits'.
// The current check is based on direct group matching.

// Let's adjust the correctGroups to match the words more directly for the check logic.
// If the selected words are ['Apple', 'Banana', 'Orange', 'Grape'], then check if it's a valid group.
// The current logic checks if the selected words are exactly a subset of one of the correctGroups.
// A better approach for Connections game would be to check if all selected words belong to the SAME category.
// Let's refine the checkGroup function for this.

// --- Refined checkGroup logic --- 

function checkGroupRefined() {
    if (selectedWords.length !== 4) return; // Only check when 4 words are selected

    const currentSelectionWords = selectedWords.map(item => item.word);
    const categoriesOfSelection = new Set(selectedWords.map(item => item.category));

    if (categoriesOfSelection.size === 1) { // All selected words belong to the same category
        const category = selectedWords[0].category;
        // Check if this category is one of the remaining correct categories
        const isCorrectGroup = correctGroups.some(group => 
            group.includes(currentSelectionWords[0]) && // Ensure at least one word matches to avoid accidental group creation
            group.every(gWord => currentSelectionWords.includes(gWord))
        );

        if (isCorrectGroup) {
            foundGroups.push(currentSelectionWords); // Store the words found
            selectedWords.forEach(item => {
                item.element.classList.add('found-group');
                item.element.classList.remove('selected');
                // Remove event listener to prevent re-selection/interaction
                item.element.style.pointerEvents = 'none'; 
            });
            console.log(`Group found: ${category}`);
            selectedWords = []; // Clear selection for the next group
            checkWinCondition();
        } else {
            handleIncorrectGroup();
        }
    } else {
        // If words are from different categories, it's an incorrect group
        handleIncorrectGroup();
    }
}

function handleIncorrectGroup() {
    selectedWords.forEach(item => {
        item.element.classList.add('error');
    });
    setTimeout(() => {
        selectedWords.forEach(item => {
            item.element.classList.remove('error');
        });
        deselectAllSelected();
        lives--;
        updateLivesDisplay();
        if (lives <= 0) {
            gameOver();
        }
    }, 1000); // Shake duration
}

// Replace the original checkGroup call with the refined one
// In the gameGrid event listener, change checkGroup() to checkGroupRefined()
// And ensure the 'selectedWords' correctly stores category information if available.

// Let's update the word population to include category data, and modify the selection logic

// --- Re-implementing with category data and refined logic --- 

const wordsData = [
    { word: 'Apple', category: 'Fruits' },
    { word: 'Banana', category: 'Fruits' },
    { word: 'Orange', category: 'Fruits' },
    { word: 'Grape', category: 'Fruits' },
    { word: 'Car', category: 'Vehicles' },
    { word: 'Truck', category: 'Vehicles' },
    { word: 'Bus', category: 'Vehicles' },
    { word: 'Motorcycle', category: 'Vehicles' },
    { word: 'Dog', category: 'Animals' },
    { word: 'Cat', category: 'Animals' },
    { word: 'Bird', category: 'Animals' },
    { word: 'Fish', category: 'Animals' },
    { word: 'Red', category: 'Colors' },
    { word: 'Blue', category: 'Colors' },
    { word: 'Green', category: 'Colors' },
    { word: 'Yellow', category: 'Colors' }
];

// Correct groups definition (just the categories)
const correctCategories = [
    'Fruits',
    'Vehicles',
    'Animals',
    'Colors'
];

let selectedWordsObjects = []; // Stores objects with {word: '...', element: DOMElement, category: '...'}
let foundCategories = [];
let remainingLives = 4;

// Function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
}

document.addEventListener('DOMContentLoaded', () => {
    const gameGrid = document.getElementById('game-grid');
    const livesDisplay = document.createElement('div');
    livesDisplay.id = 'lives-display';
    livesDisplay.textContent = `Lives remaining: ${remainingLives}`;
    gameGrid.parentNode.insertBefore(livesDisplay, gameGrid.nextSibling);

    shuffleArray(wordsData);

    wordsData.forEach(item => {
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
    if (selectedWordsObjects.length !== 4) return; // Should not happen with the current logic, but good practice.

    const selectedCategories = new Set(selectedWordsObjects.map(item => item.category));

    // Check if all selected words belong to the same category
    if (selectedCategories.size === 1) {
        const category = selectedWordsObjects[0].category;
        
        // Check if this category is one of the correct ones and hasn't been found yet
        if (correctCategories.includes(category) && !foundCategories.includes(category)) {
            foundCategories.push(category);
            
            selectedWordsObjects.forEach(item => {
                item.element.classList.add('found-group');
                item.element.classList.remove('selected');
                // Make found words unclickable
                item.element.style.pointerEvents = 'none'; 
            });
            console.log(`Group found: ${category}`);
            selectedWordsObjects = []; // Clear selection for the next group
            checkWinCondition();
        } else {
            handleIncorrectGroup();
        }
    } else {
        // Words are from different categories, it's an incorrect group
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
    }, 1000); // Shake duration
}

function updateLivesDisplay() {
    const livesDisplay = document.getElementById('lives-display');
    if (livesDisplay) {
        livesDisplay.textContent = `Lives remaining: ${remainingLives}`;
    }
}

function checkWinCondition() {
    if (foundCategories.length === correctCategories.length) {
        alert('Congratulations! You found all the groups!');
        // Optionally disable all interaction or show a reset button
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
        box.style.pointerEvents = 'none'; // Make all boxes unclickable
        if (!box.classList.contains('found-group')) {
            box.style.opacity = '0.5'; // Visually indicate not found
        }
    });
}

// Initial call to update lives display
updateLivesDisplay();
