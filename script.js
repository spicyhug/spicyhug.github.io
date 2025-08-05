// Array of default emojis for each card
const defaultCardEmojis = ['🎉', '🌟', '🎯', '🏆', '🎊', '⭐', '🎁', '🔥', '💎', '🌈', '🎪', '🚀', '🎵', '🌺', '⚡', '🎭', '🏅', '🎨', '🌙', '🎈'];

// Available emojis for selection
const availableEmojis = ['🎉', '🌟', '🎯', '🏆', '🎊', '⭐', '🎁', '🔥', '💎', '🌈', '🎪', '🚀', '🎵', '🌺', '⚡', '🎭', '🏅', '🎨', '🌙', '🎈', '😀', '😎', '🥳', '😍', '🤩', '🥰', '😂', '🤗', '😊', '🙂', '❤️', '💖', '💕', '💚', '💙', '💜', '🧡', '💛', '🤍', '🖤', '🌸', '🌻', '🌼', '🌷', '🌹', '🍀', '🍄', '🦋', '🐝', '🦄'];

// Note: defaultCardMessages and groupColors are now loaded from separate JS files

// Age verification function
function confirmAge(isOfAge) {
    const overlay = document.getElementById('ageVerificationOverlay');
    const mainContent = document.getElementById('mainContent');
    
    if (isOfAge) {
        // User confirmed they are 21+, show the game
        overlay.style.display = 'none';
        mainContent.style.display = 'block';
        
        // Store age verification in localStorage to remember for this session
        localStorage.setItem('ageVerified', 'true');
        localStorage.setItem('ageVerifiedDate', new Date().toDateString());
        
        // Initialize the game
        initializeGame();
    } else {
        // User is under 21, redirect them away or show a message
        alert('Sorry, you must be 21 years or older to access this content.');
        window.location.href = 'https://www.google.com'; // Redirect to a safe page
    }
}

// Check if user has already verified their age today
function checkAgeVerification() {
    const ageVerified = localStorage.getItem('ageVerified');
    const verifiedDate = localStorage.getItem('ageVerifiedDate');
    const today = new Date().toDateString();
    
    if (ageVerified === 'true' && verifiedDate === today) {
        // Already verified today, skip the modal
        document.getElementById('ageVerificationOverlay').style.display = 'none';
        document.getElementById('mainContent').style.display = 'block';
        return true;
    }
    
    // Show age verification modal
    document.getElementById('ageVerificationOverlay').style.display = 'flex';
    return false;
}

let cardMessages = [];
let cardEmojis = [];
let currentCardIndex = 0;
let viewedCards = new Set(); // Track which cards have been viewed
let currentGroup = 1;
let totalGroups = 1;
let cardsPerGroup = 10; // Each group should have exactly 10 cards
// Note: groupColors is now loaded from groupColors.js
let currentGroupOpenedCards = new Set(); // Track opened cards in current group

// Function to generate cards based on user input
function generateCards() {
    const cardCount = defaultCardMessages.length; // Dynamic based on card data array
    const container = document.getElementById('cardsContainer');
    
    // Calculate groups
    totalGroups = Math.ceil(cardCount / cardsPerGroup);
    currentGroup = 1;
    currentGroupOpenedCards.clear();
    
    // Load custom data or use defaults
    loadCardData();
    
    // Ensure we have enough emojis for all cards
    while (cardEmojis.length < cardCount) {
        cardEmojis.push(defaultCardEmojis[cardEmojis.length % defaultCardEmojis.length]);
    }
    
    // Clear existing cards
    container.innerHTML = '';
    currentCardIndex = 0;
    viewedCards.clear(); // Reset viewed cards tracker
    
    // Generate cards for current group only
    generateCurrentGroupCards();
    
    updateNavigation();
    updateGroupDisplay();
}

// Function to generate cards for the current group
function generateCurrentGroupCards() {
    const container = document.getElementById('cardsContainer');
    container.innerHTML = '';
    currentGroupOpenedCards.clear();
    
    const cardCount = defaultCardMessages.length; // Dynamic based on card data array
    const startCard = (currentGroup - 1) * cardsPerGroup + 1;
    const endCard = Math.min(currentGroup * cardsPerGroup, cardCount);
    
    // Generate cards for current group
    for (let i = startCard; i <= endCard; i++) {
        createCard(i, container);
    }
    
    currentCardIndex = 0;
}

// Function to create a single card
function createCard(cardNumber, container) {
    // Create card elements
    const card = document.createElement('div');
    card.className = 'card';
    card.setAttribute('data-card-number', cardNumber);
    
    // Get group color
    const groupIndex = Math.floor((cardNumber - 1) / cardsPerGroup);
    const groupColor = groupColors[groupIndex % groupColors.length];
    
    const cardInner = document.createElement('div');
    cardInner.className = 'card-inner';
    
    const cardFront = document.createElement('div');
    cardFront.className = 'card-front';
    cardFront.style.background = `linear-gradient(135deg, ${groupColor.primary}, ${groupColor.secondary})`;
    
    const cardBack = document.createElement('div');
    cardBack.className = 'card-back';
    cardBack.style.background = `linear-gradient(135deg, ${groupColor.secondary}, ${groupColor.primary})`;
    
    // Create close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-btn';
    closeBtn.innerHTML = '×';
    closeBtn.onclick = function(e) {
        e.stopPropagation();
        closeCard(card);
    };
    
    // Set up front side content
    const cardNumberElement = document.createElement('div');
    cardNumberElement.className = 'card-number';
    cardNumberElement.textContent = cardNumber;
    
    const groupImageElement = document.createElement('img');
    groupImageElement.className = 'group-image';
    groupImageElement.src = groupColor.image;
    groupImageElement.alt = `${groupColor.name} Group`;
    
    // Add error handling for image loading
    groupImageElement.onerror = function() {
        // Fallback to colored div with text if image fails to load
        const fallbackDiv = document.createElement('div');
        fallbackDiv.className = 'group-image-fallback';
        fallbackDiv.style.backgroundColor = groupColor.primary;
        fallbackDiv.textContent = groupColor.name.charAt(0); // Use first letter as fallback
        this.parentNode.replaceChild(fallbackDiv, this);
    };
    
    const cardLabel = document.createElement('div');
    cardLabel.className = 'card-label';
    cardLabel.textContent = 'Click to Open';
    
    const groupLabel = document.createElement('div');
    groupLabel.className = 'group-label';
    groupLabel.textContent = `${groupColor.name} Group`;
    
    cardFront.appendChild(cardNumberElement);
    cardFront.appendChild(groupImageElement);
    cardFront.appendChild(cardLabel);
    cardFront.appendChild(groupLabel);
    
    // Set up back side content
    const messageIndex = (cardNumber - 1) % cardMessages.length;
    const cardData = cardMessages[messageIndex] || defaultCardMessages[messageIndex];
    
    // Handle both old string format and new object format
    let header, message, paragraph;
    if (typeof cardData === 'object' && cardData !== null) {
        header = cardData.header || `Card ${cardNumber}`;
        message = cardData.message || `Card ${cardNumber} message`;
        paragraph = cardData.paragraph || '';
    } else {
        // Fallback for old string format
        header = `Card ${cardNumber}`;
        message = cardData || `Card ${cardNumber} message`;
        paragraph = '';
    }
    
    const headerElement = document.createElement('div');
    headerElement.className = 'card-header';
    headerElement.textContent = header;
    
    const messageElement = document.createElement('div');
    messageElement.className = 'card-message';
    messageElement.textContent = message;
    
    const paragraphElement = document.createElement('div');
    paragraphElement.className = 'card-paragraph';
    paragraphElement.textContent = paragraph;
    
    const closeInstruction = document.createElement('div');
    closeInstruction.className = 'close-instruction';
    closeInstruction.textContent = 'Use × button to close';
    
    cardBack.appendChild(headerElement);
    cardBack.appendChild(messageElement);
    cardBack.appendChild(paragraphElement);
    cardBack.appendChild(closeInstruction);
    
    // Assemble the card
    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    card.appendChild(cardInner);
    card.appendChild(closeBtn);
    
    // Add click event listener
    card.addEventListener('click', function() {
        if (!card.classList.contains('opened')) {
            openCard(card);
        }
    });
    
    // Add card to container
    container.appendChild(card);
}

// Function to open a card (move it out and flip it)
function openCard(card) {
    // Close any other opened cards first
    const openedCards = document.querySelectorAll('.card.opened');
    openedCards.forEach(openedCard => {
        if (openedCard !== card) {
            closeCard(openedCard);
        }
    });
    
    // Update current card index based on the card number, not DOM position
    const cardNumber = parseInt(card.getAttribute('data-card-number'));
    currentCardIndex = cardNumber - 1;
    
    // Mark this card as viewed and opened in current group
    viewedCards.add(cardNumber);
    currentGroupOpenedCards.add(cardNumber);
    
    updateNavigation();
    
    // Open the clicked card
    card.classList.add('opened');
    
    // Flip the card after a short delay
    setTimeout(() => {
        card.classList.add('flipped');
    }, 300);
    
    // Check if all cards in current group are opened
    checkGroupCompletion();
}

// Function to check if current group is completed
function checkGroupCompletion() {
    const cardCount = defaultCardMessages.length; // Dynamic based on card data array
    const startCard = (currentGroup - 1) * cardsPerGroup + 1;
    const endCard = Math.min(currentGroup * cardsPerGroup, cardCount);
    const cardsInGroup = endCard - startCard + 1;
    
    if (currentGroupOpenedCards.size === cardsInGroup) {
        // All cards in current group are opened
        showGroupCompletionMessage();
    }
}

// Function to show group completion message and move to next group
function showGroupCompletionMessage() {
    const groupColor = groupColors[(currentGroup - 1) % groupColors.length];
    const message = `🎉 Congratulations! You completed the ${groupColor.name} Group! 🎉`;
    
    // Create success overlay
    const successOverlay = document.createElement('div');
    successOverlay.className = 'success-overlay';
    successOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;
    
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.style.cssText = `
        background: linear-gradient(135deg, ${groupColor.primary}, ${groupColor.secondary});
        color: white;
        padding: 40px;
        border-radius: 20px;
        text-align: center;
        font-size: 24px;
        font-weight: bold;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        animation: bounceIn 0.5s ease;
    `;
    successMessage.textContent = message;
    
    successOverlay.appendChild(successMessage);
    document.body.appendChild(successOverlay);
    
    // Auto-advance to next group after 3 seconds
    setTimeout(() => {
        document.body.removeChild(successOverlay);
        moveToNextGroup();
    }, 3000);
}

// Function to move to next group
function moveToNextGroup() {
    if (currentGroup < totalGroups) {
        currentGroup++;
        generateCurrentGroupCards();
        updateNavigation();
        updateGroupDisplay();
    } else {
        // All groups completed
        showGameCompletionMessage();
    }
}

// Function to show game completion message
function showGameCompletionMessage() {
    const message = '🏆 Amazing! You completed all groups! Congratulations! 🏆';
    
    const completionOverlay = document.createElement('div');
    completionOverlay.className = 'completion-overlay';
    completionOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7);
        background-size: 300% 300%;
        animation: gradient 3s ease infinite;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
    
    const completionMessage = document.createElement('div');
    completionMessage.style.cssText = `
        background: rgba(255, 255, 255, 0.9);
        color: #333;
        padding: 50px;
        border-radius: 25px;
        text-align: center;
        font-size: 28px;
        font-weight: bold;
        box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
        animation: pulse 2s infinite;
    `;
    completionMessage.innerHTML = `
        ${message}<br><br>
        <button onclick="resetGame()" style="
            background: #4ecdc4;
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 10px;
            font-size: 18px;
            cursor: pointer;
            margin-top: 20px;
        ">🔄 Play Again</button>
    `;
    
    completionOverlay.appendChild(completionMessage);
    document.body.appendChild(completionOverlay);
    
    // Store reference for cleanup
    window.completionOverlay = completionOverlay;
}

// Function to reset the entire game
function resetGame() {
    if (window.completionOverlay) {
        document.body.removeChild(window.completionOverlay);
        window.completionOverlay = null;
    }
    
    currentGroup = 1;
    currentGroupOpenedCards.clear();
    viewedCards.clear();
    generateCards();
}

// Function to update group display
function updateGroupDisplay() {
    const groupInfo = document.getElementById('groupInfo');
    if (groupInfo) {
        const groupColor = groupColors[(currentGroup - 1) % groupColors.length];
        const cardCount = defaultCardMessages.length; // Dynamic based on card data array
        groupInfo.innerHTML = `
            <span class="group-indicator">Group ${currentGroup} of ${totalGroups}</span>
            <span class="group-color">
                <img src="${groupColor.image}" alt="${groupColor.name}" style="width: 20px; height: 20px; border-radius: 3px; margin-right: 5px; vertical-align: middle;" onerror="this.style.display='none'">
                ${groupColor.name} Group
            </span>
            <span class="group-progress">${currentGroupOpenedCards.size}/${Math.min(cardsPerGroup, cardCount - (currentGroup - 1) * cardsPerGroup)} cards opened</span>
        `;
    }
}
function closeCard(card) {
    // Flip back first
    card.classList.remove('flipped');
    
    // Then move back to stack
    setTimeout(() => {
        card.classList.remove('opened');
        
        // Move card to the back of the stack
        moveCardToBack(card);
        
        // Update navigation after moving the card
        updateNavigation();
    }, 300);
}

// Function to move a card to the back of the stack
function moveCardToBack(card) {
    const container = card.parentNode;
    const allCards = Array.from(container.children);
    
    // Remove the card and append it at the end (back of stack)
    container.removeChild(card);
    container.appendChild(card);
    
    // Reassign z-index and positions for all cards
    const cards = Array.from(container.children);
    cards.forEach((c, index) => {
        const reverseIndex = cards.length - index;
        c.style.zIndex = reverseIndex + 10;
        c.style.top = `${index * 2}px`;
        c.style.left = `${index * 2}px`;
    });
}

// Function to reset all cards back to front
function resetAllCards() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.classList.remove('flipped', 'opened');
    });
    currentCardIndex = 0;
    currentGroupOpenedCards.clear(); // Reset current group tracker
    
    // Reset the stack order to original
    const container = document.getElementById('cardsContainer');
    const cardArray = Array.from(cards);
    
    // Sort cards by their data-card-number to restore original order
    cardArray.sort((a, b) => {
        return parseInt(a.getAttribute('data-card-number')) - parseInt(b.getAttribute('data-card-number'));
    });
    
    // Re-append cards in correct order and reset positioning
    cardArray.forEach((card, index) => {
        container.appendChild(card);
        card.style.zIndex = cardArray.length - index + 10;
        card.style.top = `${index * 2}px`;
        card.style.left = `${index * 2}px`;
    });
    
    updateNavigation();
    updateGroupDisplay();
}

// Function to reveal all cards in current group (open them one by one)
function revealAllCards() {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            openCard(card);
        }, index * 500); // Stagger the animations more
    });
}

// Add keyboard support
document.addEventListener('keydown', function(event) {
    switch(event.key) {
        case 'r':
        case 'R':
            resetAllCards();
            break;
        case 'v':
        case 'V':
            revealAllCards();
            break;
        case 'ArrowLeft':
            if (event.shiftKey) {
                goToPreviousGroup();
            } else {
                previousCard();
            }
            break;
        case 'ArrowRight':
            if (event.shiftKey) {
                goToNextGroup();
            } else {
                nextCard();
            }
            break;
    }
});

// Initialize the game with default cards when page loads
document.addEventListener('DOMContentLoaded', function() {
    // First check age verification
    const ageVerified = checkAgeVerification();
    
    // Only initialize game if age is already verified
    if (ageVerified) {
        initializeGame();
    }
    
    // Set up a listener for when age verification is completed
    window.addEventListener('ageVerified', function() {
        initializeGame();
    });
});

// Separate function to initialize the game
function initializeGame() {
    console.log('Initializing game...');
    console.log('groupColors defined:', typeof groupColors !== 'undefined');
    console.log('defaultCardMessages defined:', typeof defaultCardMessages !== 'undefined');
    
    // Check if groupColors is loaded
    if (typeof groupColors === 'undefined') {
        console.log('groupColors not loaded, retrying...');
        // Retry after a short delay
        setTimeout(initializeGame, 100);
        return;
    }
    
    // Check if defaultCardMessages is loaded
    if (typeof defaultCardMessages === 'undefined') {
        console.log('defaultCardMessages not loaded, retrying...');
        // Retry after a short delay
        setTimeout(initializeGame, 100);
        return;
    }
    
    console.log('Both data files loaded, generating cards...');
    generateCards();
}

// Navigation functions
function nextCard() {
    const cards = Array.from(document.querySelectorAll('.card'));
    const totalCards = cards.length;
    
    if (currentCardIndex < totalCards - 1) {
        // Close any opened card first
        const currentlyOpened = document.querySelector('.card.opened');
        if (currentlyOpened) {
            closeCard(currentlyOpened);
        }
        
        // Move the top card to the back without opening anything
        const topCard = cards.find(card => {
            const container = card.parentNode;
            const allCards = Array.from(container.children);
            return card === allCards[0]; // Find the first card in DOM (top of stack)
        });
        
        if (topCard) {
            moveCardToBack(topCard);
        }
        
        currentCardIndex++;
        updateNavigation();
    }
}

function previousCard() {
    const cards = Array.from(document.querySelectorAll('.card'));
    
    if (currentCardIndex > 0) {
        // Close any opened card first
        const currentlyOpened = document.querySelector('.card.opened');
        if (currentlyOpened) {
            closeCard(currentlyOpened);
        }
        
        // Move the bottom card to the top
        const container = document.getElementById('cardsContainer');
        const allCards = Array.from(container.children);
        const bottomCard = allCards[allCards.length - 1]; // Last card in DOM (bottom of stack)
        
        if (bottomCard) {
            // Move bottom card to top
            container.removeChild(bottomCard);
            container.insertBefore(bottomCard, container.firstChild);
            
            // Reassign z-index and positions for all cards
            const updatedCards = Array.from(container.children);
            updatedCards.forEach((c, index) => {
                const reverseIndex = updatedCards.length - index;
                c.style.zIndex = reverseIndex + 10;
                c.style.top = `${index * 2}px`;
                c.style.left = `${index * 2}px`;
            });
        }
        
        currentCardIndex--;
        updateNavigation();
    }
}

function updateNavigation() {
    const cards = document.querySelectorAll('.card');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const cardIndicator = document.getElementById('cardIndicator');
    const totalCards = cards.length;
    
    // For navigation, we can always go in either direction (cycling through stack)
    prevBtn.disabled = false;
    nextBtn.disabled = false;
    
    // Update card indicator to show which card is currently on top
    const container = document.getElementById('cardsContainer');
    if (container && container.firstChild) {
        const topCard = container.firstChild;
        const topCardNumber = parseInt(topCard.getAttribute('data-card-number'));
        if (cardIndicator) {
            cardIndicator.textContent = `Card: ${topCardNumber} | ${currentGroupOpenedCards.size}/${totalCards} opened`;
        }
    } else if (cardIndicator) {
        cardIndicator.textContent = `${currentCardIndex + 1} / ${totalCards}`;
    }
    
    // Update button tooltips
    prevBtn.title = 'Move bottom card to top';
    nextBtn.title = 'Move top card to bottom';
    
    // Update group display
    updateGroupDisplay();
}

// Group navigation functions
function goToPreviousGroup() {
    if (currentGroup > 1) {
        currentGroup--;
        generateCurrentGroupCards();
        updateNavigation();
        updateGroupDisplay();
    }
}

function goToNextGroup() {
    if (currentGroup < totalGroups) {
        currentGroup++;
        generateCurrentGroupCards();
        updateNavigation();
        updateGroupDisplay();
    }
}

// Simple function to load default card data
function loadCardData() {
    cardMessages = [...defaultCardMessages];
    cardEmojis = [...defaultCardEmojis];
}

// Add some fun sound effects (optional - requires user interaction first)
function playFlipSound() {
    // Create a simple beep sound using Web Audio API
    if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
    }
}

// Enhanced flip function with sound (optional)
function flipCardWithSound(card) {
    flipCard(card);
    try {
        playFlipSound();
    } catch (error) {
        // Silently fail if sound doesn't work
    }
}
